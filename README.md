# ASLint wrapper

## Description

This is npm wrapper for [ASLint](https://www.aslint.org/)  a11y testing tool.

## Install 

For npm:
```bash
npm install --save aslint-wrapper
```

For yarn:
```bash
yarn add aslint-wrapper
```

## Structure
src/index.js - original loader.js file

src/uploaded/loader.js - modified loader.js file, remove save aslint.bundle.js file.

src/uploaded/aslint.bundle.js - original aslint.bundle.js file, use with src/uploaded/loader.js

## License

Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)