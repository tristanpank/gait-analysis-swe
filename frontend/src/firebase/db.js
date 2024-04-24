import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc, deleteDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { storage } from './firebaseConfig';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { listAll } from 'firebase/storage';
import { getAuth, updateProfile } from "firebase/auth";

/**
 * Sets user data in the database.
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

// Gets the array of video IDs for a user
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

// Gets the graph for a specific graph name for a user/vid in cloud storage
export async function getUserGraph(user, vid, graph) {
  const graphRef = ref(storage, `users/${user.uid}/videos/${vid}/graphs/${graph}`);
  const url = await getDownloadURL(graphRef);
  return url;
}

// Gets all the graphs for a user/vid in cloud storage
// Returns an object with the graph number as the key and the url as the value
export async function getAllGraphs(user, vid, videoData) {
  const graphRef = ref(storage, `users/${user.uid}/videos/${vid}/graphs`);
  const urls = {};
  const graphNames = videoData.graphs;
  const numToGraph = {
    11: "Left Shoulder",
    12: "Right Shoulder",
    13: "Left Elbow",
    14: "Right Elbow",
    23: "Left Hip",
    24: "Right Hip",
    25: "Left Knee",
    26: "Right Knee",
    27: "Left Ankle",
    28: "Right Ankle",
  }
  
  
  for (const graph of graphNames) {
    const url = await getDownloadURL(ref(graphRef, graph));
    urls[Number(graph.slice(3, 5))] = url;
  }

  return urls;
}

// Gets the injury data for a user/vid in cloud storage
// Returns an object with the injury name as the key and the injury data as the value
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

// Gets the video for a user/vid in cloud storage
export async function getUserVideo(user, vid) {
  const videoRef = ref(storage, `users/${user.uid}/videos/${vid}/pose.mp4`)
  const url = await getDownloadURL(videoRef);
  return url;
}

// Gets the video data for a user/vid in firestore
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

// Gets the video thumbnail for a user/vid in cloud storage
export async function getUserVideoThumbnail(user, vid) {
  const videoRef = ref(storage, `users/${user.uid}/videos/${vid}/thumbnail.jpg`)
  const url = await getDownloadURL(videoRef);
  return url;
}

// Changes the user's profile picture in firebase storage and auth
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

// Recursviely deletes all files for a storage ref
// Used for deleting a directory
export async function deleteFilesRecursively(storageRef) {
  const { items, prefixes } = await listAll(storageRef);
  for (const itemRef of items) {
    await deleteObject(itemRef);
  }
  for (const prefixRef of prefixes) {
    await deleteFilesRecursively(prefixRef);
  }
}

// Deletes a video from the database and storage
export async function deleteVideo(user, vid) {
  const videoRef = ref(storage, `users/${user.uid}/videos/${vid}`);
  const videoDoc = doc(db, "videos", vid);
  const userRef = doc(db, "users", user.uid);
  const video = await getDoc(videoDoc);
  const userDoc = await getDoc(userRef);
  try {
    // Deletes firebase doc of the video if vid belongs to user
    if (video.exists()) {
      if (video.data().uid !== user.uid) {
        console.error("User does not have permission to delete this video");
        return false;
      }
      await deleteDoc(videoDoc);
    }
    // Deletes all video files/subdirectories in storage
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

// Sets the height of a user in their database entry
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

// Retrieves the height of a user from their database entry
// If no height is found, returns 69 (5'9" which is average height)
export async function getUserHeight(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const data = await docSnap.data();
      const height = parseInt(data.height);
      if (isNaN(height) || height === null || height === undefined) {
        return 69;
      }
      return parseInt(data.height);
    } else {
      return 69;
    }
  } catch (error) {
    console.error(error);
    return error
  }
}

// Sets the display name of a user in their database entry
// This is used for the user's name in the app
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
