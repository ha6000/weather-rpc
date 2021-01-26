# Weather RPC
Shows your current weather in discord rpc

## Prerequisites
* Discord Developer Application
* NodeJS (v12 recommended)
* Openweathermap.com api key

## Setup
Create a `config.json` and enter your client id from developer portal with

Example:
```json
{
    "city": "New York",
    "weatherKey": "x",
    "clientId": "802172196775526451",
    "lang": "en",
    "updateInterval": 1800000
}
```

## Usage
To start the application run, `node src/index` or with pm2, `pm2 start src/index --name weather-rpc`

If you are going to use pm2, make sure it save it it so it starts back up on startup.

## Todo
[] Create a weather-rpc service and init script