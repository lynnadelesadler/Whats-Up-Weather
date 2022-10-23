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


