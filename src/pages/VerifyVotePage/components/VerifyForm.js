import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import VerifyVoteContext from '../../../context/VerifyVoteContext';
import { FormControl } from 'baseui/form-control';
import { Textarea } from 'baseui/textarea';
import { RECEIPTS as receipts } from '../../../backend/mock-server-calls';
import { getVoteDetails } from '../../../backend/api';
import { rSetVote } from '../../../reducers/receipt';
import { Button } from 'baseui/button';

const VerifyVoteForm = ({ autoPopulate }) => {
  const { state, dispatch, setError } = useContext(VerifyVoteContext);
  const [receiptNo, setReceiptNo] = useState(autoPopulate ? receipts[Math.floor(Math.random() * receipts.length)] : '');

  const onReceiptSubmit = (e) => {    
    e.preventDefault();
    
    getVoteDetails(receiptNo)
    .then(({ message, vote }) => {
      console.log(message);
      dispatch(rSetVote(vote));
      setError('');
    })
    .catch(error => {
      setError(error.message)
    });
  }

  return (
    <form onSubmit={onReceiptSubmit}>
      <FormControl label="Paste your receipt here:">
        <Textarea
          value={receiptNo}
          onChange={(e) => setReceiptNo(e.target.value)}
          disabled={!!state.vote.selection}
        />
      </FormControl>
      {!state.successfulVoteRetrieval && <Button>Submit</Button>}
    </form>
  );
};

VerifyVoteForm.propTypes = {
  autoPopulate: PropTypes.bool
};

export default VerifyVoteForm;