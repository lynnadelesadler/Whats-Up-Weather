// variables used in Query URL to Make the API Call
var APIKey = "d91f911bcf2c0f925fb6535547a5ddc9";
//create an array to store the city name
var city;
// HTML variables
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#city");
var searchContainerEl = document.querySelector("#search-history");
var cityTodayEL = document.querySelector("#city-today");
var dateTodayEl = document.querySelector("cardTodayDate");
var cardBodyToday = document.querySelector("cardBodyToday");
var forecastEL = document.querySelector("#five-day-container");

//Grabs the current time and date
var date = moment().format("MM-DD-YY");

// ******************************************* City Input and Search History ******************************************* //
/*    var searchedCitiesArray = [];

// The following function renders items in a citySearch list as <li> elements
function renderSearchHistory() {

  // Render a new li for each citySearch
  for (var i = 0; i < citySearch.length; i++) {
    var citySearch = citySearch[i];

    var li = document.createElement("li");
    li.textContent = citySearch;
    li.setAttribute("data-index", i);

    var button = document.createElement("button");
    button.textContent = "Complete ✔️";

    li.appendChild(button);
    $("#search-list").appendChild(li);
  }
}

// This function is being called below and will run when the page loads.
function init() {
  // Get stored citySearch from localStorage
  var storedcitySearch = JSON.parse(localStorage.getItem("citySearch"));

  // If citySearch were retrieved from localStorage, update the citySearch array to it
  if (storedcitySearch !== null) {
    citySearch = storedcitySearch;
  }

  // This is a helper function that will render citySearch to the DOM
  renderSearchHistory();
}

function storeSearchHistory() {
  // Stringify and set key in localStorage to citySearch array
  localStorage.setItem("citySearch", JSON.stringify(citySearch));
}

// Add submit event to form
searchFormEl.addEventListener("submit", function(event) {
  event.preventDefault();

  var citySearchText = searchInputEl.value.trim();

  // Return from function early if submitted citySearchText is blank
  if (citySearchText === "") {
    return;
  }

  // Add new citySearchText to citySearch array
  citySearch.push(citySearchText);


  // Store updated citySearch in localStorage, re-render the list
  storeSearchHistory();
  renderSearchHistory();
});

// Add click event to citySearchList element
searchFormEl.addEventListener("submit", formSubmitHandler);
citySearchList.addEventListener("click", function(event) {
var element = event.target;

  // Checks if element is a button
  if (element.matches("button") === true) {
    // Get its data-index value and remove the citySearch element from the list
    var index = element.parentElement.getAttribute("data-index");
    citySearch.splice(index, 1);

    // Store updated citySearch in localStorage, re-render the list
    storeSearchHistory();
    renderSearchHistory();
  };


// Calls init to retrieve data and render it to the page on load
init();

  */

// ******************************************* GET WEATHER API CALL ******************************************* //

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = searchInputEl.value.trim();

  if (city) {
    getCity(city);

    cityTodayEL.textContent = "";
    searchInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var getCity = function (city) {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  fetch(queryURL).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);
        fiveDayWeather(city, data.coord.lat, data.coord.lon);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};
var fiveDayWeather = function (city, lat, lon) {
  var fiveDayURL = `http://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}`;
  fetch(fiveDayURL).then(function (response) {
    if (response.ok) {
      //  console.log(response);
      response.json().then(function (data) {
        //  console.log(data);
        displayWeather(city, data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

var displayWeather = function (city, weather) {
  console.log(city, weather);
  if (city.length === 0) {
    cityTodayEL.textContent = "No city found.";
    return;
  }

  


  //Update Title Weather Today in "City"
  cityTodayEL.textContent = " in " + city;
  // Transfer Current Weather content to HTML and retrieve and display icon from weather API
  $(".cardTodayDate").html("<h3>" + date + "</h3>");
  var iconCode = weather.current.weather[0].icon;
  console.log(iconCode)
  var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
  var icon = $("<img>").attr("src", iconURL);
  $("#weatherIcon").html(icon);
  $(".temperature").text("Temp: " + weather.current.temp + " %");
  $(".humidity").text("Humidity: " + weather.current.humidity + " %");
  $(".windSpeed").text("Wind Speed: " + weather.current.wind_speed + " mph");

  // weather
  // weather.current <== object, weather.current.temp, weather.current.uvi
  // weather.daily <= array, weather.daily[0].temp

  // Retrieves and displays 5 Day Weather Forecast and associated icon

  for (var i = 0; i < weather.daily.length; i++){
    weather.daily[i];
    var iconCode = weather.daily[i].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    var icon = $("<img>").attr("src", iconURL);
    $("#" + i + "dayIcon").html(icon);
    $("#" + i + "dayTemperature").append("Temp: " + weather.daily[i].temp.day + " %");
    $("#" + i + "dayHumidity").append("Humidity: " + weather.daily[i].humidity + " %");
    $("#" + i + "dayWindSpeed").append("Wind Speed: " + weather.daily[i].wind_speed + " mph" );
  }

  /*for (var i=0; i < 6; i++){
  var tomorrow = date[i];
  $("#" + i + "dayForecast").text(tomorrow);
  }*/

};

searchFormEl.addEventListener("submit", formSubmitHandler);
//Use for historical city search
//submitBtn.addEventListener("click", getCity);
