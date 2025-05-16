# Contributing to Shiftkey Labs Mobile App

Welcome to the Shiftkey Labs mobile app contribution guide! This document is a comprehensive guide to help you get started with contributing to our app, which is built with React Native, Expo, TypeScript, and managed on GitHub under the Shiftkey Events project.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- Expo CLI

## Setting Up the Development Environment

1. **Fork the Repository:**

   Visit the [Shiftkey Labs repository on GitHub](https://github.com/orgs/shiftkey-labs/projects/1) and fork it to your account.

2. **Clone the Forked Repository:**

   ```bash
   git clone https://github.com/your-username/shiftkey-app.git
   cd ShiftkeyEvents
   ```

3. **Set Upstream Remote:**

   This step ensures you can sync changes from the main repository.

   ```bash
   git remote add upstream https://github.com/shiftkey-labs/shiftkey-app.git
   ```

4. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

## Workflow for Contribution

1. **Sync with Main Repository:**

   Before starting, make sure your local repository is up-to-date.

   ```bash
   git pull upstream main
   ```

2. **Create a New Branch:**

   Create a branch with a descriptive name related to the feature or bug you're working on:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/your-bugfix-name
   ```

3. **Make Your Changes:**

   Implement your feature or fix. Keep your code clean and well-documented.

4. **Writing and Running Tests:**

   Add necessary tests and ensure they pass:

   ```bash
   npm test
   # or
   yarn test
   ```

5. **Linting Your Code:**

   Make sure your code adheres to the project's style guidelines:

   ```bash
   npm run lint
   # or
   yarn lint
   ```

6. **Committing Changes:**

   Use clear, concise commit messages following conventional commits:

   ```bash
   git commit -m "feat: add new authentication feature"
   ```

7. **Pushing Changes:**

   Push your changes to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Creating a Pull Request:**

   Go to your fork on GitHub and open a pull request to the `main` branch of the main repository. Fill in the PR template detailing your changes.

## Code Review Process

After you submit your pull request, it will be reviewed by the maintainers. They may suggest changes, improvements, or additional tests. Keep an eye on your PR for feedback and continue the conversation until your PR is merged.

## Development Guidelines

As part of our commitment to maintaining a consistent and high-quality codebase, please adhere to the following guidelines:

#### Using Existing Styles

- **Theme Reference**: Make sure to utilize the theme setup in our `App` for styling common components like buttons and text. Additionally, refer to the `theme.ts` file, which contains global styles that should be incorporated into your work.

#### Adherence to Stylesheets and Design

- **Design Consistency**: Ensure that you strictly adhere to the stylesheets and design guidelines provided. This consistency is crucial for maintaining the unified look and feel of our application.

#### Code Quality and Best Practices

- **Linting**: Always run the linting tools before pushing your code. This helps in maintaining code quality and adhering to the coding standards.
- **Prettier and ESLint Configuration**: Ensure that Prettier and ESLint are configured on your local machine. This will help you catch and fix issues early in the development process.

#### Branch Management

- **Production and Development Branches**: The latest production branch is `main`, and the latest development branch is `jason`. Make sure to base your work off the appropriate branch.

## Community and Communication

- **Join the Discussion:** Participate in discussions on GitHub issues and pull requests.
- **Stay Updated:** Regularly sync your fork with the main repository to stay up-to-date.

## Thank You

We appreciate your contributions to making the Shiftkey Labs mobile app a robust and valuable tool. Thank you for being a part of our community!
