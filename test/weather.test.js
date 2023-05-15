import {describe, it} from 'node:test';
import assert from 'assert';

import {extractWeather} from "../src/weather.js";

describe("extracting weather information", () => {
    const example = {
        "latitude": 51.5,
        "longitude": 51.5,
        "generationtime_ms": 1.0390281677246094,
        "utc_offset_seconds": 0,
        "timezone": "GMT",
        "timezone_abbreviation": "GMT",
        "elevation": 38,
        "hourly_units": {
            "time": "iso8601",
            "temperature_2m": "°C",
            "cloudcover": "%",
            "windspeed_10m": "km/h"
        },
        "hourly": {
            "time": [
                "2023-05-12T00:00",
                "2023-05-12T01:00",
                "2023-05-12T02:00",
                "2023-05-12T03:00",
                "2023-05-12T04:00",
                "2023-05-12T05:00",
                "2023-05-12T06:00",
                "2023-05-12T07:00",
                "2023-05-12T08:00",
                "2023-05-12T09:00",
                "2023-05-12T10:00",
                "2023-05-12T11:00",
                "2023-05-12T12:00",
                "2023-05-12T13:00",
                "2023-05-12T14:00",
                "2023-05-12T15:00",
                "2023-05-12T16:00",
                "2023-05-12T17:00",
                "2023-05-12T18:00",
                "2023-05-12T19:00",
                "2023-05-12T20:00",
                "2023-05-12T21:00",
                "2023-05-12T22:00",
                "2023-05-12T23:00"
            ],
            "temperature_2m": [
                11.1,
                11,
                11.2,
                11.8,
                12.8,
                13.7,
                13.7,
                13.1,
                13.7,
                13.1,
                13.2,
                14.1,
                13.4,
                13.2,
                12.8,
                12,
                11.7,
                11.1,
                10.8,
                10.5,
                10.1,
                9.8,
                9.6,
                9.2
            ],
            "cloudcover": [
                100,
                97,
                96,
                90,
                69,
                60,
                83,
                91,
                15,
                60,
                98,
                99,
                100,
                100,
                100,
                100,
                100,
                100,
                97,
                97,
                95,
                95,
                92,
                83
            ],
            "windspeed_10m": [
                1.9,
                3,
                11,
                12,
                26,
                38,
                49,
                ,
                16.6,
                19.1,
                18.5,
                19.4,
                18.4,
                18.2,
                17.7,
                14.9,
                14.3,
                12.7,
                11.7,
                13.5,
                13.8,
                16.1,
                15.8,
                14.8
            ]
        }
    }

    it("extracts the current temperature", () => {
        const currentWeather = extractWeather(example, new Date(2023, 0, 5, 9))
        assert.deepEqual(currentWeather.temperature, 13.7)
    })

    describe("extracts sunshine", () => {
        it("sunny when cloud cover below 20%", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 9))
            assert.deepEqual(currentWeather.sunshine, "Sunny")
        })

        it("sun/cloud when cloud cover between 20 - 70%", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 10))
            assert.deepEqual(currentWeather.sunshine, "Sun/Cloud")
        })

        it("cloudy when cloud cover above 70%", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 11))
            assert.deepEqual(currentWeather.sunshine, "Cloudy")
        })
    })


    describe("extracts wind speed", () => {
        it("scale 0 when wind speed below 2 km/h", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 1))
            assert.deepEqual(currentWeather.windSpeed, "0 Smoke rises vertically")
        })

        it("scale 1 when wind speed between 2–5 km/h", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 2))
            assert.deepEqual(currentWeather.windSpeed, "1 Slight smoke drift")
        })

        it("scale 2 when wind speed between 6–11 km/h", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 3))
            assert.deepEqual(currentWeather.windSpeed, "2 Wind felt on face, leaves rustle")
        })

        it("scale 3 when wind speed between 12–19 km/h", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 4))
            assert.deepEqual(currentWeather.windSpeed, "3 Leaves and twigs in slight motion")
        })

        it("scale 4 when wind speed between 20–28 km/h", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 5))
            assert.deepEqual(currentWeather.windSpeed, "4 Dust raised and small branches move")
        })

        it("scale 5 when wind speed between 29–38 km/h", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 6))
            assert.deepEqual(currentWeather.windSpeed, "5 Small trees in leaf begin to sway")
        })

        it("scale 6 when wind speed between 39–49 km/h", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 7))
            assert.deepEqual(currentWeather.windSpeed, "6 Large branches move and trees sway")
        })

        it("Message if the wind speed was not determined", () => {
            const currentWeather = extractWeather(example, new Date(2023, 0, 5, 8))
            assert.deepEqual(currentWeather.windSpeed, "Unable to fetch wind speed")
        })
    })

})

