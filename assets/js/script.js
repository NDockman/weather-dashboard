
//my api key is e8b77a8a98c2ea61a93fac56cb1e968d
// var requestURLy = "api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={e8b77a8a98c2ea61a93fac56cb1e968d}"

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
    
    // API calls for current and future weather conditions
    var url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    var url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    // Current Weather
    let currentData = await (await fetch(url1)).json();

    console.log(currentData)
    currentCityCondition.innerHTML = `
        <div class="card">
            <h4>${currentData.dt}</h4>
            <h4>${currentData.main.temp}</h4>
        </div>
    `;

    // Forecast Weather
    let {list} = await (await fetch(url2)).json();
    console.log({list})

    for(let i = 0; i < list.length; i = i + 8) {
        let { dt,  main:{temp}} = list[i];

        futureCityCondition.innerHTML += `
            <div class="card">
                <h4>${dt}</h4>
                <h4>${temp}</h4>
            </div>
        `;
    }

    //console.log(currentData, forecastData);

    generateHistory();

};

const generateHistory = () => {
    
    extractArrayFromLocal();

    if(extractArrayFromLocal() === null) {
        return;
    }
    else {
        historyContainer.innerHTML = "";
    }

    console.log(cityHistoryLocal)

    for(let x = 0; x < cityHistoryLocal.length; x++) {
        var historyButton = document.createElement("button");
        historyButton.setAttribute("onclick", "getWeather()");
        historyButton.textContent = cityHistoryLocal[x];

        //historyContainer.innerHTML = historyButton;
    }
}

function saveArrayToLocal(array) {
    localStorage.setItem('city-history', JSON.stringify(array))
}

function extractArrayFromLocal() {
    cityHistoryLocal = JSON.parse(localStorage.getItem("city-history"));
    console.log(cityHistoryLocal);
    return cityHistoryLocal
}