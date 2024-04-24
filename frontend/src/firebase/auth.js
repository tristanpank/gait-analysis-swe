import {auth} from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { setUserDB } from './db';

/**
 * Sign in a user with email and password.
 */
const signInEmailPassword = async (email, password) => {
  try {
    // Sign in with email and password using the signInWithEmailAndPassword method
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    return error;
  }
}

/**
 * Creates a new user account with the provided email and password.
 */
const createAccountEmailPassword = async (email, password, displayName=null, photoURL=null) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    let user = userCredential.user;
    user = {
      ...user, 
      displayName: displayName,
      photoURL: photoURL
    }
    await setUserDB(user);
    return user;
  } catch (error) {
    return error;
  }
}

/**
 * Sign in with Google provider.
 * @returns {Promise<Object|Error>} A promise that resolves with the user object if successful, or rejects with an error if unsuccessful.
 */
const signInWithGoogle = async () => {
  // Create a new instance of the GoogleAuthProvider
  const provider = new GoogleAuthProvider();
  try {
    // Sign in with a popup window using the GoogleAuthProvider
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    // Save the user to the database
    await setUserDB(user);
    return user;
  } catch (error) {
    return error;
  }
}

const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    return error;
  }
}


export {signInEmailPassword, createAccountEmailPassword, signInWithGoogle, signOutUser}