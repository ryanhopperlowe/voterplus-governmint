import React, { useContext, useState } from 'react';
import { MaskedInput } from 'baseui/input';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import GetRTVContext from '../../../context/GetRTVContext';
import { rSetSSN } from '../../../reducers/rtv';


const SSNForm = () => {
  const { state, dispatch, setError } = useContext(GetRTVContext);
  const [ssn, setSsn] = useState('');

  const regex = /((\d{3})-(\d{2})-(\d{4}))/;

  const onSubmitSsn = (e) => {
    e.preventDefault();

    console.log(ssn);
    
    if (regex.test(ssn)) {      
      dispatch(rSetSSN(ssn.replace(/-/g, '')));
    } else {
      setError('Invalid SSN!');
      return false;
    }
  };

  return (
    <form onSubmit={onSubmitSsn}>
      <FormControl
        label={() => "Enter Your Social Security Number Here:"}
        disabled={state.ssnReceived}
      >
        <MaskedInput 
          value={ssn}
          onChange={(e) => setSsn(e.target.value)}
          placeholder="SSN" 
          mask="999-99-9999"
        />
      </FormControl>
      {!state.ssnReceived && <Button>Submit</Button>}
    </form>
  );
}

export default SSNForm;