// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8QX7pn02ctS7BQMl1mAk4uiZYCQkO2WA",
  authDomain: "lockedin-e0133.firebaseapp.com",
  projectId: "lockedin-e0133",
  storageBucket: "lockedin-e0133.firebasestorage.app",
  messagingSenderId: "249457445170",
  appId: "1:249457445170:web:15f11b88cb4f1b89cf6f2b",
  measurementId: "G-4EKFQ6Z5ZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Firebase Authentication Helper Functions
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // If you need to use the token later, uncomment the line below
    // const token = credential.accessToken;
    // The signed-in user info.
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error logging out:', error.message);
    throw error;
  }
};

const getCurrentUser = () => {
  return auth.currentUser;
};

const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Update user email
const updateUserEmail = async (newEmail) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user is currently logged in');
    
    await updateEmail(user, newEmail);
    return true;
  } catch (error) {
    console.error('Error updating email:', error.message);
    throw error;
  }
};

// Update user password
const updateUserPassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user is currently logged in');
    
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    console.error('Error updating password:', error.message);
    throw error;
  }
};

// Connect to Firebase emulator in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Using Firebase in development mode');
}

export {
  app,
  db,
  auth, 
  registerUser, 
  loginUser, 
  signInWithGoogle,
  logoutUser, 
  getCurrentUser, 
  onAuthStateChange,
  updateUserEmail,
  updateUserPassword
};
