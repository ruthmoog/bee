# Bee
## A mobile application for surveying bumblebees


[![Bee web app status](https://img.shields.io/website?down_color=lightgrey&down_message=offline&label=bee&style=for-the-badge&up_color=palegreen&up_message=online&url=https%3A%2F%2Fpurple-wood-8308.fly.dev%2F)](https://purple-wood-8308.fly.dev/)

[![website carbon](https://img.shields.io/website?down_color=pink&down_message=0.00ᶢ%20of%20CO₂/view&label=website%20carbon&style=for-the-badge&up_color=pink&up_message=0.00ᶢ%20of%20CO₂/view&url=https://www.websitecarbon.com/website/purple-wood-8308-fly-dev/)](https://www.websitecarbon.com/website/purple-wood-8308-fly-dev/ )
<sup>_Cleaner than 100% of pages tested_</sup>

[![EFWA website emissions](https://img.shields.io/website?down_color=pink&down_message=0.01%20ᶢ%20of%20CO2ₑ%20each%20visit&label=EFWA%20website%20emissions&style=for-the-badge&up_color=pink&up_message=0.01%20ᶢ%20of%20CO2ₑ%20each%20visit&url=https://websiteemissions.com/)](https://websiteemissions.com/)


[![GitHub x Dev Hackathon 2023](https://img.shields.io/website?down_color=lightblue&down_message=🏅%20Runner%20Up&label=GitHub%20x%20Dev%20Hackathon%202023&style=for-the-badge&up_color=lightblue&up_message=🏅%20Runner%20Up&url=https%3A%2F%2Fpurple-wood-8308.fly.dev%2F)]([https://purple-wood-8308.fly.dev/](https://dev.to/devteam/github-dev-2023-hackathon-winners-announced-236o))  


- Deployed site: https://purple-wood-8308.fly.dev/

![Bee Project](https://github.com/ruthmoog/portfolio/blob/master/public/images/projects/bee.webp)



## Info and Background

### [Bumblebee Conservation Trust: Bee Walk Survey Scheme](https://beewalk.org.uk/)
BeeWalk is a national recording scheme run by the Bumblebee Conservation Trust to monitor the abundance of bumblebees on transects across the country. 

### [Gist: Introducing Bee idea for Dev.to x GitHub Hackathon](https://gist.github.com/ruthmoog/3189d06a9a37defef5896562bc2f8180)
Project summary including the original Bee Walk process, domain definitions, and user stories.

### ["Bee, a mobile app for citizen science." on Dev.to](https://dev.to/ruthmoog/bee-2op1)
Our submission to the GitHub x Dev.to Hackathon 2023, Phone Friendly category. "Developers can use Codespaces or Actions to create mobile applications that work on both iOS and Android devices, as well as set up automation workflows and CI/CD pipelines for their PWA ready apps."


## Getting Started

### Dependencies

- nodejs v20

Run `npm i` to fetch and install dependencies

### Build

`npm run watch`
(or run from `package.json`)

### Run tests

#### Unit tests
`npm test`
(or run from `package.json`)

#### End to end tests

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

### Run the app

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

### Deploy

Continuous deployment is enabled through github actions; push to main to deploy automatically.

