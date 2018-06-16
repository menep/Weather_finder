/****************** DATA CONTROLLER ******************/
const dataController = (function() {
    // Use geolocation API to find the user's location
    const locateUser = function(xhrWeather, uiCallback) {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported by your browser");
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            const crd = pos.coords;
            xhrWeather(crd, uiCallback);
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    };

    // XHR call to retrieve weather data
    const xhrWeather = function(input, uiCallback) {
        const apiKey = "2698d1aced37dab31689517465d0d42b";
        let query;

        if (typeof input === "object") {
            const lat = input.latitude.toFixed(2);
            const long = input.longitude.toFixed(2);
            query = `lat=${lat}&lon=${long}`;
        } else if (typeof input === "string") {
            query = `q=${input}`;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?${query}&APPID=${apiKey}`;
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url);

        xhr.onload = () => {
            uiCallback(JSON.parse(xhr.responseText));
        };

        xhr.send();
    };

    const parseResponse = function(response, input) {
        console.log(input);
        const filtered = response
            .filter(el => {
                return el.name.toLowerCase().includes(input);
            })
            .slice(0, 10);
        return filtered.map(el => el.name);
    };

    const validateWeatherInput = function(input, uiCallback) {
        if (input === "my location") {
            return locateUser(xhrWeather, uiCallback);
        } else {
            xhrWeather(input, uiCallback);
        }
    };

    return {
        getWeatherResponse: function(input, uiCallback) {
            validateWeatherInput(input, uiCallback);
        }
    };
})();

/****************** DATA CONTROLLER ******************/

const uiController = (function() {
    const DOMElements = {
        responseContainer: "#response-container",
        inputLocation: "#input-location",
        titleArea: "#title-area"
    };

    const getInputValue = function(e) {
        const inputValue = document
            .querySelector(DOMElements.inputLocation)
            .value.toLowerCase();

        return inputValue;
    };

    const updateWeatherUi = function(response) {
        const html = `
            <ul id="response-list" class="response-centered">
                <li id="response-description">${
                    response.weather[0].description
                }</li>
                <li id="response-temperature">${Math.round(
                    response.main.temp - 273.15
                )}°C</li>
                <li id="response-humidity">humidity at ${
                    response.main.humidity
                }%</li>
                <li id="response-wind">wind at ${Math.round(
                    response.wind.speed * 3.6
                )} km/h</li>
            </ul>
        `;
        document.querySelector(DOMElements.responseContainer).innerHTML = html;
    };

    return {
        DOMElements,
        getInputValue,
        updateWeatherUi
    };
})();

/****************** GENERAL CONTROLLER ******************/

const generalController = (function(dataCtrl, uiCtrl) {
    const uiElements = uiCtrl.DOMElements;

    const setupEventListeners = () => {
        // When "enter" is pressed, the value of the input field is passed on to the search function
        document
            .querySelector(uiElements.inputLocation)
            .addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    const input = uiCtrl.getInputValue();
                    dataCtrl.getWeatherResponse(input, uiCtrl.updateWeatherUi);
                }
            });
    };

    return {
        init: function() {
            setupEventListeners();
        }
    };
})(dataController, uiController);

generalController.init();
