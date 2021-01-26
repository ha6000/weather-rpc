#!/usr/bin/env node

// Loading Modules
const weather = require('openweather-apis');
const DiscordRPC = require('discord-rpc');
const Compass = require("cardinal-direction");
const { promisify } = require('util');

// Loads config
const config = require('../config.json');

// Updates weather settings
weather.setCity(config.city);
weather.setAPPID(config.weatherKey);
weather.setLang(config.lang);

// Promisify weather function
const getAllWeather = promisify(weather.getAllWeather)

// Init Client
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

// Function to Update the rpc
async function updateRPC() {
	// Get all weather
	const allWeather = await getAllWeather();

	// Converts wind direction to cardinal
	const degName = Compass.cardinalFromDegree(allWeather.wind.deg, 'Ordinal');
	// Updates activity with weather data
	rpc.setActivity({
		largeImageKey: allWeather.weather[0].icon,
		largeImageText: allWeather.weather[0].description,
		smallImageKey: degName.toLowerCase(),
		smallImageText: degName + '​',
		details: `🌡 ${Math.round(allWeather.main.feels_like)}℃ 💨 ${Math.round(allWeather.wind.speed)} m/s`,
		// Rounds humadity to nearest 10
		state: `🌫️ ${Math.round(allWeather.main.humidity / 10) * 10}%`,
		endTimestamp: new Date(Date.now() + config.updateInterval).getTime(),
		// buttons: [{
		// 	label: 'Try Out',
		// 	url: 'https://github.com/ha6000/weather-rpc'
		// }],
	})
}

let intervalID;
// Announces that the client is authed
rpc.on('ready', () => {
	console.log('Authed for user', rpc.user.username);
});

// Starts up interval when the client is connected
rpc.on('connected', () => {
	console.log('Connected');
	updateRPC();
	intervalID = setInterval(updateRPC, config.updateInterval);
});

// Clears timeout when disconnected
rpc.on('disconnected', () => {
	console.log('Disconnected');
	clearTimeout(intervalID);
})
// Logs the client in
rpc.login({ clientId: config.clientId });