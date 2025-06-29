# The Ask

Automate any cases that you would think are good to test the functionality of validating logging into hudl.com with your credentials.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers and Axe module:
```bash
npm install playwright
npm install @axe-core/playwright
```

see https://playwright.dev/docs/intro for full details

4. Set up secret credentials:

replace REPLACE-ME with valid username and password in tests/fixtures/test-data.js

## Running Tests

### Run all tests (note this will run 60 tests and take around a minute):
```bash
npx playwright test
```

### Run only specific browser (see playwright.config.js for full list):
```bash
npx playwright test --project "Mobile Chrome"
```

### Run only specific tests by tag:
  @valid - tests using fully valid users
  @invalid - tests using invalid user access (@username @password @attack @a11y):

```bash
npx playwright test --grep "@invalid"
```

## Reporting

Playwright generates detailed reports including:
- Test execution results
- Screenshots on failure
- Accessibility violation details
- Performance metrics

View report:
```bash
npx playwright show-report
```
