import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import Header from '../components/HeaderNav';
import GetRTVPage from '../pages/GetRTVPage/GetRTVPage';
import VerifyVotePage from '../pages/VerifyVotePage/VerifyVotePage';

const AppRouter = () => (
  <BrowserRouter basename="/">
    <div>
      <Header />
      <Switch>
        <Route path="/" component={DashboardPage} exact />
        <Route path="/getrtv" component={GetRTVPage} />
        <Route path="/verify" component={VerifyVotePage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;