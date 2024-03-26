import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { storage } from './firebaseConfig';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { listAll } from 'firebase/storage';
import { getAuth, updateProfile } from "firebase/auth";

/**
 * Sets user data in the database.
 * @param {Object} user - The user object containing user information.
 * @returns {Object|Error} - The user object if successful, otherwise an error object.
 */
export async function setUserDB(user) {
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

export async function getAllVideos(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const data = await docSnap.data();
      return data.videos;
    } else {
      return []
    }
  } catch (error) {
    console.error(error);
    return error
  }
}

export async function getUserGraph(user, vid, graph) {
  const graphRef = ref(storage, `users/${user.uid}/videos/${vid}/graphs/${graph}`);
  const url = await getDownloadURL(graphRef);
  return url;
}

export async function getAllGraphs(user, vid, videoData) {
  const graphRef = ref(storage, `users/${user.uid}/videos/${vid}/graphs`);
  const urls = {};
  // console.log(videoData);
  const graphNames = videoData.graphs;
  
  // console.log(graphNames);
  for (const graph of graphNames) {
    const url = await getDownloadURL(ref(graphRef, graph));
    urls[Number(graph.slice(3, 5))] = url;
  }

  return urls;
}

export async function getInjuryData(user, vid) {
  const graphRef = ref(storage, `users/${user.uid}/videos/${vid}/graphs`);
  const injuryCollection = collection(db, "videos", vid, "injury_data");
  const snapshot = await getDocs(injuryCollection);
  let injuries = {}
  snapshot.forEach(async (doc) => {
    const docData = doc.data();
    injuries[docData.name] = docData;
    const url = await getDownloadURL(ref(graphRef, docData.graph));
    injuries[docData.name].url = url;
  });
  return injuries;
}

export async function getUserVideo(user, vid) {
  const videoRef = ref(storage, `users/${user.uid}/videos/${vid}/pose.mp4`)
  const url = await getDownloadURL(videoRef);
  return url;
}

export async function getVideoData(user, vid) {
  const video = await getDoc(doc(db,"videos", vid))
  try {
    if (video.exists()) {
      const data = await video.data();
      if (data.uid !== user.uid) {
        console.error("User does not have permission to view this video");
        return undefined;
      }
      return data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return error
  }
}

export async function getUserVideoThumbnail(user, vid) {
  const videoRef = ref(storage, `users/${user.uid}/videos/${vid}/thumbnail.jpg`)
  const url = await getDownloadURL(videoRef);
  return url;
}

export async function setUserPFP(user, file) {
  const pfpRef = ref(storage, `users/${user.uid}/pfp/pfp`);
  
  uploadBytes(pfpRef, file).then((snapshot) => {
    console.log('Uploaded Profile Picture');
  });

  const pfpURL = await getDownloadURL(pfpRef);
  const auth = getAuth();

  updateProfile(auth.currentUser, {
    photoURL: pfpURL
  }).then(() => {
    console.log("Profile Picture Updated");
    return 
  }).catch((error) => {
    console.error(error);
  });
}

export async function deleteFilesRecursively(storageRef) {
  const { items, prefixes } = await listAll(storageRef);
  for (const itemRef of items) {
    await deleteObject(itemRef);
  }
  for (const prefixRef of prefixes) {
    await deleteFilesRecursively(prefixRef);
  }
}

export async function deleteVideo(user, vid) {
  const videoRef = ref(storage, `users/${user.uid}/videos/${vid}`);
  const videoDoc = doc(db, "videos", vid);
  const userRef = doc(db, "users", user.uid);
  const video = await getDoc(videoDoc);
  const userDoc = await getDoc(userRef);
  try {
    if (video.exists()) {
      if (video.data().uid !== user.uid) {
        console.error("User does not have permission to delete this video");
        return false;
      }
      await deleteDoc(videoDoc);
    }
    await deleteFilesRecursively(videoRef);
    await updateDoc(userRef, {
      videos: userDoc.data().videos.filter((video) => video !== vid)
    });
    return true;
  } catch (error) {
    console.error(error);
    return error;
  }

}
export async function setUserHeight(user, height) {
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      height: height
    }, {merge: true});
    return height;

  } catch (error) {
    // Handle the error here
    console.error(error);
    return error;
  }
  
}

export async function getUserHeight(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const data = await docSnap.data();
      return parseInt(data.height);
    } else {
      return 0;
    }
  } catch (error) {
    console.error(error);
    return error
  }
}

export async function setUserDisplayName(user, name) {
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    displayName: name
  }).then(() => {
    console.log("Name Updated");
    return name;
  }).catch((error) => {
    console.error(error);
    return error;
  });
  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      displayName: name
    }, {merge: true});
    return name;
  } catch (error) {
    console.error(error);
    return error;
  }
  
}
