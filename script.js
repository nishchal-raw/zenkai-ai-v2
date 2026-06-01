import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getAuth,
GoogleAuthProvider,
signInWithRedirect,
signInWithPopup,
signOut,
onAuthStateChanged,
getRedirectResult
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

/* FIREBASE CONFIG */

const firebaseConfig = {
apiKey: "AIzaSyDIN5KnisDqOwWgOiaPSEmvXzeP5q5Dbqk",
authDomain: "zenkaiai.firebaseapp.com",
projectId: "zenkaiai",
storageBucket: "zenkaiai.firebasestorage.app",
messagingSenderId: "298539306658",
appId: "1:298539306658:web:c594741c7da5ff620b51fb",
measurementId: "G-JW9XPVZ7EP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* GEMINI KEY */

const GEMINI_API_KEY = "YAHAN_APNI_GEMINI_API_KEY_DALNA";

/* CHAT STORAGE */

let allChats =
JSON.parse(localStorage.getItem("zenkaiChats")) || [];

if(allChats.length === 0){
allChats.push([]);
}

let currentChat =
allChats[allChats.length - 1];

/* GOOGLE LOGIN */

window.googleLogin = function(){

if(window.innerWidth < 768){

signInWithRedirect(auth, provider);

}else{

signInWithPopup(auth, provider)

.then((result)=>{

alert("Welcome " + result.user.displayName);

})

.catch((error)=>{

alert(error.message);

});

}

};

/* REDIRECT LOGIN RESULT */

getRedirectResult(auth)

.then((result)=>{

if(result?.user){

console.log("Login Success");

}

})

.catch((error)=>{

console.log(error);

});

/* LOGOUT */

window.logout = function(){

signOut(auth)

.then(()=>{

alert("Logged out");

window.location.reload();

})

.catch((error)=>{

alert(error.message);

});

};

/* USER STATE */

onAuthStateChanged(auth,(user)=>{

if(user){

document.getElementById("loginBtn").style.display =
"none";

document.getElementById("profileBox").style.display =
"block";

document.getElementById("userPic").src =
user.photoURL;

document.getElementById("userName").innerText =
user.displayName;

}else{

document.getElementById("loginBtn").style.display =
"block";

document.getElementById("profileBox").style.display =
"none";

}

});

/* SIDEBAR */

window.openSidebar = function(){

const sidebar =
document.getElementById("sidebar");

if(sidebar.style.left === "0px"){

sidebar.style.left = "-270px";

}else{

sidebar.style.left = "0px";

}

};

/* NEW CHAT */

window.newChat = function(){

document.getElementById("messages").innerHTML = "";

currentChat = [];

allChats.push(currentChat);

localStorage.setItem(
"zenkaiChats",
JSON.stringify(allChats)
);

};

/* CLEAR CHAT */

window.clearChat = function(){

document.getElementById("messages").innerHTML = "";

currentChat = [];

allChats = [[]];

localStorage.removeItem("zenkaiChats");

};

/* THEME */

window.toggleTheme = function(){

document.body.classList.toggle("light");

};
/* LOAD OLD CHATS */

window.onload = function(){

let messages =
document.getElementById("messages");

messages.innerHTML = "";

currentChat.forEach(chat=>{

let div =
document.createElement("div");

div.className =
chat.sender === "user"
? "message user"
: "message";

div.innerText = chat.text;

messages.appendChild(div);

});

};

/* SAVE CHAT */

function saveChat(){

allChats[allChats.length - 1] =
currentChat;

localStorage.setItem(
"zenkaiChats",
JSON.stringify(allChats)
);

}

/* SEND MESSAGE */

window.sendMessage = function(){

let input =
document.getElementById("input");

let text =
input.value.trim();

if(text === "") return;

let messages =
document.getElementById("messages");

/* USER MESSAGE */

let userMessage =
document.createElement("div");

userMessage.className =
"message user";

userMessage.innerText =
text;

messages.appendChild(userMessage);

currentChat.push({
sender:"user",
text:text
});

input.value = "";

messages.scrollTop =
messages.scrollHeight;

/* AI MESSAGE */

let aiMessage =
document.createElement("div");

aiMessage.className =
"message";

aiMessage.innerText =
"🤖 Thinking...";

messages.appendChild(aiMessage);

fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

contents:[{
parts:[{
text:text
}]
}]

})

}

)

.then(res=>res.json())

.then(data=>{

console.log(data);

let reply =
data?.candidates?.[0]?.content?.parts?.[0]?.text
|| "⚠️ No response received";

aiMessage.innerText =
reply;

currentChat.push({
sender:"ai",
text:reply
});

saveChat();

})

.catch(error=>{

console.log(error);

aiMessage.innerText =
