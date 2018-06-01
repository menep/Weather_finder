/****************** DATA CONTROLLER ******************/
const dataController = (function() {
    const apiKey = "2698d1aced37dab31689517465d0d42b";

    const getWeatherData = function () {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `http://api.openweathermap.org/data/2.5/weather?q=London&APPID=${apiKey}`);
        xhr.onload = function() {
            if (this.status === 200) {
                return xhr.response;
            }
        }

        xhr.send();
    }

    return {
        responseData: function() {
            const response = getWeatherData();  // ERROR: response is undefined
            if (response) {
                console.log(response)
            }
        }
    }

})();


/****************** DATA CONTROLLER ******************/

const uiController = (function() {
    const DOMElements = {
        btnCurrentLoc: document.getElementById("current-location"),
        locationHeader: document.getElementById("response-location") 
    }

    return {
        DOMElements
    }
})();


/****************** GENERAL CONTROLLER ******************/

const generalController = (function(dataCtrl, uiCtrl) {
    const uiElements = uiCtrl.DOMElements;

    return {
        init: function() {
            uiElements.btnCurrentLoc.addEventListener("click", dataCtrl.responseData);
        }
    }

})(dataController, uiController);

generalController.init();