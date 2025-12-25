#!/bin/bash
set -e

# Run Playwright tests
npx playwright test

# Generate Allure report
npx allure generate allure-results --clean -o allure-report

# Optionally, open HTML report (for local use)
# npx playwright show-report
