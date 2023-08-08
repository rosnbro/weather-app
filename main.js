const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const countryInput = document.getElementById('country');
const locationButton = document.getElementById('locationButton');
const imperialSelector = document.getElementById('imperial');
const metricSelector = document.getElementById('metric');
const temperature = document.getElementById('temp');


locationButton.addEventListener('click', () => {
  search(cityInput, stateInput, countryInput);
});
imperialSelector.addEventListener('click', () => {
  search(cityInput, stateInput, countryInput);
});
metricSelector.addEventListener('click', () => {
  search(cityInput, stateInput, countryInput);
});

cityInput.addEventListener('keydown', (e) => handleKeydown(e));
stateInput.addEventListener('keydown', (e) => handleKeydown(e));
countryInput.addEventListener('keydown', (e) => handleKeydown(e));


function handleKeydown(e) {
  if (e.key === 'Enter') {
    search(cityInput, stateInput, countryInput);
    e.preventDefault();
  }
}

async function weatherData(location, units) {
  try {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=53a8ca4edc6d9f89d1a3c6144858865a&units=${units}`, {mode: 'cors'});
    let weather = await response.json();
    return {
      feels_like: weather['main']['feels_like'],
      humidity: weather['main']['humidity'],
      temp: weather['main']['temp'],
      name: weather['name'],
      sunrise: weather['sys']['sunrise'],
      sunset: weather['sys']['sunset'],
      description: weather['weather'][0]['description'],
      windspeed: weather['wind']['speed'],
      windDir: weather['wind']['deg'],
      units: units,
    };
  } catch (err) {
    alert('Weather data not available.');
    console.log(err);
    return false;
  }
}

async function geocodeData(spot) {
  try {
    let url = '';
    if (spot.state && spot.country) {
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${spot.city},${spot.state},${spot.country}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`;
    } else if (spot.state) {
      spot.country = 'US'
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${spot.city},${spot.state},${spot.country}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`;
    } else if (spot.country) {
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${spot.city},${spot.country}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`;
    } else {
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${spot.city}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`;
    }

    let response = await fetch(url, {mode: 'cors'});
    let location = await response.json();
    return {
      lat: location[0]['lat'],
      lon: location[0]['lon'],
    };
  } catch (err) {
    handleBadLocation();
    console.log(err);
    return false;
  }
}

async function search(city, state, country) {
  let units = document.querySelector('input[name="units"]:checked');
  let location = validateSearch(city, state, country);
  if (location != false) {
    let spot = await geocodeData(location);
    if (spot != false) {
      let weather = await weatherData(spot, units.value);
      displayData(weather);
    }
  }
}

function validateSearch(cityInput, stateInput, countryInput) {
  if (cityInput.validity.valid && stateInput.validity.valid && countryInput.validity.valid) {
    return {
      city: cityInput.value,
      state: stateInput.value,
      country: countryInput.value
    }
  } else {
    handleBadLocation();
    return false;
  }
}

function handleBadLocation() {
  alert('Please enter a valid location');
}

function displayData(weather) {
  let display = formatData(weather);
  for (const dataPoint in display) {
    if (document.getElementById(dataPoint)) {
      let displayData = document.getElementById(dataPoint);
      switch (dataPoint) {
        case 'temp':
          displayData.innerHTML = `${display[dataPoint]}`;
          break;
        case 'feels_like':
          displayData.innerHTML = `feels like ${display[dataPoint]}`;
          break;
        case 'humidity':
          displayData.innerHTML = `${display[dataPoint]} humidity`;
          break;
        case 'description':
          displayData.innerHTML = `${display[dataPoint]}`;
          break;
        case 'sunrise':
          displayData.innerHTML = `sunrise at ${display[dataPoint]}`;
          break;
        case 'sunset':
          displayData.innerHTML = `sunset at ${display[dataPoint]}`;
          break;
        case 'windDir':
          displayData.innerHTML = `wind coming from ${display[dataPoint]}`;
          break;
        case 'windspeed':
          displayData.innerHTML = `at ${display[dataPoint]}`;
          break;
        default:
          displayData.innerHTML = `${dataPoint}: ${display[dataPoint]}`;
          break;
      }
      
    }
  }
}

function formatData(weather) {
  let units = weather['units'];
  
  weather['humidity'] += '%';
  weather['sunset'] = formatTime(weather['sunset']);
  weather['sunrise'] = formatTime(weather['sunrise']);
  weather['temp'] = formatTemp(weather['temp'], units);
  weather['windDir'] = formatWindDir(weather['windDir']);
  weather['windspeed'] = formatSpeed(weather['windspeed'], units);
  weather['feels_like'] = formatTemp(weather['feels_like'], units);
  weather['description'] = formatDescription(weather['description']);
  return weather;
}

function formatTime(apiTime) {
  let time = new Date(apiTime * 1000);
  let hours = time.getHours();
  let minutes = time.getMinutes();

  if (minutes < 10) {
    if (hours > 12) {
      return `${hours - 12}:0${minutes} PM`;
    } else return `${hours}:0${minutes} AM`;
  } else {
    if (hours > 12) {
      return `${hours - 12}:${minutes} PM`;
    } else return `${hours}:${minutes} AM`;
  }
}

function formatTemp(apiTemp, units) {
  let temp = Math.round(apiTemp);
  if (units == 'imperial') {
    return temp += '°F';
  } else if (units == 'metric') {
    return temp += '°C';
  } else return temp += 'K';
}

function formatSpeed(speed, units) {
  if (units == 'imperial') {
    return speed + ' mph';
  } else if (units == 'metric') {
    return speed + ' m/s';
  }
}

function formatDescription(description) {
  return description;
}

function formatWindDir(windDir) {
  return windDir + '°';
}

search(cityInput, stateInput, countryInput); // Default load
