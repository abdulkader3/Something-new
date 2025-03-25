// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoBl2rjpJ16TXCiFy6AaU5IxL3VOZ0j_g",
  authDomain: "project-phoenix-11dde.firebaseapp.com",
  databaseURL: "https://project-phoenix-11dde-default-rtdb.firebaseio.com",
  projectId: "project-phoenix-11dde",
  storageBucket: "project-phoenix-11dde.firebasestorage.app",
  messagingSenderId: "725247710979",
  appId: "1:725247710979:web:f90c4009571dc7df8bfb36",
  measurementId: "G-6Y4VJV66JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export default app