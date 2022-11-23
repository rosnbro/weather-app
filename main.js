async function weatherData(location, units) {
  try {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=53a8ca4edc6d9f89d1a3c6144858865a&units=${units}`, {mode: 'cors'});
    let weather = await response.json();
    let data = {
      feels_like: weather['main']['feels_like'],
      humidity: weather['main']['humidity'],
      pressure: weather['main']['pressure'],
      temp: weather['main']['temp'],
      name: weather['name'],
      sunrise: weather['sys']['sunrise'],
      sunset: weather['sys']['sunset'],
      description: weather['weather']['description'],
      windspeed: weather['wind']['speed'],
      windDir: weather['wind']['deg'],
      units: units,
    }
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function geocodeData(city, country, state) {
  try {
    if (state) {
      let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`, {mode: 'cors'});
      let location = await response.json();
      let coordinates = {
        lat: location[0]['lat'],
        lon: location[0]['lon'],
      }
      return coordinates;
    } else if (country) {
      let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`, {mode: 'cors'});
      let location = await response.json();
      let coordinates = {
        lat: location[0]['lat'],
        lon: location[0]['lon'],
      }
      return coordinates;
    } else {
      let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=53a8ca4edc6d9f89d1a3c6144858865a`, {mode: 'cors'});
      let location = await response.json();
      let coordinates = {
        lat: location[0]['lat'],
        lon: location[0]['lon'],
      }
      return coordinates;
    }
  } catch (err) {
    console.log(err);
  }
}

async function search() {
  let spot = await geocodeData('London', 'GB', 'england');
  let weather = await weatherData(spot, 'metric');
  console.log(spot);
  console.log(weather);
}

search();

