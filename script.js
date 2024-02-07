const API_KEY = "045ac6e30c6e4b83bba92117240602";

$("#cityName").on("keypress", function () {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    searchWeather();
  }
});

$("#cityName").on("input", function () {
  const cityName = $(this).val();

  if (cityName.trim() === "") {
    clearData();
    return;
  }

  const suggestionRequest = new XMLHttpRequest();

  suggestionRequest.onload = function () {
    if (suggestionRequest.status === 200) {
      const response = JSON.parse(this.responseText);
      console.log(response);
      displaySuggestions(response);
    } else {
      console.error(`Error: ${suggestionRequest.statusText}`);
    }
  };

  suggestionRequest.onerror = function () {
    console.error("Network error occurred while fetching suggestions.");
  };

  suggestionRequest.open(
    "GET",
    `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${cityName}`
  );

  suggestionRequest.send();
});

function searchWeather() {
  const cityName = $("#cityName").val();

  if (cityName.trim() === "") {
    alert("City Name cannot be empty");
    return;
  } else if (!cityName.trim().match(/^[A-Za-z]+$/)) {
    alert("Enter a valid name with only letters");
    return;
  }

  const request = new XMLHttpRequest();
  request.onload = function () {
    if (request.status === 200) {
      const response = JSON.parse(this.responseText);
      console.log(response);
      displayWeatherData(response);
    } else {
      alert(`Error: ${request.statusText} or City NOT FOUND!!!!`);
    }
  };

  request.onerror = function () {
    alert("Network error occurred. Please try again.");
  };

  request.open(
    "GET",
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}&aqi=no`
  );

  request.send();
  clearData();

  $("#cityName").val("");
}

function displayWeatherData(data) {
  const { location, current, condition } = data;
  const time = location.localtime.split(" ")[1];
  const date = location.localtime.split(" ")[0];

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
