// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPBca5ido1-6b_KfhtANvo7mIz64v2GB0",
  authDomain: "ascend-ai-43090.firebaseapp.com",
  projectId: "ascend-ai-43090",
  storageBucket: "ascend-ai-43090.firebasestorage.app",
  messagingSenderId: "715001915818",
  appId: "1:715001915818:web:34f07face47a29ce6963d3",
  measurementId: "G-VJ47XWFP0G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* SIGN UP (UPDATED FOR POPUP) */
window.signUp = function () {

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Enter a valid email");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account created!");
    })
    .catch(error => {
      alert(error.message);
    });
};

/* LOGIN */
window.login = function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "homescreen.html";
    })
    .catch(error => {
      alert(error.message);
    });
};

/* LOGOUT */
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

/* AUTH CHECK */
onAuthStateChanged(auth, (user) => {
  if (!user && window.location.pathname.includes("homescreen")) {
    window.location.href = "login.html";
  }
});