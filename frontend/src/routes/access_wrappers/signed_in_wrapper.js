import { Route, Redirect } from 'react-router-dom';
import React, { useContext } from 'react';
import UserContext from '../../contexts/user/user_context';

const SignedInWrapper = ({ children }, ...rest) => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser.loaded) {
    return <p>Loading...</p>
  }

  if (currentUser.loaded && !currentUser.signedIn) {
    return <Redirect to="/sign-in" />
  }

  return (
    <Route {...rest}>
      {children}
    </Route>
  );
};

export default SignedInWrapper;