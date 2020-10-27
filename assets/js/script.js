OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/";
API_KEY = "&units=metric&appid=7e6dc8803f9cdeac4c39d2ea0c3c4c03";
let cityName;
let recentSearchesArray = [];
const date = moment().format("Do MMM YYYY")

function displayDefaultWeatherForecast() {
    getFromLocalStorage();
    const mostRecentSearch = recentSearchesArray.slice(-1);
    getWeatherForecast(mostRecentSearch);
    displayRecentSearches();
}

function displayWeatherForecast(cityName) {
    cityName.preventDefault();
    const targetCityName = cityName.target[0].value;
    const lowerCaseCityName = targetCityName.toLowerCase();
    setToLocalStorage(lowerCaseCityName);
    getWeatherForecast(lowerCaseCityName);
    displayRecentSearches();
}

function showCurrentForecast(weatherData) {
    const uvIndex = calculateUvIndex(weatherData);
    $("#currentDayForecast").empty();
    const card = $("<div>").attr({
        class: "card",
        width: "100%",
    });
    const weatherIcon = weatherData.weather[0].icon
    const cardBody = $("<div>").addClass("card-body").attr("id", "cardBody");
    const weatherIconDiv = $("<img>").attr({
        src: "https://openweathermap.org/img/w/" + weatherIcon + ".png",
        alt: "Weather icon",
        height: "auto",
        width: "80px",
    });
    const cardTitle = $("<h6>").addClass("card-title").text(weatherData.name + " - " + date);
    const cardTemp = $("<p>").text("Temperature: " + Math.floor(weatherData.main.temp) + " °C");
    const cardHumidity = $("<p>").text("Humidity: " + weatherData.main.humidity + " %");
    const cardWindSpeed = $("<p>").text("Wind Speed: " + Math.floor((weatherData.wind.speed) * 2.237) + " MPH");
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIconDiv, cardTemp, cardHumidity, cardWindSpeed);
    $("#currentDayForecast").append(card);
}

function calculateUvIndex(weatherData) {
    const latitude = weatherData.coord.lat;
    const longitude = weatherData.coord.lon;
    const latAndLon = "lat=" + latitude + "&lon=" + longitude;
    getUvIndexForecast(latAndLon);
}

function uvIndexValue(data) {
    const uvIndexValue = data.value;
    const cardUvIndexP = $("<p>").text("UV Index: ");
    const cardUvIndexSpan = $("<span>").text(uvIndexValue);
    if (parseInt(uvIndexValue) <= 2) {
        cardUvIndexSpan.addClass("badge badge-pill badge-success");
    } else if (parseInt(uvIndexValue) > 2 && parseInt(uvIndexValue) < 5) {
        cardUvIndexSpan.addClass("badge badge-pill badge-warning");
    } else {
        cardUvIndexSpan.addClass("badge badge-pill badge-danger");
    }
    const cardUvIndex = cardUvIndexP.append(cardUvIndexSpan);
    $("#cardBody").append(cardUvIndex);
}

function showFiveDayWeatherForecast(weatherData) {
    $("#fiveDayForecast").empty();
    const currentDate = weatherData.list[0].dt_txt.slice(8, 10);
    for (i = 0; i < weatherData.list.length; i++) {
        const forecastDate = weatherData.list[i].dt_txt.slice(8, 10);
        const dateTimestamp = weatherData.list[i].dt_txt.slice(11, 19);
        if (forecastDate !== currentDate && dateTimestamp === "09:00:00") {
            const date = weatherData.list[i].dt_txt;
            const cardDate = date.slice(0, 10);
            //
            const temp = Math.floor(weatherData.list[i].main.temp);
            const iconName = weatherData.list[i].weather[0].icon;
            const humidity = weatherData.list[i].main.humidity + " %";
            const card = $("<div>").addClass("card bg-primary text-white");
            const cardBody = $("<div>").addClass("card-body");
            const cardWeatherDate = $("<h6>").addClass("card-title").text(cardDate);
            const weatherIconDiv = $("<img>").attr({
                src: "https://openweathermap.org/img/w/" + iconName + ".png",
                alt: "Weather icon",
                height: "auto",
                width: "60px",
            });
            const cardTemperature = $("<p>")
                .addClass("card-text")
                .text("Temp: " + temp + " °C");
            const cardHumidity = $("<p>")
                .addClass("card-text")
                .text("Humidity: " + humidity);
            const cardColumn = $("<div>").addClass("col-md-2");
            card.append(
                cardBody.append(
                    cardWeatherDate.append(weatherIconDiv, cardTemperature, cardHumidity)
                )
            );
            cardColumn.append(card);
            $("#fiveDayForecast").append(cardColumn);
        }
    }
}

function setToLocalStorage(citySearch) {
    const cityName = citySearch.replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    recentSearchesArray.push(cityName);
    localStorage.setItem(
        "recentSearchesArray",
        JSON.stringify(recentSearchesArray)
    );
}

function getFromLocalStorage() {
    let storedRecentSearchesArray = JSON.parse(
        localStorage.getItem("recentSearchesArray")
    );

    if (storedRecentSearchesArray) {
        recentSearchesArray = storedRecentSearchesArray;
    }
}

function displayRecentSearches() {
    $("#recentSearches").empty();
    $("#recentSearches").append("<h6>").text("Search History");
    const ulElement = $("<div>").addClass("list-group");
    recentSearchesArray.forEach((city, index) => {
        const searchItem = $("<a>")
            .attr({
                class: "list-group-item searchItems",
                id: "list" + index,
            })
            .text(city);
        ulElement.append(searchItem);
    });
    $("#recentSearches").append(ulElement);
    $(".searchItems").on("click", recentSearchSelection);
}

function recentSearchSelection(data) {
    getWeatherForecast(data.target.text);
}

function getWeatherData(forecastType, weatherType) {
    const weatherData = {
        url: OPEN_WEATHER_URL + forecastType + weatherType + API_KEY,
        method: "GET",
    };
    return weatherData;
}

function getWeatherForecast(lowerCaseCityName) {
    const currentDayWeatherType = "weather?q=";
    const fiveDayWeatherType = "forecast?q=";
    $.ajax(getWeatherData(currentDayWeatherType, lowerCaseCityName)).then(
        showCurrentForecast
    );
    $.ajax(getWeatherData(fiveDayWeatherType, lowerCaseCityName)).then(
        showFiveDayWeatherForecast
    );
}

function getUvIndexForecast(latAndLon) {
    const uvIndex = "uvi?";
    $.ajax(getWeatherData(uvIndex, latAndLon)).then(uvIndexValue);
}

$("#clearBtn").on("click", function() {
    window.localStorage.clear()
    window.location.reload();
});

displayDefaultWeatherForecast();
$("form").submit(displayWeatherForecast);