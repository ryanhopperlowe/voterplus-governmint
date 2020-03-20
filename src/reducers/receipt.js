
const receiptReducer = (state, action) => {
  switch (action.type) {

    case 'SET_VOTE':
      return {
        ...state,
        vote: action.vote,
        successfulVoteRetrieval: true
      };
    
    case 'SET_FULL_VOTE':
      return {
        ...state,
        issue: action.vote.issue,
        selection: action.vote.selection,
        rtv: action.vote.rtv
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error
      };

    default: 
      return state;
  }
};

export default receiptReducer;

export const rSetError = (error) => ({
  type: 'SET_ERROR',
  error
});

export const rSetVote = (vote) => ({
  type: 'SET_VOTE',
  vote
});

export const rSetFullVote = (vote) => ({
  type: 'SET_FULL_VOTE',
  vote
});

export const rRemoveError = () => ({
  type: 'SET_ERROR',
  error: ''
});