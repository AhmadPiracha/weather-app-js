const API_KEY = "045ac6e30c6e4b83bba92117240602";
let currentCity = "";

async function apiCall(cityName, method, days, airQuality, alerts) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.onload = function () {
      if (request.status === 200) {
        const response = JSON.parse(this.responseText);
        resolve(response);
      } else {
        reject(`Error: ${request.statusText} or City NOT FOUND!!!!`);
      }
    };

    request.onerror = function () {
      reject("Network error occurred. Please try again.");
    };

    request.open(
      "GET",
      //   `https://api.weatherapi.com/v1/${method}.json?key=${API_KEY}&q=${cityName}&aqi=no`

      `http://api.weatherapi.com/v1/${method}.json?key=${API_KEY}&q=${cityName}&days=${days}&aqi=${airQuality}&alerts=${alerts}`
    );

    request.send();
  });
}

$("#cityName").on("keypress", function () {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    searchWeather();
  }
});

$("#cityName").on("input", async function () {
  const city = $(this).val();

  if (city.trim() === "") {
    clearData();
    return;
  }

  try {
    const response = await apiCall(city, "search");
    displaySuggestions(response);
  } catch (error) {
    alert("ERROR", error);
  }
});

async function searchWeather() {
  currentCity = $("#cityName").val();

  if (currentCity.trim() === "") {
    alert("City Name cannot be empty");
    return;
  } else if (!currentCity.trim().match(/^[A-Za-z]+$/)) {
    alert("Enter a valid name with only letters");
    return;
  }

  try {
    const response = await apiCall(currentCity, "current", "", "", "");
    displayWeatherData(response);
  } catch (error) {
    alert("ERROR", error);
  }
  clearData();
  $("#cityName").val("");
}

async function weatherForecast() {
  if (currentCity.trim() === "") {
    alert("Please search for a city first");
    return;
  }

  try {
    const response = await apiCall(currentCity, "forecast", 3, "yes", "yes");
    //   console.log(response);
    displayForecastData(response);
  } catch (error) {
    alert(error);
  }
  clearData();
  $("#cityName").val("");
}

function displayForecastData(data) {
  const { forecast } = data;
  const forecastOutput = $("#forecastData");
  forecastOutput.empty();

  forecast.forecastday.forEach((day) => {

    console.log(day.date)
    console.log(day.day.condition.text)


    forecastOutput.append(`

    <div class="col-md-8 col-lg-6 col-xl-4 ">

    <div class="card" 
    style="border-radius: 35px;">
    <div class="card-body p-4">

        <div class="d-flex">
        <h6>${day.date}</h6>
        </div>

        <div class="d-flex flex-column text-center mb-4">
            <div><img src=${day.day.condition.icon}></div>
        <h6 class="display-4 mb-0 font-weight-bold 
       
        "> ${day.day.maxtemp_c}°C </h6>
        <span class="small">${
        day.day.condition.text
        }</span>
        </div>
    </div>
    </div>
    </div>  
`);
  });
}

function displayWeatherData(data) {
  const { location, current, condition } = data;
  const time = location.localtime.split(" ")[1];

  const output = $("#data");
  output.html(`

<div class="col-md-8 col-lg-6 col-xl-4 ">

<div class="card 
${current.is_day == 1 ? "bg-light" : "bg-dark"}
${current.is_day == 1 ? "text-dark" : "text-white"}
" 
style="border-radius: 35px;">
  <div class="card-body p-4">

    <div class="d-flex">
        
      <h6 class="flex-grow-1">${location.name}, ${location.country}</h6>
      <h6>${time}</h6>
    </div>

    <div class="d-flex flex-column text-center mt-5 mb-4">
        <div><img src=${current.condition.icon}></div>
      <h6 class="display-4 mb-0 font-weight-bold 
      ${current.is_day == 1 ? "text-dark" : "text-white"}
      "> ${current.temp_c}°C </h6>
      <span class="small ${current.is_day == 1 ? "text-dark" : "text-white"}">${
    current.condition.text
  }</span>
    </div>

    <div class="d-flex align-items-center">
      <div class="flex-grow-1" style="font-size: 1rem;">
        <div><i class="fas fa-wind fa-fw ${
          current.is_day == 1 ? "text-dark" : "text-white"
        }"></i> <span class="ms-1"> ${current.wind_kph} kp/h
          </span></div>
      </div>
      <div><i class="fas fa-tint fa-fw ${
        current.is_day == 1 ? "text-dark" : "text-white"
      }"></i> <span class="ms-1"> ${current.humidity}% </span>
        </div>
    </div>
  </div>
</div>
</div>
`);
}

function displaySuggestions(suggestions) {
  const output = $("#suggestions");

  output.empty();

  if (suggestions && suggestions.length > 0) {
    suggestions.forEach((suggestion) => {
      output.append(`
      <li class="list-group-item">${suggestion.name}</li>
      
      `);
    });

    output.find("li").on("click", function () {
      const selectedCity = $(this).text();
      $("#cityName").val(selectedCity);
      clearData();
    });
  } else {
    clearData();
  }
}

function clearData() {
  $("#suggestions").empty();
}
