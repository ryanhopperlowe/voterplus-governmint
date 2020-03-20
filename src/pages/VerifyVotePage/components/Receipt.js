import React from 'react';
import PropType from 'prop-types';
import { Card, StyledBody } from "baseui/card";
import { ListItem, ListItemLabel } from 'baseui/list';
import { Centered } from '../../../baseui/styling-formats';
import { Textarea } from 'baseui/textarea';
import { FormControl } from 'baseui/form-control';

const Receipt = ({ issue, selection, receiptNo = null, rtv = null }) => {

  return (
    <Centered>
      <Card>
        <StyledBody>
          <h2>Your vote was successfully counted</h2>
          <ul>
            <ListItem
              endEnhancer={() => issue}
            >
              <ListItemLabel>Issue</ListItemLabel>
            </ListItem>
            <ListItem
              endEnhancer={() => selection}
            >
              <ListItemLabel>Selection</ListItemLabel>
            </ListItem>
            <FormControl 
              label={() => !!receiptNo ? "Receipt Number" : "Voting Right"}
            >
              <Textarea
                disabled
                value={receiptNo || rtv}
              />
            </FormControl>
          </ul>
        </StyledBody>
      </Card>
    </Centered>
  );
};

Receipt.propTypes = {
  issue: PropType.string,
  selection: PropType.string,
  receiptNo: PropType.string,
  rtv: PropType.string
};


export default Receipt;