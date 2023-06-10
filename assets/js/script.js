
var currentCityCondition = document.querySelector("#current");
var futureCityCondition = document.querySelector("#future");

const historyContainer = document.querySelector("#history");

let data;
var cityHistory = [];
var cityHistoryLocal;

const getWeather = async () => {
    let city = document.querySelector(".city-input").value;
    cityHistory.push(city);
    saveArrayToLocal(cityHistory);
    
    getWeatherApi(city);

    generateHistory();
};

const getWeatherApi = async (city) => {
    // API calls for current and future weather conditions
    var url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    var url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    // Current Weather
    let currentData = await (await fetch(url1)).json();
    console.log(currentData)

    let { dt, main:{temp}, weather:[{icon}], wind:{speed}, main:{humidity}} = currentData;

    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
    
    currentCityCondition.innerHTML = `
        <div class="card">
            <h4>${new Date(dt * 1000).toLocaleDateString()}</h4>
            <h4>temp: ${temp}*F</h4>
            <img src="${iconurl}" />
            <h4>wind speed: ${speed} mph</h4>
            <h4>humidity: ${humidity}%</h4>
        </div>
    `;

    // Forecast Weather
    let {list} = await (await fetch(url2)).json();
    console.log({list})

    futureCityCondition.innerHTML = "";

    for(let i = 0; i < list.length; i = i + 8) {
        let { dt, main:{temp}, weather:[{icon}], wind:{speed}, main:{humidity}} = list[i];

        var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";

        futureCityCondition.innerHTML += `
            <div class="card">
                <h4>${new Date(dt * 1000).toLocaleDateString()}</h4>
                <h4>temp: ${temp}*F</h4>
                <img src="${iconurl}" />
                <h4>wind speed: ${speed} mph</h4>
                <h4>humidity: ${humidity}%</h4>
            </div>
        `;
    }
}

// Appends a button in the search section for each city in history
const generateHistory = () => {
    
    extractArrayFromLocal();

    if(extractArrayFromLocal() === null) {
        return;
    }
    else {
        historyContainer.innerHTML = "";
    }

    for(let x = 0; x < cityHistoryLocal.length; x++) {
        var historyButton = document.createElement("button");
        // historyButton.setAttribute("onclick", "getWeather()");
        historyButton.addEventListener("click", function(event){
            getWeatherApi(event.target.textContent)
        })
        historyButton.textContent = cityHistoryLocal[x];
        historyContainer.appendChild(historyButton);
    }
}

function saveArrayToLocal(array) {
    localStorage.setItem('city-history', JSON.stringify(array))
}

function extractArrayFromLocal() {
    cityHistoryLocal = JSON.parse(localStorage.getItem("city-history"));
    return cityHistoryLocal
}