const recentSearchList = $("#recentHistory");
const currentConditions = $("#currentConditions");
const fiveDayForcast = $("#fiveDayForcast");
const locationData = $("#searchLocation input[name='locationInput']")
const locationSearchForm = $("#searchLocation");

locationSearchForm.submit(function(event) {
    event.preventDefault();
    const requestedLocation = locationData.val();
    const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + requestedLocation + "&units=metric&appid=7e6dc8803f9cdeac4c39d2ea0c3c4c03";

    $.ajax({
        url: queryURL
    }).then(function(weatherData) {
        console.log('weatherData', weatherData);

        createDailyForcast(weatherData);

    }).catch(function(err) {

    });
});


function createDailyForcast(weatherData) {
    let forcastAtLocation = $("<div>").attr('class= "card"');
    let locationName = $("<h6>").addClass("card-title").text(weatherData.name);
    let currentTemperature = $("<p>").text("Current Temperature: " + weatherData.main.temp);
    let tempFeelsLike = $("<p>").text("Feels like: " + weatherData.main.feels_like)
    let currentDiscription = $("<p>").text("Current Conditions: " + weatherData.weather[0].description);
    let forcastImage = $("<img>").attr({
        src: "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png",
        height: "auto",
        width: "100px"
    });
    currentConditions.append(forcastAtLocation, locationName, currentTemperature, tempFeelsLike, currentDiscription, forcastImage);

    console.log('image', weatherData.weather[0].icon);
};