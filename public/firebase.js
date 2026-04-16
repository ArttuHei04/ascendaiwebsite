import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* FIREBASE CONFIG */

const firebaseConfig = {
  apiKey: "AIzaSyDPBca5ido1-6b_KfhtANvo7mIz64v2GB0",
  authDomain: "ascend-ai-43090.firebaseapp.com",
  projectId: "ascend-ai-43090",
  storageBucket: "ascend-ai-43090.appspot.com", //  korjattu
  messagingSenderId: "715001915818",
  appId: "1:715001915818:web:34f07face47a29ce6963d3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

/* =========================
   AUTH FUNCTIONS
========================= */

window.signUp = function () {

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account created!");
      window.location.href = "homescreen.html"; // 🔥 ohjaa oikein
    })
    .catch(err => alert(err.message));
};


window.login = function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "homescreen.html"; 
    })
    .catch(err => alert(err.message));
};


window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};


/* =========================
   AUTH STATE CONTROL (tärkeä)
========================= */

onAuthStateChanged(auth, (user) => {

  const path = window.location.pathname;

  //  jos EI kirjautunut → estä dashboard
  if (!user && path.includes("dashboard")) {
    window.location.href = "login.html";
  }

  //  jos EI kirjautunut → estä homescreen
  if (!user && path.includes("homescreen")) {
    window.location.href = "login.html";
  }

  // jos kirjautunut ja login sivulla → ohjaa homescreeniin
  if (user && path.includes("login")) {
    window.location.href = "homescreen.html";
  }

});