# Flipkart Automation Framework

## Overview
The Flipkart Automation Framework is designed to provide a robust and scalable solution for automating tests on the Flipkart website. This framework utilizes Playwright with TypeScript, following an API-first hybrid approach, and implements the Page Object Model (POM) for better maintainability and readability of test cases.

## Architecture
The framework is structured to separate concerns effectively, allowing for easy updates and modifications. It consists of the following key components:

- **Tests**: Contains test specifications for various functionalities.
- **Pages**: Implements the Page Object Model, encapsulating the UI interactions.
- **API**: Manages backend interactions through reusable API clients.
- **Fixtures**: Provides setup for authentication, test data, and browser context.
- **Utils**: Contains utility functions for environment management, logging, and metrics tracking.
- **Types**: Defines TypeScript interfaces and types for type safety.

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd flipkart-automation-framework
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Update the environment-specific configuration files located in `configs/environments/` as per your requirements.

4. **Run Tests**
   Execute the tests using the following command:
   ```bash
   npx playwright test
   ```

## Usage Guidelines
- Ensure that all tests are written following the Page Object Model to maintain consistency.
- Utilize the provided fixtures for authentication and test data setup to avoid UI-based data creation.
- Follow the strict locator strategy using `getByRole`, `getByLabel`, and `getByTestId` for element selection.

## CI Integration
The framework is integrated with CI tools like GitHub Actions or Jenkins for automated test execution. The CI configuration is located in `.github/workflows/ci.yml`.

## Metrics Tracking
The framework includes metrics tracking for monitoring execution health, including flake rates and execution times. This information is crucial for maintaining the reliability of the automation suite.

## Conclusion
This framework aims to provide a production-grade solution for automating tests on the Flipkart website, ensuring high reliability, maintainability, and scalability. By adhering to best practices and utilizing modern tools, the Flipkart Automation Framework is equipped to handle the demands of continuous testing in a dynamic environment.