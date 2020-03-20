import uuid from "uuid";
import blindSigs from 'blind-signatures';


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

    const pubKey = blindSigs.keyGeneration();
    const nPubKey = pubKey.importKey(keyText, 'pkcs1-public-pem');

    console.log('loaded public key');
    console.log(`N: ${nPubKey.keyPair.n}`);
    
    resolve(nPubKey);
    
  });
};

function generateIssues(count = 10) {
  let issues = [];
  for (let i = 0; i < count; i++) {
    let options = [];
    const optCount = Math.floor(Math.random() * 2) + 2;
    if (optCount === 2) {
      options = [
        {
          name: 'yes',
          count: 0
        }, 
        {
          name: 'no',
          count: 0
        }
      ];
    } else {
      for (let k = 0; k < optCount; k++) {
        options.push({
          name: 'Option ' + (k + 1),
          count: 0
        });
      }
    }
    // issues.push('Issue #' + i);
    issues.push({
      name: 'Issue #' + i,
      totalCount: 0,
      options
    });
  }

  return issues;
}

function generateVotes(issues, count = 20) {
  let mappings = {};
  let receipts = [];
  let votes = [];

  for (let i = 0; i < count; i++) {
    let receiptNo = uuid();
    let rtv = uuid();

    receipts.push(receiptNo);

    let voteIssue = issues[Math.floor(Math.random() * issues.length)];
    const selection = voteIssue.options[Math.floor(Math.random() * voteIssue.options.length)].name
    votes.push({
      issue: voteIssue.name,
      selection,
      rtv
    });

    voteIssue.options.find((opt) => opt.name === selection).count++;
    voteIssue.totalCount++;

    mappings[receiptNo] = rtv;
  }

  return [ votes, receipts, mappings ];
}

let ISSUES = generateIssues(5);
const [ VOTES, RECEIPTS, MAPPINGS ] = generateVotes(ISSUES, 50);

console.log({ ISSUES, VOTES, RECEIPTS, MAPPINGS });

  

export { RECEIPTS };


export function getVoterIssues (ssn) {

  return new Promise((resolve, reject) => {
    resolve({
      data: ISSUES.map(({ name }) => name)
    });
  });
  
}

export function getVotingRight (ssn, issue) {

  return new Promise((resolve, reject) => {

    let votingRight = VOTES.find(({ issue: voteIssue }) => voteIssue === issue).rtv + '|' + uuid();
    let issueExists = !!ISSUES.find(({ name }) => name === issue);
    if (!issueExists) {
      reject({
        code: 1,
        message: 'Invalid Issue: ', issue
      });
    } else { 
      resolve({
        votingRight
      });
    }
  });

};

export function getVoteDetails (receiptNo) {
  return new Promise((resolve, reject) => {
    let voteRtv = MAPPINGS[receiptNo];
    if (!!voteRtv) {
      let vote = VOTES.find(({ rtv }) => rtv === voteRtv);
      resolve({
        message: 'Successfully retrieved vote details',
        vote
      });
    } else {
      reject({
        message: 'No vote was found for that Receipt Number',
        receiptNo
      });
    }
  });
}

export const getCountedVotes = () => new Promise((resolve, reject) => {
  let countingDetails = {};
  VOTES.forEach(vote => {
    const voteIssue = ISSUES.find(({ name }) => name === vote.issue);
    if (!!voteIssue) {
      if (!countingDetails[vote.issue]) {
        countingDetails[vote.issue] = {};
        voteIssue.options.forEach(opt => {
          countingDetails[vote.issue][opt] = 0;
        });
      }
      countingDetails[vote.issue][vote.selection]++;
    }
  });

  resolve({
    countingDetails
  })
});

getCountedVotes().then(({ countingDetails }) => console.log(countingDetails));

export const getSingleIssueDetails = (issue) => new Promise((resolve, reject) => {
  const issueDetails = ISSUES.find((iss) => iss.name === issue);

  if (!issueDetails) {
    reject(new Error(`No issue found for code name: ${issue}`));
    return;
  }

  resolve({
    issueDetails
  });
});

export const getSelectedIssueDetails = (params) => new Promise((resolve, reject) => {

  let { issueList = [], limit = -1 } = !!params ? params : { issueList: [], limit: -1 };

  if (!issueList || issueList.length === 0) {
    issueList = ISSUES.map((iss) => iss.name);
  }

  let issueDetails = [];

  const hardLimit = (limit > -1 && limit <= issueList.length) ? limit : issueList.length;
  let count = 0;

  if (issueList.length > 0) {
    issueList.forEach((issue, index) => {
      getSingleIssueDetails(issue)
      .then(({ issueDetails: detail }) => {
        issueDetails.push(detail);
        count++;

        if (count === hardLimit - 1 || index === issueList.length - 1) {
          resolve({
            issueDetails
          });
        }
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
    });
  } else {
    reject(new Error('No issues selected for data retrieval'));
  }



});