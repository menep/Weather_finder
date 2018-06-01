/****************** DATA CONTROLLER ******************/
const dataController = (function() {
    const apiKey = "2698d1aced37dab31689517465d0d42b";

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
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    };

    // XHR call to retrieve weather data
    const xhrWeather = function(coords, uiCallback) {
        const latitude = coords.latitude.toFixed(2);
        const longitude = coords.longitude.toFixed(2);
        const xhr = new XMLHttpRequest();
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APIKEY=${apiKey}`;
        xhr.open("GET", url);

        xhr.onload = () => {
            uiCallback(xhr.responseText);
        };

        xhr.send();
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
        btnCurrentLoc: document.getElementById("current-location"),
        locationHeader: document.getElementById("response-location")
    };

    const updateUi = function(response) {
        console.log(response);
    };

    return {
        DOMElements,
        updateUi
    };
})();

/****************** GENERAL CONTROLLER ******************/

const generalController = (function(dataCtrl, uiCtrl) {
    const uiElements = uiCtrl.DOMElements;

    const startEventListeners = () => {
        // Current location button activates geolocalizer and weather request based on local longitude and latitude
        uiElements.btnCurrentLoc.addEventListener("click", dataCtrl.getLocalWeather(uiCtrl.updateUi));
    };

    return {
        init: function() {
            startEventListeners();
        }
    };
})(dataController, uiController);

generalController.init();
