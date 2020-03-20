import React from 'react';

import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem
} from "baseui/header-navigation";
import { NavLink } from 'react-router-dom';

const Header = () => {

  return (
    <HeaderNavigation>
      <StyledNavigationList $align={ALIGN.left}>
        <StyledNavigationItem>
          <h1>
            GovernMint - Voter Plus
          </h1>
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.center} />
      <StyledNavigationList $align={ALIGN.right}>
        <StyledNavigationItem>
          <NavLink to="/">Home</NavLink>
        </StyledNavigationItem>
        <StyledNavigationItem>
          <NavLink to="/getrtv">Get Voting Right</NavLink>
        </StyledNavigationItem>
        <StyledNavigationItem>
          <NavLink to="/verify">Verify Vote</NavLink>
        </StyledNavigationItem>
      </StyledNavigationList>
    </HeaderNavigation>
  );
}

export default Header;