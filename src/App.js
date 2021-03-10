import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        console.log('fb user', user)

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          phot: '',
          email: '',
          password: '',
          error: '',
          isValid: false,
          existingUser: false
        }
        setUser(signedOutUser);
        console.log(res);
      })
      .catch(err => {

      })
  }

  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = e => {
    const createdUser = { ...user };
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }
  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    //debugger;
    // perform validation
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut} >Sign out</button> :
          <button onClick={handleSignIn} >Sign in</button>
      }
      <br />
      <button onClick={handleFbSignIn}>Sign in  using facebook</button>
      {
        user.isSignedIn && <div>
          <p> Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm" />
      <label htmlFor="switchForm"> New user sign up</label>
      <form style={{ display: user.existingUser ? 'block' : 'none' }} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required />
        <br />
        <input type="submit" value="SignIn" />
      </form>
      <form style={{ display: user.existingUser ? 'none' : 'block' }} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required />
        <br />
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required />
        <br />
        <input type="submit" value="Create Account" />
      </form>
      {
        user.error && <p style={{ color: 'red' }}>{user.error}</p>
      }
    </div>
  );
}

export default App;
