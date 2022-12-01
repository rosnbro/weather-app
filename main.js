const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const countryInput = document.getElementById('country');
const locationButton = document.getElementById('locationButton');

locationButton.addEventListener('click', () => {
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
      pressure: weather['main']['pressure'],
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
    console.log(err);
  }
}

async function geocodeData(spot) {
  try {
    let url = '';
    if (spot.state && spot.country) {
      url = `http://api.openweathermap.org/geo/1.0/direct?q=${spot.city},${spot.state},${spot.country}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`;
    } else if (spot.state) {
      spot.country = 'US'
      url = `http://api.openweathermap.org/geo/1.0/direct?q=${spot.city},${spot.state},${spot.country}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`;
    } else if (spot.country) {
      url = `http://api.openweathermap.org/geo/1.0/direct?q=${spot.city},${spot.country}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`;
    } else {
      url = `http://api.openweathermap.org/geo/1.0/direct?q=${spot.city}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`;
    }

    let response = await fetch(url, {mode: 'cors'});
    let location = await response.json();
    return {
      lat: location[0]['lat'],
      lon: location[0]['lon'],
    };
  } catch (err) {
    console.log(err);
  }
}

async function search(city, state, country) {
  let location = validateSearch(city, state, country);
  let spot = await geocodeData(location);
  let weather = await weatherData(spot, 'metric');
  console.log(spot);
  console.log(weather);
}

function validateSearch(cityInput, stateInput, countryInput) {
  if (cityInput.validity.valid && stateInput.validity.valid && countryInput.validity.valid) {
    return {
      city: cityInput.value,
      state: stateInput.value,
      country: countryInput.value
    }
  } else {
    alert('input a valid city name');
  }
}

search(cityInput, stateInput, countryInput); // Default load
