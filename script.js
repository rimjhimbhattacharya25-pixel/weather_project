const API_KEY = "aec62d9d629a34641aa481b22428eb96";

const cityInput = document.getElementById("cityInput");

const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");

const temp = document.getElementById("temp");

const humidity = document.getElementById("humidity");

const condition = document.getElementById("condition");

const icon = document.getElementById("icon");

const message = document.getElementById("message");

const CACHE_TIME = 10 * 60 * 1000;



async function getWeather(city){

message.textContent="";

const cacheKey="weather_"+city.toLowerCase();

const cached=localStorage.getItem(cacheKey);

if(cached){

const data=JSON.parse(cached);

if(Date.now()-data.timestamp<CACHE_TIME){

displayWeather(data.weather);

return;

}

}

try{

const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

const response=await fetch(url);

if(!response.ok){

throw new Error("City not found");

}

const weather=await response.json();

localStorage.setItem(

cacheKey,

JSON.stringify({

weather,

timestamp:Date.now()

})

);

displayWeather(weather);

}

catch(error){

message.textContent="City not found. Please try again.";

cityName.textContent="";

temp.textContent="";

humidity.textContent="";

condition.textContent="";

icon.src="";

}

}



function displayWeather(weather){

cityName.textContent=weather.name;

temp.textContent=`${weather.main.temp} °C`;

humidity.textContent=`Humidity : ${weather.main.humidity}%`;

condition.textContent=weather.weather[0].main;

icon.src=`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

changeBackground(weather.weather[0].main);

}



function changeBackground(weather){

document.body.className="";

switch(weather.toLowerCase()){

case "clear":

document.body.classList.add("clear");

break;

case "rain":

document.body.classList.add("rain");

break;

case "clouds":

document.body.classList.add("clouds");

break;

case "snow":

document.body.classList.add("snow");

break;

default:

document.body.classList.add("default");

}

}



searchBtn.addEventListener("click",()=>{

const city=cityInput.value.trim();

if(city){

getWeather(city);

}

});



cityInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

searchBtn.click();

}

});



function getLocation(){

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(

async(position)=>{

const lat=position.coords.latitude;

const lon=position.coords.longitude;

try{

const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

const response=await fetch(url);

const weather=await response.json();

displayWeather(weather);

}

catch(error){

getWeather("London");

}

},

()=>{

getWeather("London");

}

);

}

else{

getWeather("London");

}

}



getLocation();
