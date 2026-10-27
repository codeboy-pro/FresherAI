// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fresherai-5203e.firebaseapp.com",
  projectId: "fresherai-5203e",
  storageBucket: "fresherai-5203e.firebasestorage.app",
  messagingSenderId: "463578596970",
  appId: "1:463578596970:web:79027d0c1cf30746bb2c13",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth=getAuth(app);

const provider=new GoogleAuthProvider();

export {auth,provider};
