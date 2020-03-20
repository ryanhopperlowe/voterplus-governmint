import React, { useEffect, useState } from 'react';
import { getSelectedIssueDetails } from '../../../backend/api';
import { Accordion, Panel } from 'baseui/accordion';
import { ProgressBar } from 'baseui/progress-bar';
import {Block} from 'baseui/block'
import VoteCountAccordion from './VoteCountAccordion';

const Dashboard = () => {

  return (
    <div>
      <h1>Check the Polls!</h1>
      <VoteCountAccordion />
    </div>
  );
};

export default Dashboard;