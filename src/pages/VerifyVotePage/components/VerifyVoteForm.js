import React, { useState, useContext } from 'react';
import PropType from 'prop-types';
import { RECEIPTS as receipts } from '../../../backend/mock-server-calls';
import { getVoteDetails } from '../../../backend/api';
import VerifyVoteContext from '../../../context/VerifyVoteContext';
import { rSetError, rSetVote, rRemoveError } from '../../../reducers/receipt';

const VerifyVoteForm = ({ autoPopulate = false }) => {

  const { dispatch } = useContext(VerifyVoteContext);

  const [receiptNo, setReceiptNo] = useState(autoPopulate ? receipts[Math.floor(Math.random() * receipts.length)] : '');
  const [done, setDone] = useState(false);

  const onReceiptSubmit = (e) => {    
    e.preventDefault();
    
    getVoteDetails(receiptNo)
    .then(({ message, vote }) => {
      console.log(message);
      dispatch(rSetVote(vote));
      dispatch(rRemoveError());
      setDone(true);
    })
    .catch(error => {
      dispatch(rSetError(error.message));
    });
  }

  return (
    <div>
      <form onSubmit={onReceiptSubmit}>
        <label>Paste the receiptNo for the vote you'd like to retrieve</label><br />
        <textarea 
          value={receiptNo} 
          onChange={(e) => setReceiptNo(e.target.value)}
          disabled={done}
        ></textarea>
        <br />
        {!done && <button>Submit</button>}
      </form>
    </div>
  );
};

VerifyVoteForm.propTypes = {
  autoPopulate: PropType.bool
};

export default VerifyVoteForm;