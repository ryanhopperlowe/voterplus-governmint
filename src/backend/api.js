import * as mock from "./mock-server-calls";
import * as db from "./server-calls";

const getServerCalls = (calls) => ({ ...calls });

const getEnvCalls = (env = process.env.NODE_ENV) => {
  console.log(`Running in ${env}.`);
  
  switch (env) {
    case 'production':
      return getServerCalls(db);
    
    case 'development':
      return getServerCalls(mock);
    
    default:
      throw new Error('Error DB could not retrieve any functions');
  }
};

const { getVoterIssues, getVotingRight, getVoteDetails, loadKeys, getSelectedIssueDetails } = getEnvCalls();

export { getVoterIssues, getVoteDetails, getVotingRight, loadKeys, getSelectedIssueDetails };