import Axios from 'axios';
import io from 'socket.io-client'
import blindSigs from 'blind-signatures';
import { Vote } from '../structures/Vote';
import utils from '../structures/utils';

// eslint-disable-next-line
const PUBLIC_IP = 'http://172.116.251.184:3389';
// eslint-disable-next-line
const SJSU_LOCAL_IP = 'http://10.250.199.180:4000';
// eslint-disable-next-line
const ALDRICH_WIFI_IP = 'http://10.42.0.228:4000';

const baseURL = ALDRICH_WIFI_IP;

const instance = () => Axios.create({
  baseURL
});

let pubKey;
export const loadKeys = async () => {
  return new Promise((resolve, reject) => {
    console.log('Loading Public key');

    let keyText = `-----BEGIN RSA PUBLIC KEY-----
    MIIBCgKCAQEAhCcaOOQuP9758rKmmtgyZcnDbOmj/aLVW5VJhg8oYrw6fDYwfA3k
    fzra/Q0JW7NIhUX6zJfKzxs3Me0kLVK3f3J0ztetZY7rApSIgggruF5qouK5GCcn
    C7PXZ5mGYIsqPz5ASLjSHqbqW81xK65Vk5iFUq8pA9WrmKXB4zFZ5sXohdieu3dy
    tInZXqbfD4+HJ6dkRo7tC3mmvH6aF2SXrasMRH5UiHe5zp509QWSgqz6gFQTL++9
    sTuZsyaH+NFluk5z17UqLr0cMHpUUulNMXqGONiqD5Ru3WH/773tJXpGDlNBADM4
    oI6SPNKu7qYguuNnkVoZWS8vJdXnaAL7TwIDAQAB
    -----END RSA PUBLIC KEY-----`;

    const pubKey1 = blindSigs.keyGeneration();
    const nPubKey = pubKey1.importKey(keyText, 'pkcs1-public-pem');

    console.log('loaded public key');
    console.log(`N: ${nPubKey.keyPair.n}`);
    
    pubKey = nPubKey;
    resolve(nPubKey);
  });
};

export const getVoterIssues1 = (ssn) => {
  console.log('getting voter issues');
  return instance().post('/getIssues', {
    ssn
  });
};

/**
 * Get issues associated with SSN
 * if voter has already received a voting right for an issue
 * then the issue will not show up in their selection
 * @param {string} ssn SSN of voter
 * @returns {Promise<any>} Array of available issues for submitted SSN
 */
export const getVoterIssues = (ssn) => new Promise((resolve, reject) => {
  instance().post('/getIssues', {
    ssn
  })
  .then(({ data }) => {
    resolve({ data });
  })
  .catch(err => {
    if (err.response.status === 404) {
      reject(new Error('No issues found for user: ' + ssn));
    } else {
      reject(err);
    }
  })
});


/**
 * Use SSN and Issue to securely get a Voting right from the GovernMint database
 * @param {string} ssn SSN of voter
 * @param {string} issue Desired issue to vote on
 * @returns {Promise<any>} Object containing { votingRight }
 */
