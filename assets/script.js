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
// for loop that is the searchedCitiesArray.length
// make a button for each city in the list and assign it a class (to use in event listener below )
// make the inner.html the name of the city
// append the button to the search-list div
// end the for loop

for (var i = 0; i < searchedCitiesArray.length; i++) {
  searchedCitiesArray[i];

  var li = document.createElement("li");
  li.classList.add(".list-item");
  var button = document.createElement("button");
  li.setAttribute("button", i);
  button.classList.add('btn');
    button.textContent = (searchedCitiesArray[i]);
    searchContainerEl.appendChild(button);
   
};

// need a function that will get the weather when you click the button
// use event lister tied to the class of the button to get the weather
// look to the button text 
// call the get city variable to get the function

// Listen for any clicks within the img-container div
/*searchContainerEl.addEventListener("click", function(event) {
  var element = event.target;*/


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
  var fiveDayURL = `http://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&exclude=minutely,hourly&outputDateTimeFormat=datetimeStr&appid=${APIKey}`;
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

  for (var i = 0; i < weather.daily.length; i++) {
    weather.daily[i];
    var iconCode = weather.daily[i].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
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
      $("#" + i + "dayForecast").text(date);
  };

  /* for (var d = 0; d < 6; d++){
      var tomorrow = date[d];
      $("#" + i + "dayForecast").text(tomorrow);
      };*/
};

searchFormEl.addEventListener("submit", formSubmitHandler);
//Use for historical city search
//submitBtn.addEventListener("click", getCity);
