const UNIDENTIFIED_SECRET = "4xFNHYPWm2wSBqxGM4ApNbSfHkiPUDq96aebVdyXBNgnvfAhm0JkLSPyT0keuiR5PX6QTX"
const UNIDENTIFIED_SECRET2 =  "U2FsdGVkX19xM+KoCmPp06wylmtnwMsAu/rePCsL/CiV4/7JkXXo/OPLZ7Nv1ldAnvddlleXJvnDiljBUOEBYg=="
const dcr = CryptoJS.AES.decrypt(UNIDENTIFIED_SECRET2, UNIDENTIFIED_SECRET).toString(CryptoJS.enc.Utf8);


const UNSPLASH_API_KEY =
  dcr
const UNSPLASH_URL = `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_API_KEY}&query=landscape&orientation=landscape`;

const body = document.querySelector("body")

function loadBackground() {
  const savedImage = localStorage.getItem("YmFja2dyb3VuZAo=");
  if (savedImage === null) {
    getBackground();
  } else {
    const parsedImage = JSON.parse(savedImage);
    const UNIX = Date.now(); //UNIX TIME
    if (UNIX > parsedImage.expiresOn) {
      getBackground();
    } else {
      body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)), url(${
        parsedImage.url
      })`;
    }
  }
  return;
}

function saveBackground(imageUrl, city, country, name) {
  const savedImage = localStorage.getItem("YmFja2dyb3VuZAo=");
  if (savedImage !== null) {
    localStorage.removeItem("YmFja2dyb3VuZAo=");
  }
  const expirationDate = Date.now() //UNIX TIME
  const imageObject = {
    url: imageUrl,
    expiresOn: expirationDate + 86400,
    city,
    country,
    name
  };
  localStorage.setItem("YmFja2dyb3VuZAo=", JSON.stringify(imageObject));
  loadBackground();
  return;
}

function getBackground() {
  fetch(UNSPLASH_URL)
    .then(response => response.json())
    .then(json => {
      const image = json;
      if (image.urls && image.urls.full && image.location) {
        const fullUrl = image.urls.full;
        const location = image.location;
        const city = location.city;
        const country = location.country;
        const name = location.name;
        saveBackground(fullUrl, city, country, name);
      } else {
        getBackground();
      }
    });
  return;
}

function initApp() {
  loadBackground();
  return;
}

initApp();

