# Bee
## A mobile application for surveying bumblebees


[![Bee web app status](https://img.shields.io/website?down_color=lightgrey&down_message=offline&label=bee&style=for-the-badge&up_color=pink&up_message=online&url=https%3A%2F%2Fpurple-wood-8308.fly.dev%2F)](https://purple-wood-8308.fly.dev/)
[![website carbon](https://img.shields.io/website?down_color=pink&down_message=0.00ᶢ%20of%20CO₂/view&label=website%20carbon&style=for-the-badge&up_color=pink&up_message=0.00ᶢ%20of%20CO₂/view&url=https://www.websitecarbon.com/website/purple-wood-8308-fly-dev/)](https://www.websitecarbon.com/website/purple-wood-8308-fly-dev/ )
<sup>_Cleaner than 100% of pages tested_</sup>

[![GitHub x Dev Hackathon 2023](https://img.shields.io/website?down_color=lightblue&down_message=🏅%20Runner%20Up&label=GitHub%20x%20Dev%20Hackathon%202023&style=for-the-badge&up_color=lightblue&up_message=🏅%20Runner%20Up&url=https%3A%2F%2Fpurple-wood-8308.fly.dev%2F)]([https://purple-wood-8308.fly.dev/](https://dev.to/devteam/github-dev-2023-hackathon-winners-announced-236o))  


- Deployed site: https://purple-wood-8308.fly.dev/


## info

[Bumblebee Conservation Trust: Bee Walk Survey Scheme](https://beewalk.org.uk/)

[Gist: Introducing Bee idea for Dev.to x GitHub Hackathon](https://gist.github.com/ruthmoog/3189d06a9a37defef5896562bc2f8180)

["Bee, a mobile app for citizen science." on Dev.to](https://dev.to/ruthmoog/bee-2op1)

## get started

### dependencies

- nodejs v20

Run `npm i` to fetch and install dependencies

### build

`npm run watch`
(or run from `package.json`)

### run tests

#### Unit tests
`npm test`
(or run from `package.json`)

### End to end tests

Import playwright to run all e2e tests including mobile view ports
```bash
npm run playwright-test
```

To see tests run in a UI add the `--ui` flag
```bash
npm playwright-test-ui
```

View test logs
```bash
npx playwright show-report
```

Run on local browser or deployed app by updating `playwright.config.js` baseURL
```javascript
module.exports = defineConfig({
    ...
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:8080', 
    baseURL: 'https://purple-wood-8308.fly.dev/', 
    ...
    }
})
```
