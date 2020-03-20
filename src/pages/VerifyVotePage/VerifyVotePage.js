import React, { useReducer, useState } from 'react';
import VerifyVoteForm from './components/VerifyForm';
import ErrorBox from '../../components/ErrorBox';
import receiptReducer from '../../reducers/receipt';
import VerifyVoteContext from '../../context/VerifyVoteContext';
import Receipt from './components/Receipt';
import { Block } from 'baseui/block';

const VerifyVotePage = () => {

  const [error, setError] = useState('');

  const [state, dispatch] = useReducer(receiptReducer, {
    successfulVoteRetrieval: false,
    vote: {}
  });

  return (
    <Block
      width="80%"
      margin="auto"
    >
      <VerifyVoteContext.Provider value={{ state, dispatch, setError }}>
        {!state.successfulVoteRetrieval ? (
          <VerifyVoteForm autoPopulate={true} />
        ) : (
          <Receipt {...state.vote} />
        )}
        <ErrorBox error={error} />
      </VerifyVoteContext.Provider>
    </Block>
  );
};

export default VerifyVotePage;