export const getVotingRight = (ssn, issue) => {
  console.log(`getting voting right axios request for ${ssn} on ${issue}`);
  
  return new Promise((resolve, reject) => {

    // handle errors that happen during 5-way communication
    const handleError = (sock, eventString, err = new Error('Problem when retrieving Voting Right. Please try again!')) => {
      sock.off(eventString);
      sock.disconnect();
      console.error(err);
      reject({ 
        message: err.message || err
      });
    };

    const socket = io(baseURL);
    // console.log('Created socket');
    socket.on('connect', () => { //once socket is connected
      // console.log('Connected to socket');
      
      socket.emit('template_acquisition', { ssn, issue }); // request voting right for ssn and issue
      // console.log('sent template acquisition');

      // response includes voting right template and number of votes to generate
      socket.on('template_acquisition_response', ({ template, quantity, err: tempAckError = null }) => {

        // let { template, quantity, err: tempAckError = null } = template_acquisition_response;

        if (!!tempAckError) { // if server responds with an error
          handleError(socket, 'template_acquisition_response', tempAckError);
          return;
        }

        // console.log('Received Template', template);
        // console.log('Producing ' + quantity + ' Votes');

        let generatedVotes = [];
        let blindVoteHashes = [];
        // generate @quantity # of unique Vote objects using the same data
        for (let i = 0; i < quantity; i++) {
          const tempVote = new Vote(template, ssn, pubKey.keyPair.e, pubKey.keyPair.n);
          blindVoteHashes.push(tempVote.blinded);
          generatedVotes.push(tempVote);
          console.log('Made vote ' + (i + 1) + ' ', tempVote.toString());
        }
        
        socket.off('template_acquisition_response');

        socket.emit('blind_sig_select', { ssn, issue, blindVoteHashes }); // send array of blinded votes

        socket.on('blind_sig_select_response', (blind_sig_select_response) => {
          console.log(blind_sig_select_response);

          // let { index, err: blindSigSelectError = null } = blind_sig_select_response;
          
          let index = blind_sig_select_response.index; // server responds with selected index from blindVoteHashes array
          let blindSigSelectError = blind_sig_select_response.err || null;

          if (!!blindSigSelectError) { // if server responds with an error
            handleError(socket, 'blind_sig_select_response', blindSigSelectError);
            return;
          }

          console.log(`Got blind signature selection. Server selected hash with index of ${index}`);

          const bFactors = [];
          const rawVotes = [];
          const hashedVotes = [];

          generatedVotes.forEach(({ blindingFactor, rawVote }, i) => {
            // if generated vote has the governmint selected index, then push undefined into respective arrays
            // reason is so that selected/validated blinding factor, raw vote, and vote hash doesn't get sent over network
            if (index === i) {
              bFactors.push(undefined);
              rawVotes.push(undefined);
              hashedVotes.push(undefined);
              return;
            }

            bFactors.push(blindingFactor)
            rawVotes.push(rawVote)
            hashedVotes.push(utils.hash(rawVote))
          });             

          //stop listening to blind_sig_response here
          socket.off('blind_sig_select_response');

          // send arrays of invalid vote data to database
          // the actual voting right (given to voter) is not sent
          // database will know that the correct rtv was chosen 
          // because the vote object at the selected index will be undefined
          socket.emit('blind_sig_reveal', { ssn, issue, bFactors, rawVotes, hashedVotes });

          socket.on('blind_sig_reveal_response', ({ signature, err: blindSigRevealError = null }) => {
            // let { signature, err: blindSigRevealError = null } = blind_sig_reveal_response;

            if (!!blindSigRevealError) {
              handleError(socket, 'blind_sig_reveal_response', blindSigRevealError);
              return;
            }
            // socket not needed once blind sig is revealed
            // disconnect
            socket.off('blind_sig_reveal_response');
            socket.disconnect();
            // update the signature of selected vote
            const selectedVote = generatedVotes[index];
            selectedVote.updateGovSig(signature);

            const sigVerification = {
              unblinded: selectedVote.signature,
              N: pubKey.keyPair.n,
              E: pubKey.keyPair.e,
              message: selectedVote.rawVote
            };

            // console.log(sigVerification);
            // verify the signature sent from database
            const isValidGovtSig = blindSigs.verify(sigVerification);

            if (!isValidGovtSig) {
              const error = new Error("GovernMint signature could not be verified on selected Voting Right");
              reject(error);
            }

            // concattenate voting right with signature for ease of copy/paste
            const votingRight = selectedVote.toString() + '|' + selectedVote.signature;

            resolve({
              votingRight,
              signature: selectedVote.signature,
              selectedVote: selectedVote.toString()
            });
          });

        });
      });
    });

  });
  
};

export function getVoteDetails(receiptNo) {
  return new Promise((resolve, reject) => {
    reject({
      ...(new Error('GetVoteDetails has no connection to the database')),
      code: 1
    });
  })
  
}

export const getSelectedIssueDetails = (issueList = ['COMDOM']) => new Promise((resolve, reject) => {
  if (issueList.length < 1) {
    reject(new Error('No issues selected to show details for.'));
  }

  let issueDetails = [];
  
  issueList.forEach((issue, index) => {
    instance().get('issues/' + issue)
    .then(response => {
      console.log(response);
      issueDetails.push(response.data);

      if (index === issueList.length - 1) {
        console.log(issueList);
        
        resolve({
          issueDetails
        });
      }
    })
    .catch(error => {
      console.error(error);
      reject(error);
    });
  })
});

// getSelectedIssueDetails();