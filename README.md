# Bee
## A mobile application for surveying bumblebees

[Bumblebee Conservation Trust: Bee Walk Survey Scheme](https://beewalk.org.uk/)

[Gist: Introducing Bee idea for Dev.to x GitHub Hackathon](https://gist.github.com/ruthmoog/3189d06a9a37defef5896562bc2f8180)

## Deployed site

https://purple-wood-8308.fly.dev/

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