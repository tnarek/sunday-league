import React, { useState, useContext } from 'react';
import { useFirebaseAuth } from '../../api/services/firebase_auth';
import UserContext from '../../contexts/authentication/user_context';

const SignIn = () => {
  const {
    signIn,
    confirmCode,
    signOut,
    isConfirming,
    errors
  } = useFirebaseAuth('recaptcha-verifier');

  const { currentUser } = useContext(UserContext);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');

  return (
    <div>
      {errors && <p>Something went wrong</p>}
      {
        currentUser && currentUser.signedIn ?
          <div>
            <p>Already Signed In: Log out?</p>
            <button onClick={signOut}>Sign out</button>
          </div> :
          <div>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <button id="recaptcha-verifier" onClick={() => signIn(phoneNumber)}>Sign in</button>
            {isConfirming ?
              <div>
                <input type="number" value={code} onChange={(e) => setCode(e.target.value)} />
                <button onClick={() => confirmCode(code)}>Confirm Code</button>
              </div> : null
            }
          </div>
      }
    </div>
  )
};

export default SignIn;