import {auth} from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { setUserDB } from './db';

/**
 * Sign in a user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves to the user object if successful, or an error object if unsuccessful.
 */
const signInEmailPassword = async (email, password) => {
  try {
    // Sign in with email and password using the signInWithEmailAndPassword method
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user);
    return user;
  } catch (error) {
    return error;
  }
}

/**
 * Creates a new user account with the provided email and password.
 * 
 * @param {string} email - The email address for the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<Object>} - A promise that resolves to the user object if the account creation is successful, or rejects with an error if there's an error.
 */
const createAccountEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setUserDB(user);
    console.log(user);
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
    console.log(user);
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