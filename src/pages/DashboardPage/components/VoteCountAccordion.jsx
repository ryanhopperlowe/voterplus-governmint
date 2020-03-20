import React, { useState, useEffect } from 'react';
import { getSelectedIssueDetails } from '../../../backend/api';
import { Accordion, Panel } from 'baseui/accordion';
import { ProgressBar } from 'baseui/progress-bar';

const VoteCountAccordion = () => {

  const [voteCounts, setVoteCounts] = useState([]);

  useEffect(() => {
    getSelectedIssueDetails()
    .then(({ issueDetails }) => {
      console.log(issueDetails);
      setVoteCounts(issueDetails)
    })
    .catch(error => {
      console.error(error);
    })
  }, [])


  return (
    <Accordion
      onChange={({ expanded }) => console.log(expanded)}
    >
      {!!voteCounts && voteCounts.map((issue) => (
        <Panel key={issue.name} title={issue.name}>
          {issue.options.map((opt) => (
            <ProgressBar
              key={opt.name} 
              value={100 * opt.count / issue.totalCount}
              getProgressLabel={(value) => `${opt.name}: ${value.toFixed(2)}%`}
              showLabel
              overrides={{
                BarProgress: {
                  style: ({$theme, $value}) => {
                    return {
                      ...$theme.typography.font350,
                      backgroundColor: opt.name === 'no' ? $theme.colors.negative : $theme.colors.positive,
                      color: $theme.colors.mono200,
                    };
                  }
                }
              }}
            />
          ))}
        </Panel>
      ))}
    </Accordion>
  );
};

export default VoteCountAccordion;