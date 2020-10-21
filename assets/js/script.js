$(document).ready(function() {


    const submitBtn = $("#locationSubmitBtn");
    const recentSearchList = $("#recentViewList");
    const currentConditions = $("#currentConditions");
    const fiveDayForcast = $("#fiveDayForcast");


    // Gets the location user has submitted and the calls weather data.
    $(submitBtn).click(function(event) {
        event.preventDefault();
        const locationData = $("#userLocationInput").val();
        console.log('location Data is', locationData);

        const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + locationData + "&appid=7e6dc8803f9cdeac4c39d2ea0c3c4c03";
        console.log('queryURL is', queryURL);

        $.ajax({
            url: queryURL
        }).then(function(weatherData) {
            console.log('weatherData is',
                weatherData);
        })

    });













});