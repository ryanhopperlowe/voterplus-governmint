import React from 'react';
import { Spinner as BaseSpinner } from 'baseui/spinner';
import { Notification, KIND } from 'baseui/notification';

export const Spinner = (props) => (
  <BaseSpinner {...props} />
);

export const NotifyInfo = (props) => {
  return (
    <Notification {...props} kind={KIND.info}>
      {() => props.content}
    </Notification>
  );
};