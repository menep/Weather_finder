/****************** DATA CONTROLLER ******************/
const dataController = (function() {
    // Use geolocation API to find the user's location
    const locateUser = function(xhrCallback, uiCallback) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            xhrCallback(pos.coords, uiCallback);
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            const noCoords = "";
            xhrCallback(noCoords, uiCallback);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    };

    // XHR call to retrieve weather data
    const xhrWeather = function(coords, uiCallback) {
        const apiKey = "2698d1aced37dab31689517465d0d42b";

        if (!coords) {
            console.log("no coords!");
            const xhr = new XMLHttpRequest();
            const url = `https://api.openweathermap.org/data/2.5/weather?q=Berlin&APIKEY=${apiKey}`;
            xhr.open("GET", url);

            xhr.onload = () => {
                uiCallback(JSON.parse(xhr.responseText));
            };

            xhr.send();
        } else {

            const latitude = coords.latitude.toFixed(2);
            const longitude = coords.longitude.toFixed(2);
            const xhr = new XMLHttpRequest();
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APIKEY=${apiKey}`;
            xhr.open("GET", url);

            xhr.onload = () => {
                uiCallback(JSON.parse(xhr.responseText));
            };

            xhr.send();
        }
    };

    return {
        getLocalWeather: function(uiCallback) {
            return locateUser(xhrWeather, uiCallback);
        }
    };
})();

/****************** DATA CONTROLLER ******************/

const uiController = (function() {
    const DOMElements = {
        btnCurrentLoc: "#btn-current-location",
        responseLoc: "#response-container"
    };

    const updateUi = function(response) {
        const html = `
            <h3 id="response-location">You are in (or close to): ${response.name}</h3>
            <ul id="response-list">
                <li id="response-description">The weather at the moment is: ${response.weather[0].description}</li>
                <li id="response-temperature">The temperature is: ${Math.round(((response.main.temp) -32) * (5/9))}°C</li>
                <li id="response-humidity">Humidity is at: ${response.main.humidity}%</li>
                <li id="response-wind">The wind blows at: ${Math.round((response.wind.speed) * 3.6)} km/h</li>
            </ul>
        `;

        document.querySelector(DOMElements.responseLoc).innerHTML = html;
    };

    return {
        DOMElements,
        updateUi
    };
})();

/****************** GENERAL CONTROLLER ******************/

const generalController = (function(dataCtrl, uiCtrl) {
    const uiElements = uiCtrl.DOMElements;

    function getResponse() {
        return dataCtrl.getLocalWeather(uiCtrl.updateUi);
    }

    const startEventListeners = () => {
        // Current location button activates geolocalizer and weather request based on local longitude and latitude
        document.querySelector(uiElements.btnCurrentLoc).addEventListener("click", getResponse);
    };

    return {
        init: function() {
            startEventListeners();
        }
    };
})(dataController, uiController);

generalController.init();
