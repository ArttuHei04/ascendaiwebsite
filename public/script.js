function showTab(tabId) {

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");

  const title = tabId.charAt(0).toUpperCase() + tabId.slice(1);
  document.getElementById("page-title").textContent = title;
}


/* CHAT SYSTEM */

const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");


/* Enter key support */

input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});


async function sendMessage() {

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

    appendMessage("bot", data.reply || "No response from AI.");


  } catch (err) {

    typing.remove();

    appendMessage("bot", "⚠️ Could not connect to AI.");

    console.error(err);

  }

}


function appendMessage(sender, text) {

  const div = document.createElement("div");

  div.classList.add("message", sender);

  div.textContent = text;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;

  return div;

}