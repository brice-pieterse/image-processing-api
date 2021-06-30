# Image Processing Api


## Overview

A project for Udacity's Fullstack JavaScript Developer Nanodegree. The goal was to create a server with endpoints that could be called to retrieve a photo. Additional url parameters including width and height would make it possible for the server to transform the photo before sending it to the client. Additionally, after transforming a photo with a set of parameters, it would be cached for identitical, future requests.

The project includes the Sharp library for image processing, Jasmine for unit testing, and Eslint/Prettier for linting and formatting.


## Usage

The api can be used to retrieve an image of a corgi, lab, or maltese dog. Images can be retrieved as is, without url parameters by calling the endpoint /dogs with a breed paramter:

- "http://localhost:3000//dogs?breed=corgi"

Or with either width, height, or both parameters:

- "http://localhost:3000/dogs?breed=corgi&width=450"
- "http://localhost:3000/dogs?breed=corgi&width=450&height=600"


## NPM Scripts

To format:

```
npm run lint
npm run prettier
```

To run unit tests on current dist folder:

```
npm run jasmine
```

To build then run unit tests:

```
npm run test
```

To build from Typescript before starting the server:

```
npm run start
```