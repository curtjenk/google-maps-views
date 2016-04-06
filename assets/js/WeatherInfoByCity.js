
var WeatherSearchResults = function(data) {
    data = data || {};
    this.currTemp = data.currTemp;
    this.maxTemp = data.maxTemp;
    this.minTemp = data.minTemp;
    this.humidity = data.humidity;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.weatherDescription = data.weatherDescription;
    this.weatherMain = data.weatherMain;
    this.weatherIconURL = data.weatherIconURL;
    this.sunriseEpoch = data.sunrise;
    this.sunsetEpoch = data.sunset;
    this.country = data.country;
};
WeatherSearchResults.prototype.sunriseLocalTime = function() {
    var d = new Date(0); 
    d.setUTCSeconds(this.sunriseEpoch);
    return d.toLocaleTimeString();
};
WeatherSearchResults.prototype.sunsetLocalTime = function() {
    var d = new Date(0); 
    d.setUTCSeconds(this.sunsetEpoch);
    return d.toLocaleTimeString();
};

function weatherSearchByCity(inputCity, apiKey, callBackFunc) {
    var apiKeyParam = '&APPID=' + apiKey;
    var unitsParam = '&units=imperial';
    var searchParam = '?q=';
    var weatherURL = 'http://api.openweathermap.org/data/2.5/weather';
    var iconURL = 'http://openweathermap.org/img/w/';
    var URL = weatherURL + searchParam + inputCity + unitsParam + apiKeyParam;
    console.log("Weather url = " + URL);

    $.getJSON(URL, function(weatherData) {
        var searchResults = new WeatherSearchResults({});
        searchResults.currTemp = weatherData.main.temp;
        searchResults.maxTemp = weatherData.main.temp_max;
        searchResults.minTemp = weatherData.main.temp_min;
        searchResults.humidity = weatherData.main.humidity;
        searchResults.latitude = weatherData.coord.lat;
        searchResults.longitude = weatherData.coord.lon;
        searchResults.weatherDescription = weatherData.weather[0].description;
        searchResults.weatherMain = weatherData.weather[0].main;
        searchResults.weatherIconURL = iconURL + weatherData.weather[0].icon + '.png';
        searchResults.sunriseEpoch = weatherData.sys.sunrise; //seconds since EPOCH
        searchResults.sunsetEpoch = weatherData.sys.sunset; //seconds
        searchResults.country = weatherData.sys.country;
        callBackFunc(searchResults);
    });
}
