import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { storage } from './firebaseConfig';
import { ref, getDownloadURL} from 'firebase/storage';

/**
 * Sets user data in the database.
 * @param {Object} user - The user object containing user information.
 * @returns {Object|Error} - The user object if successful, otherwise an error object.
 */
async function setUserDB(user) {
  try {
    // Check if the user already exists in the database
    const userRef = doc(db, "users", user.uid);
    const userExists = await getDoc(userRef);

    // If the user does not exist, set the user data in the database
    if (!userExists.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      });
    }

    // Return the user object
    return user;
  } catch (error) {
    // Handle the error here
    console.error(error);
    return error;
  }
}

async function getAllVideos(user) {
  try {
    console.log('1');
    const userRef = doc(db, "users", user.uid);
    console.log('2');
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data().videos;
    } else {
      return []
    }
  } catch (error) {
    console.error(error);
    return error
  }
}

export { setUserDB, getUserVideo };