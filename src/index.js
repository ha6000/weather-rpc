#!/usr/bin/env node

const weather = require('openweather-apis');
const DiscordRPC = require('discord-rpc');
const Compass = require("cardinal-direction");
const { promisify } = require('util');

const config = require('../config.json');

weather.setCity(config.city);
weather.setAPPID(config.weatherKey);
weather.setLang(config.lang);

const getAllWeather = promisify(weather.getAllWeather)

// const cardinals = {
// 	'N': '⬆',
// 	'NE': '↗',
// 	'E': '➡',
// 	'SE': '↘',
// 	'S': '⬇',
// 	'SW': '↙',
// 	'W': '⬅',
// 	'NW': '↖'
// }

const cardinals = {
	'N': 'North',
	'NE': 'North East',
	'E': 'East',
	'SE': 'South East',
	'S': 'South',
	'SW': 'South West',
	'W': 'West',
	'NW': 'North West'
}


// function unicodeFromDegree(deg) {
// 	const cardinal = Compass.cardinalFromDegree(deg, 'Ordinal');

// 	return cardinals[cardinal];
// }

// getAllWeather().then(console.log);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function updateRPC() {
	const allWeather = await getAllWeather();

	// console.log(allWeather.weather[0].icon);

	// console.log(allWeather);
	// console.log(`http://openweathermap.org/img/wn/${allWeather.weather.icon}@4x.png`);
	const degName = Compass.cardinalFromDegree(allWeather.wind.deg, 'Ordinal')
	console.log(degName.toLowerCase());
	rpc.setActivity({
		largeImageKey: allWeather.weather[0].icon,
		largeImageText: allWeather.weather[0].description,
		smallImageKey: degName.toLowerCase(),
		// smallImageKey: 'e',
		smallImageText: degName + '​',
		details: `🌡 ${Math.round(allWeather.main.feels_like)}℃ 💨 ${Math.round(allWeather.wind.speed)} m/s`,
		state: `🌫️ ${Math.round(allWeather.main.humidity / 10) * 10}%`,
		endTimestamp: new Date(Date.now() + config.updateInterval).getTime()
		// details: 'test'
	})
}

rpc.on('ready', () => {
	console.log('Authed for user', rpc.user.username);
	updateRPC();
	// rpc.setActivity({
	// 	state: 'Hello RPC'
	// })
	setInterval(updateRPC, config.updateInterval);
});

rpc.login({ clientId: config.clientId });