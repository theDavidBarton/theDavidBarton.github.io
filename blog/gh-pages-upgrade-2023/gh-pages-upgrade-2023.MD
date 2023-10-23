# Upgrading GitHub Pages Deploy Action in 2023

If you're like me and have built most of your React.js frontends using [Create React App](https://create-react-app.dev/), you likely host them on [GitHub Pages](https://github.com/marketplace/actions/deploy-to-github-pages) – a popular choice for static site hosting. To deploy my projects seamlessly, I rely on the well-known GitHub Action: `JamesIves/github-pages-deploy-action`. However, over time, this action has gone through several significant changes, introducing new features and, occasionally, breaking existing workflows. In 2023, to maintain your projects with continuous deployment to GitHub Pages, you need to adapt to the latest version, v4, of JamesIves's action. 

Let's dive in!

## I. CI Configuration

First and foremost, your need to update the CI pipeline for your GitHub Pages to ensure a smooth deployment process. Below is a YAML configuration file that you can use as a reference:

```yml
name: CI
on: 
  push:
    branches:
      - master

permissions:
  contents: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Install and Build 🔧 
        env:
         CI: false
        run: |
          yarn
          yarn build

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build # The folder the action should deploy.
```

This GitHub Actions workflow automates the deployment process by building and deploying your application whenever you push changes to the `master` branch (_Note:_ as these are old projects, for me they have `master` instead of `main` branch). The specified folder (`build`) is where the action will look for your built app.

## II. Code Changes

### 1. React Script Upgrade

Before migrating, make sure to upgrade your React scripts to the latest version:

```shell
yarn add react-scripts@latest
```

This ensures that you're using the most up-to-date version of React (& Friends) for your application.

### 2. ESLint Parser Installation

Breaking change that eslint parser needs to be installed from `@babel` npm.

```shell
yarn add --dev @babel/eslint-parser
```

### 3. Update .eslintrc

Update your `.eslintrc` file to use the Babel ESLint parser:

```json
"parser": "@babel/eslint-parser"
```

This change ensures that ESLint uses the Babel parser for improved code analysis.

### 4. Deduplicate Dependencies

Run the following command to deduplicate dependencies:

```shell
npx yarn-deduplicate && yarn
```

This step helps streamline your application's dependencies and can prevent potential conflicts between packages.

### 5. Local Testing

Finally, don't forget to thoroughly test your application locally. Start with:

```shell
yarn start
```

and ensure that your application runs without issues. Then, build your app with:

```shell
yarn build
```

This step ensures that your application can be successfully built and prepared for deployment.
That's all there is to it! After merging these changes, you're all set for a seamless deployment experience to GitHub Pages in 2023.

Happy coding!
