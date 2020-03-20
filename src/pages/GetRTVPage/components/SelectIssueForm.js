import React, { useContext, useState } from 'react';
import GetRTVContext from '../../../context/GetRTVContext';
import { rSetIssue } from '../../../reducers/rtv';
import PropTypes from 'prop-types';

const SelectIssueForm = ({ issues }) => {
  const { state, dispatch, setError } = useContext(GetRTVContext);
  // const issues = state.availableIssues;

  const [issue, setIssue] = useState('');

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();

        if (issue.length < 1) {
          setError('Must select a valid Issue');
          return false;
        }
        dispatch(rSetIssue(issue));
      }}>
        <label>Select Issue to Vote on</label>
        <select 
          onChange={(e) => setIssue(e.target.value)} 
          disabled={issues.length < 1 || !!state.issue}
        >
          <option value="">Select an Issue</option>
          {issues.map((iss) => (
            <option key={iss} value={iss}>{iss}</option>
          ))}
        </select>

        {!state.issue && <button>Submit</button>}
      </form>
    </div>
  );
};

SelectIssueForm.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.string)
};

export default SelectIssueForm;