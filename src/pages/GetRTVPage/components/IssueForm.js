import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import GetRTVContext from '../../../context/GetRTVContext';
import { Select } from 'baseui/select';
import { Button } from 'baseui/button';
import { rSetIssue } from '../../../reducers/rtv';
import { FormControl } from 'baseui/form-control';

const IssueForm = ({ issues = [] }) => {
  const { state, dispatch, setError } = useContext(GetRTVContext);
  const [issue, setIssue] = useState('');

  const onIssueSelect = (e) => {
    e.preventDefault();

    const [ selectedIssue, ] = issue;    

    if (!selectedIssue || issues.indexOf(selectedIssue.value) < 0) {
      setError('Must select a valid Issue');
      return false;
    }
    dispatch(rSetIssue(selectedIssue.value));
  };

  return (
    <form onSubmit={onIssueSelect}>
      <FormControl label={() => "Select an issue to vote on:"}>
        <Select 
          value={issue}
          onChange={({ value }) => setIssue(value)}
          disabled={!!state.issue}
          placeholder="Select an issue"
          valueKey="value"
          options={issues.map((iss) => ({ label: iss, value: iss }))}
        />
      </FormControl>
      {!state.issue && <Button>Get Voting Right</Button>}
    </form>
  );
};

IssueForm.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.string)
};

export default IssueForm;