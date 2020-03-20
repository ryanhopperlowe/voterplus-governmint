import React, { useState, useReducer, useEffect } from 'react';
import { getVotingRight, getVoterIssues, loadKeys } from '../../backend/api';
import SSNForm from './components/SSNForm';
import IssueForm from './components/IssueForm';
import rtvReducer, { rSetRtv } from '../../reducers/rtv';
import GetRTVContext from '../../context/GetRTVContext';
import ErrorBox from '../../components/ErrorBox';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {Textarea} from 'baseui/textarea';
import { SIZE } from 'baseui/input';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Spinner } from '../../baseui/components';
import { Centered } from '../../baseui/styling-formats';
import { Notification, KIND } from 'baseui/notification';
import { Block } from 'baseui/block';


const GetRTVPage = () => {
  
  const [state, dispatch] = useReducer(rtvReducer, {
    ssn: '',
    issue: '',
    rtv: ''
  });

  const [notify, setNotify] = useState('');
  const [error, setError] = useState('');
  const [hasKeys, setHasKeys] = useState(false);
  const [availableIssues, setAvailableIssues] = useState([]);

  useEffect(() => {
    if (!!state.ssn)  {
      getVoterIssues(state.ssn)
      .then(({ data }) => {
        setAvailableIssues(data);
        setError('');
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
    }
  }, [state.ssn, dispatch]);

  useEffect(() => {
    if (!!state.issue) {
      getVotingRight(state.ssn, state.issue)
      .then(({ votingRight, signature, selectedVote }) => {

        dispatch(rSetRtv(votingRight));
        setError('');
      })
      .catch(err => {
        setError(err.message);
        console.error(err);
      });
    }
  }, [state.issue, state.ssn]);


  // On Component Mount
  // load GovernMint Public Key
  useEffect(() => {
    loadKeys()
    .then(() => {
      setHasKeys(true);
    })
    .catch(err => {
      console.error(err);
    });
  }, [])

  return (
    <Block
      width="80%"
      margin="auto"
    >
      <GetRTVContext.Provider value={{ state, dispatch, setError }}>

        {!hasKeys ? (
          <Centered>
            <Spinner />
          </Centered>
        ) : (
          <div>
            <SSNForm />
            {availableIssues.length > 0 && (
              <div>
                <IssueForm issues={availableIssues} />
                {!!state.rtv && (
                  <div>
                    <hr />
                    <FormControl
                      label={() => "Here is your Voting Right!"}
                    >
                      <Textarea 
                        value={state.rtv}
                        size={SIZE.large}
                        disabled
                      />
                    </FormControl>
                    {!notify && (
                      <CopyToClipboard
                        text={state.rtv}
                        onCopy={() => setNotify('Voting Right Copied to Clipboard')}
                      >
                        <Button>Copy to Clipboard</Button>
                      </CopyToClipboard>
                    )}
                  </div>
                )}
              </div>
            )}
            {!!notify && (
              <Notification kind={KIND.positive}>
                {notify}
              </Notification>
            )}
            <ErrorBox error={error} />
          </div>
        )}
      </GetRTVContext.Provider>
    </Block>
  );
}

export default GetRTVPage;