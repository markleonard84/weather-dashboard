/* id list
locationSearch - on form
searchLocation - input name
searchBtn - Search Button
searchHistory
clearBtn
currentConditions
locationName
currentTemperature
feelsLike
currentDiscription
uvIndex
forcastImage
day1 through to 5
day1Temp through to 5
day1Conditions through to 5
day1Img through to 5
*/

const date = moment().format("Do MMM YYYY")
console.log('The date is:', date);
const apiKey = "7e6dc8803f9cdeac4c39d2ea0c3c4c03"
const locationSearch = $("#locationSearch input[name='searchLocation']");



$('#searchBtn').click(function getWeatherData(event) {
    event.preventDefault()
    const location = locationSearch.val();
    console.log('location is', location);
    const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=metric&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(weatherData) {
        console.log('weather data', weatherData);
        showWeatherData(weatherData);


    }).catch(function(error) {
        console.log('There is an error', error);
    });

    function showWeatherData(weatherData) {

        const currentTemp = Math.floor(weatherData.main.temp);
        const currentHumidity = (weatherData.main.humidity);
        const windSpeed = Math.floor((weatherData.wind.speed) * 2.237);

        $("#locationName").text("Location: " + location + " - (" + date + ")");
        $("#currentTemperature").text("Current Temperature: " + currentTemp + "°C");
        $("#humidity").text("Humidity: " + currentHumidity + " %");
        $("#windSpeed").text("Wind Speed: " + windSpeed + " MPH");
        //need to add the icon image in

        /*
        console.log('current temperature', currentTemp);
        console.log('Feels Like', tempFeelsLike);
        console.log('current conditions', currentConditions);
        */

        const uvApi = "http://api.openweathermap.org/data/2.5/uvi?lat=";
        const lat = weatherData.coord.lat;
        const lon = weatherData.coord.lon;
        const uvURL = uvApi + lat + "&lon=" + lon + "&appid=" + apiKey;

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(uvData) {
            console.log('UV Data', uvData);
            console.log('UV Index', uvData.value);
            $("#uvIndex").text("UV Index: " + uvData.value);
            if (uvData.value < 3) {
                $("#uvIndex").removeClass("badge badge-warning");
                $("#uvIndex").removeClass("badge badge-danger");
                $("#uvIndex").addClass("badge badge-pill badge-success");
            } else if (uvData.value < 6) {
                $("#uvIndex").removeClass("badge badge-pill badge-success");
                $("#uvIndex").removeClass("badge badge-pill badge-danger");
                $("#uvIndex").addClass("badge badge-pill badge-warning");
            } else if (uvData.value > 8) {
                $("#uvIndex").removeClass("badge badge-pill badge-success");
                $("#uvIndex").removeClass("badge badge-pill badge-warning");
                $("#uvIndex").addClass("badge badge-pill badge-danger");
            }
        });
    }

});

$("#searchBtn").click(function showFiveDayForcast(forcastData) {
    const location = locationSearch.val();
    console.log('location is', location);
    const forcastqueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=metric&appid=" + apiKey;
    $.ajax({
        url: forcastqueryURL,
        method: "GET"
    }).then(function(forcastData) {
        console.log('forcast data', forcastData);

        const days = forcastData.list


    }).catch(function(error) {
        console.log('There is an error', error);
    });

})