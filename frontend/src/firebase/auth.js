import {auth} from './firebaseConfig';

const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    return error;
  }
}

const createAccountWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    return error;
  }
}


export {signInWithEmailAndPassword, createAccountWithEmailAndPassword}