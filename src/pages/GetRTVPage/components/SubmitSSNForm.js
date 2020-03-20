import React, { useState, useContext, useEffect } from 'react';
import GetRTVContext from '../../../context/GetRTVContext';
import { rSetSSN } from '../../../reducers/rtv';

const SubmitSSNForm = () => {
  const { state, dispatch, setError } = useContext(GetRTVContext);
  const [ssn, setSsn] = useState('');
  const [block1, setBlock1] = useState('');
  const [block2, setBlock2] = useState('');
  const [block3, setBlock3] = useState('');

  useEffect(() => {
    setSsn(block1 + '-' + block2 + '-' + block3);
  }, [block1, block2, block3]);

  const onSubmitSsn = (e) => {
    e.preventDefault();
    if (regex.test(ssn)) {      
      dispatch(rSetSSN(ssn.replace(/-/g, '')));
    } else {
      setError('Invalid SSN!');
      return false;
    }
  };

  const regex = /((\d{3})-(\d{2})-(\d{4}))/;

  return (
    <div>
      <form onSubmit={onSubmitSsn}>
        <label>Enter your ssn here!</label>
        <input 
          type="text"
          value={block1}
          disabled={state.ssnReceived}
          maxLength={3}
          width={3}
          onChange={e => {
            let input = e.target.value;
            if (input.length > 0) {
              input.match(new RegExp('[\\d]{' + input.length + '}')) && setBlock1(input);
            } else {
              setBlock1(input);
            }

            if (input.length === e.target.maxLength) {
              e.target.nextElementSibling.focus();
            }
          }}
        />
        -
        <input 
          type="text"
          value={block2}
          disabled={state.ssnReceived}
          maxLength={2}
          width={2}
          onChange={e => {
            let input = e.target.value;
            if (input.length > 0) {
              input.match(new RegExp('[\\d]{' + input.length + '}')) && setBlock2(input);
            } else {
              setBlock2(input);
            }

            if (input.length === e.target.maxLength) {
              e.target.nextElementSibling.focus();
            }
          }}
        />
        -
        <input 
          type="text"
          value={block3}
          disabled={state.ssnReceived}
          maxLength={4}
          width={4}
          onChange={e => {
            let input = e.target.value;
            if (input.length > 0) {
              input.match(new RegExp('[\\d]{' + input.length + '}')) && setBlock3(input);
            } else {
              setBlock3(input);
            }
          }}
        />

        {!state.ssnReceived && <button>Submit</button>}
      </form>
    </div>
  );
};

export default SubmitSSNForm;