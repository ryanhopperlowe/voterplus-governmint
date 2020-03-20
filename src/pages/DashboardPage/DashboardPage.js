import React from 'react';
import Dashboard from './components/Dashboard';
import { Block } from 'baseui/block';

const DashboardPage = () => {

  return (
    <Block
      width="80%"
      margin="auto"
    >
      <Dashboard />
    </Block>
  );
};

export default DashboardPage;