var findBtn = document.getElementById("findBtn");
var searchInput = document.getElementById("searchInput");

async function searchWeather (city) {

  try{

    var res = await fetch(`https://api.weatherapi.com/v1//forecast.json?key=dc0fd85b50f84e85be9143254240806&q=${city}&days=3`);
    var data = await res.json();
    displayWeather(data.location, data.current, data.forecast)

  } catch(err) {

    document.querySelector(".card-group").innerHTML = `<p class="alert alert-danger text-center fs-5 mx-auto">There is a problem fetching the data<p>`

  }
}

// Search when the user type in the search input
searchInput.addEventListener("input", function(e){

  // search the weather only when the user type 3 letters or more
  if (e.target.value.length >= 3) {
    searchWeather (e.target.value);
  }
});

// Search when the user type in the search input and click the find button
findBtn.addEventListener("click", function(e){
  e.preventDefault();

  // search the weather only when the user type 3 letters or more
  if (searchInput.value.length >= 3) {
    searchWeather (searchInput.value);
  }

});

// Display the weather data in the home page
function displayWeather(location, current, forecast) {
  var WeatherContent = "";

    // Display current day weather data
    WeatherContent += `<div class="today card">
    <div class="card-header d-flex justify-content-between">
      <div class="day">${getDayName(forecast.forecastday[0].date)}</div>
      <div class="date">${getSpecialDateFormat(forecast.forecastday[0].date)}</div>
    </div>
    <div class="card-body">
      <h5 class="location">${location.name}</h5>
      <div class="degree">
        <h2 class="deg-value text-white">${current.temp_c}°C</h2>
        <img class="deg-img" src="https:${current.condition.icon}" alt="">
      </div>
      <div class="deg-desc">${current.condition.text}</div>
    </div>
    <div class="card-footer d-flex justify-content-between border-0">
      <span><img src="images/icon-umberella.png" alt="umberella"> ${forecast.forecastday[0].day.daily_chance_of_rain}%</span>
      <span><img src="images/icon-wind.png" alt="wind"> ${current.wind_kph} km/h</span>
      <span><img src="images/icon-compass.png" alt="compass"> ${current.wind_dir}</span>
    </div>
  </div>`;

  // Display the next two days weather data
  for (var i = 1; i <forecast.forecastday.length; i++ ) {
    WeatherContent += `<div class="card text-center">
    <div class="card-header">
      <div class="day">${getDayName(forecast.forecastday[i].date)}</div>
    </div>
    <div class="card-body">
      <div class="degree">
        <img class="deg-img" src="https:${forecast.forecastday[i].day.condition.icon}" alt="">
        <h5 class="max-deg-value text-white">${forecast.forecastday[i].day.maxtemp_c}°C</h5>
        <h6 class="min-deg-value">${forecast.forecastday[i].day.mintemp_c}°C</h6>
        <div class="deg-desc">${forecast.forecastday[i].day.condition.text}</div>
      </div>
    </div>
  </div>`;

    document.querySelector(".card-group").innerHTML = WeatherContent;
  }
}

// Get day's name from the date
function getDayName(dateString) {
  var date = new Date(dateString);
  var dayIndex = date.getDay();
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

// Get date format (Day + Month: 9 June)
function getSpecialDateFormat(dateString) {
  var date = new Date(dateString);
  var monthIndex = date.getMonth();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var day = date.getDate()
  return `${day} ${months[monthIndex]}`;
}

// get the user's location from the localStorage
var cachedLocation = JSON.parse(localStorage.getItem("userLocation"));

// In case the user's location is retrieved from the local storage, Search the weather using this location
if (cachedLocation) {

  searchWeather (cachedLocation.latitude + "," + cachedLocation.longitude);

} else {

  // Check if geolocation is supported
  if (navigator.geolocation) {
    // Get the current position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      function(position) {
        // Extract the latitude and longitude
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        var location = {
          latitude: latitude,
          longitude: longitude,
        }

        // Save the user's location in the localStorage to stop asking for location on every page refresh
        localStorage.setItem("userLocation", JSON.stringify(location));

        // Call the searchWeather function with the current location
        searchWeather (latitude + "," + longitude);
      },
        // Error callback
        function(error) {
          console.log(error)
          // in case of error, set the current location to Cairo by default
          searchWeather("cairo")
        }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    searchWeather ("cairo");
  }

}