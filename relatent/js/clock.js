const clock = document.getElementById("clock")
const dateElement  = document.getElementById("date")


//This is kind of STOOBID!!!!!!!!
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "August",
    "September",
    "October",
    "December"
]


setInterval(()=>{
    const date = new Date();
    const hr = String(date.getHours()).padStart(2,"0")
    const min = String(date.getMinutes()).padStart(2,"0")
     clock.innerText = `${hr}:${min}`
},250)

setInterval(()=>{
    const data = new Date;
    const month = months[data.getMonth() - 1]
    const day = data.getDate()
    const year = data.getFullYear()
    dateElement.innerText = `${month} ${day}, ${year}`
},1000)