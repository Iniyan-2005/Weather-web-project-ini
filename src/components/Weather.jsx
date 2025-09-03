
import React, { useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
    
    const [weatherData, setWeatherData] = useState({
        temperature: '16°C',
        location: 'London',
        humidity: '91 %',
        windSpeed: '10km/hr',
        icon: clear_icon
    });
    const [cityInput, setCityInput] = useState('London');

    
    const getWeatherIcon = (code) => {
        
        const iconMap = {
            0: clear_icon, // Clear sky
            1: clear_icon, // Mainly clear
            2: cloud_icon, // Partly cloudy
            3: cloud_icon, // Overcast
            45: cloud_icon, // Fog
            48: cloud_icon, // Depositing rime fog
            51: drizzle_icon, // Drizzle: Light
            53: drizzle_icon, // Drizzle: Moderate
            55: drizzle_icon, // Drizzle: Dense intensity
            56: drizzle_icon, // Freezing Drizzle: Light
            57: drizzle_icon, // Freezing Drizzle: Dense intensity
            61: rain_icon, // Rain: Slight
            63: rain_icon, // Rain: Moderate
            65: rain_icon, // Rain: Heavy intensity
            66: rain_icon, // Freezing Rain: Light
            67: rain_icon, // Freezing Rain: Heavy intensity
            71: snow_icon, // Snow: Slight
            73: snow_icon, // Snow: Moderate
            75: snow_icon, // Snow: Heavy intensity
            77: snow_icon, // Snow grains
            80: rain_icon, // Rain showers: Slight
            81: rain_icon, // Rain showers: Moderate
            82: rain_icon, // Rain showers: Violent
            85: snow_icon, // Snow showers: Slight
            86: snow_icon, // Snow showers: Heavy
            95: rain_icon, // Thunderstorm: Slight or moderate
            96: rain_icon, // Thunderstorm with slight hail
            99: rain_icon, // Thunderstorm with heavy hail
        };
        return iconMap[code] || clear_icon; 
    };

    
    const search = async () => {
        if (cityInput.trim() === '') return;

        try {
            // Step 1: Geocoding API call to get coordinates
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                alert('City not found!');
                return;
            }

            const { latitude, longitude, name } = geoData.results[0];

            // Step 2: Weather Forecast API call using the retrieved coordinates
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherJson = await weatherResponse.json();

            const current = weatherJson.current;

            
            setWeatherData({
                temperature: `${Math.round(current.temperature_2m)}°C`,
                location: name,
                humidity: `${current.relative_humidity_2m} %`,
                windSpeed: `${current.wind_speed_10m} km/hr`,
                icon: getWeatherIcon(current.weather_code)
            });

        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("Error fetching weather data. Please try again.");
        }
    };

    
    return (
        <div className='weather'>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for a city..."
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && search()}
                />
                <img src={search_icon} alt="search-bar" className='img' onClick={search} />
            </div>
            <img src={weatherData.icon} className="weather_icon" alt="weather icon" />
            <p className="temperature">{weatherData.temperature}</p>
            <p className="location">{weatherData.location}</p>
            <div className="weather-data">
                <div className="col">
                    <img src={humidity_icon} alt="humidity" />
                    <div>
                        <p>{weatherData.humidity}</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={wind_icon} alt="wind" />
                    <div>
                        <p>{weatherData.windSpeed}</p>
                        <span>Wind</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
