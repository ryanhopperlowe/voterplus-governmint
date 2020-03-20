
const rtvReducer = (state, action) => {
  switch (action.type) {
  
    case 'SET_SSN':
      return {
        ...state,
        ssn: action.ssn,
        ssnReceived: true
      };

    case 'SET_ISSUE':
      return {
        ...state,
        issue: action.issue
      };

    case 'SET_RTV':
      return {
        ...state,
        rtv: action.rtv
      };

    case 'SET_SIGNATURE':
      return {
        ...state,
        signature: action.signature
      };

    default:
      return state;
  }
};

export default rtvReducer;

export const rSetSSN = (ssn) => ({
  type: 'SET_SSN',
  ssn
});

export const rSetIssue = (issue) => ({
  type: 'SET_ISSUE',
  issue
});

export const rSetRtv = (rtv) => ({
  type: 'SET_RTV',
  rtv
});

export const rSetSignature = (signature) => ({
  type: 'SET_SIGNATURE',
  signature
});