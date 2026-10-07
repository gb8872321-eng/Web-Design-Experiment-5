// Getting the elements from the HTML page
var cityInput = document.getElementById("cityInput");
var searchBtn = document.getElementById("searchBtn");
var result = document.getElementById("result");

// This function converts the weather code into simple text
function getWeatherText(code) {
  if (code === 0) {
    return "Clear sky";
  } else if (code >= 1 && code <= 3) {
    return "Partly cloudy";
  } else if (code === 45 || code === 48) {
    return "Fog";
  } else if (code >= 51 && code <= 57) {
    return "Drizzle";
  } else if (code >= 61 && code <= 67) {
    return "Rain";
  } else if (code >= 71 && code <= 77) {
    return "Snow";
  } else if (code >= 80 && code <= 82) {
    return "Rain showers";
  } else if (code >= 95) {
    return "Thunderstorm";
  } else {
    return "Unknown";
  }
}

// Main function to get the weather using Fetch API
async function getWeather() {
  var city = cityInput.value.trim();

  // Check if the user has not entered anything
  if (city === "") {
    result.innerHTML = "<p class='error'>Please enter a city name.</p>";
    return;
  }

  result.innerHTML = "<p>Loading...</p>";

  try {
    // Step 1: Find the latitude and longitude of the city
    var geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1";
    var geoResponse = await fetch(geoUrl);
    var geoData = await geoResponse.json();

    // If the city is not found
    if (!geoData.results) {
      result.innerHTML = "<p class='error'>City not found. Try again.</p>";
      return;
    }

    var place = geoData.results[0];

    // Step 2: Get the current weather of that place
    var weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + place.latitude +
                     "&longitude=" + place.longitude +
                     "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";
    var weatherResponse = await fetch(weatherUrl);
    var weatherData = await weatherResponse.json();

    var current = weatherData.current;

    // Step 3: Show the data on the page
    result.innerHTML =
      "<h2>" + place.name + ", " + place.country + "</h2>" +
      "<p class='temp'>" + current.temperature_2m + " &deg;C</p>" +
      "<p>" + getWeatherText(current.weather_code) + "</p>" +
      "<p>Humidity: " + current.relative_humidity_2m + " %</p>" +
      "<p>Wind Speed: " + current.wind_speed_10m + " km/h</p>";

  } catch (error) {
    // If there is any problem like no internet
    result.innerHTML = "<p class='error'>Something went wrong. Check your internet.</p>";
    console.log(error);
  }
}

// Run the function when the button is clicked
searchBtn.addEventListener("click", getWeather);

// Also run when Enter key is pressed
cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
