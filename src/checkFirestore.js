// src/checkFirestore.js
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase'; // Ensure this path is correct

// Initialize Firebase

const db = getFirestore(app);

// Check if Firestore is set up
async function checkFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'testCollection'));
    if (querySnapshot.empty) {
      alert('Firestore is set up, but no data found.');
    } else {
      alert('Firestore is set up and contains data.');
    }
  } catch (error) {
    alert('Error accessing Firestore:', error);
  }
}

checkFirestore();
