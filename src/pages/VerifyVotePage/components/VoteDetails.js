import React from 'react';
import PropType from 'prop-types';

const VoteDetails = ({ issue, selection, receiptNo = undefined, rtv = undefined }) => (
  <div>
    <h1>Vote Details:</h1>
    <hr />
    <h3><strong>Issue:</strong> {issue}</h3>
    <h4><strong>Selection:</strong> {selection}</h4>
    {(!!receiptNo || !!rtv) && (
      <div>
        <label>{!!receiptNo ? 'Receipt Number:' : 'Right to Vote:'}</label><br />
        <textarea disabled value={receiptNo || rtv}></textarea>
      </div>
    )}
  </div>
);

VoteDetails.propTypes = {
  issue: PropType.string,
  selection: PropType.string,
  receiptNo: PropType.string,
  rtv: PropType.string
};

export default VoteDetails;