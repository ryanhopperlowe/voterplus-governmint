import React from 'react';
import PropTypes from 'prop-types';
import { Notification, KIND } from 'baseui/notification';

const ErrorBox = ({ error }) => !!error && (
  <Notification kind={KIND.negative}>
    {() => error}
  </Notification>
);

ErrorBox.propTypes = {
  error: PropTypes.string
};

export default ErrorBox;