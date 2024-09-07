const API_KEY = "46a6f1cf84c2d71098592941484b6da9" //(이거 쓰면 고소 각)

navigator.geolocation.getCurrentPosition((CurrentPosition)=>{
    //On Sucess
    const lat = CurrentPosition.coords.latitude
    const lng = CurrentPosition.coords.longitude
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    fetch(URL).then(res => res.json()).then((data) => {
        const weather = document.querySelector('#weather span')
        weather.innerText = `${data.weather[0].main}, ${Math.floor(data.main.temp - 273.15)}°C, ${data.name}`
    })
},()=>{
    //On Fail
        const weather = document.querySelector('#weather span')
        weather.innerText = `Cannot get weather`
})