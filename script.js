
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
getAuth,
GoogleAuthProvider,
signInWithRedirect,
signInWithPopup,
signOut,
onAuthStateChanged,
getRedirectResult
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "YOUR_FIREBASE_API_KEY",
authDomain: "zenkaiai.firebaseapp.com",
projectId: "zenkaiai",
storageBucket: "zenkaiai.firebasestorage.app",
messagingSenderId: "298539306658",
appId: "1:298539306658:web:c594741c7da5ff620b51fb"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

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

/* MOBILE REDIRECT RESULT */

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

document.getElementById("loginBtn").style.display="none";

document.getElementById("profileBox").style.display="block";

document.getElementById("userPic").src =
user.photoURL;

document.getElementById("userName").innerText =
user.displayName;

}else{

document.getElementById("loginBtn").style.display="block";

document.getElementById("profileBox").style.display="none";

}

});
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

let reply =
data?.candidates?.[0]?.content?.parts?.[0]?.text
|| "⚠️ No response received";

aiMessage.innerText = reply;

currentChat.push({
sender:"ai",
text:reply
});

saveChat();

})

.catch(error=>{

aiMessage.innerText =
"⚠️ AI Error: " + error.message;

console.log(error);

});
