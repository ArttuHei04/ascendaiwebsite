import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================
   TAB SYSTEM
========================= */

window.showTab = function (tabId) {

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");

  const title = tabId.charAt(0).toUpperCase() + tabId.slice(1);
  document.getElementById("page-title").textContent = title;
};


/* =========================
   CHAT SYSTEM
========================= */

const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

if (input) {
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
}

window.sendMessage = async function () {

  const msg = input.value.trim();
  if (!msg) return;

  appendMessage("user", msg);
  input.value = "";

  const typing = appendMessage("bot", "AI is thinking...");

  try {

    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    typing.remove();
    appendMessage("bot", data.reply || "No response.");

  } catch (err) {

    typing.remove();
    appendMessage("bot", "⚠️ Error connecting to AI.");

  }
};

function appendMessage(sender, text) {

  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  return div;
}


/* =========================
   PLAN SYSTEM
========================= */

let currentUser = null;

/* 🔐 AUTH STATE */

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loadPlan();
  }
});


/* 📥 LOAD PLAN */

async function loadPlan() {

  if (!currentUser) return;

  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    renderPlan(snap.data().plan);
  }
}


/* 🚀 GENERATE PLAN */

window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("generate-plan");

  if (btn) {
    btn.addEventListener("click", generatePlan);
  }

});


async function generatePlan() {

  const btn = document.getElementById("generate-plan");

  btn.textContent = "Generating...";
  btn.disabled = true;

  const answers = {
    goal: "better jawline, clear skin",
    fitness: "average",
    sleep: "6-7h"
  };

  try {

    const res = await fetch("/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ answers })
    });

    const data = await res.json();

    if (data.plan) {

      const ref = doc(db, "users", currentUser.uid);

      await setDoc(ref, {
        plan: data.plan
      });

      renderPlan(data.plan);
    }

  } catch (err) {
    alert("Error generating plan");
    console.error(err);
  }

  btn.textContent = "Regenerate Plan";
  btn.disabled = false;
}


/* 🎨 RENDER PLAN */

function renderPlan(plan) {

  const list = document.getElementById("plan-list");
  list.innerHTML = "";

  if (!plan.habits) return;

  plan.habits.forEach((h) => {

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = h.done;

    checkbox.addEventListener("change", async () => {

      h.done = checkbox.checked;

      const ref = doc(db, "users", currentUser.uid);

      await updateDoc(ref, {
        plan: plan
      });

    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(" " + h.task));

    list.appendChild(li);

  });

}