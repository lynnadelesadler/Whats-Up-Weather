// variables used in Query URL to Make the API Call
var APIKey = "d91f911bcf2c0f925fb6535547a5ddc9";
//create an array to store the city name
var city;
// HTML variables
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#city");
var searchContainerEl = document.querySelector("#search-list");
var cityTodayEL = document.querySelector("#city-today");
var dateTodayEl = document.querySelector("cardTodayDate");
var cardBodyToday = document.querySelector("cardBodyToday");
var forecastEL = document.querySelector("#five-day-container");

//Grabs the current time and date
var date = moment().format("MM-DD-YY");

// ******************************************* City Input and Search History ******************************************* //
var searchedCitiesArray =
  JSON.parse(localStorage.getItem("searchHistory")) || [];
console.log(searchedCitiesArray);

var renderCityList = function () {
  searchContainerEl.innerHTML = "";
  for (var i = 0; i < searchedCitiesArray.length; i++) {
    console.log(searchedCitiesArray[i]);
    var li = document.createElement("li");
    li.classList.add(".list-item");
    var button = document.createElement("button");
    li.setAttribute("button", i);
    button.classList.add("btn");
    button.setAttribute("data-search", searchedCitiesArray[i]);
    button.textContent = searchedCitiesArray[i];
    searchContainerEl.appendChild(button);
  }
};

var searchContainerClickHandler = function (event) {
  var search = event.target.getAttribute("data-search");
  getCity(search);
};

// ******************************************* GET WEATHER API CALL ******************************************* //

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = searchInputEl.value.trim();
  console.log(city);
  searchedCitiesArray.push(city);
  // in local storage "searchHistory" is the key and then it's setting citySearch as the value
  console.log("test");
  console.log(searchedCitiesArray);
  localStorage.setItem("searchHistory", JSON.stringify(searchedCitiesArray));
  console.log(JSON.stringify(searchedCitiesArray));
  if (city) {
    getCity(city);
    renderCityList();
    cityTodayEL.textContent = "";
    searchInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
};

var getCity = function (city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
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
  var fiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}`;
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
  console.log(iconCode);
  var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
  var icon = $("<img>").attr("src", iconURL);
  $("#weatherIcon").html(icon);
  $(".temperature").text("Temp: " + weather.current.temp + " %");
  $(".humidity").text("Humidity: " + weather.current.humidity + " %");
  $(".windSpeed").text("Wind Speed: " + weather.current.wind_speed + " mph");

  // Retrieves and displays 5 Day Weather Forecast and weather icon
  for (var i = 0; i < weather.daily.length; i++) {
    weather.daily[i];
    var iconCode = weather.daily[i].weather[0].icon;
    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
    var icon = $("<img>").attr("src", iconURL);
    $("#" + i + "dayIcon").html(icon);
    $("#" + i + "dayTemperature").text(
      "Temp: " + weather.daily[i].temp.day + " %"
    );
    $("#" + i + "dayHumidity").text(
      "Humidity: " + weather.daily[i].humidity + " %"
    );
    $("#" + i + "dayWindSpeed").text(
      "Wind Speed: " + weather.daily[i].wind_speed + " mph"
    );
    //to input date
    $("#" + i + "dayForecast").text(moment().add(i, "days").format("MM-DD-YY"));
  }
};

searchFormEl.addEventListener("submit", formSubmitHandler);
searchContainerEl.addEventListener("click", searchContainerClickHandler);
