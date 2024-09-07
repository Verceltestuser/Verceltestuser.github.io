const loginForm = document.querySelector(".login-form");
const loginInput = loginForm.querySelector("input");
const greeting = document.querySelector(".greeting");
const google = document.querySelector("#search")
const USERNAME_KEY = "VVNFUk5BTUU=";
const savedUserName = localStorage.getItem(USERNAME_KEY)
loginForm.hidden = true;
greeting.hidden = true;
google.hidden = true;

function paintGreeting(user) {
    greeting.innerText = `Hello ${user}`;
    greeting.hidden = false;
    google.hidden = false
}


if (savedUserName === null) {
    loginForm.hidden = false;
    loginForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        if(loginInput.value !==""){
            const username = loginInput.value;
            localStorage.setItem(USERNAME_KEY, username)
            loginForm.hidden = true
            paintGreeting(username)
        }
    })
}else{
    paintGreeting(savedUserName)
}