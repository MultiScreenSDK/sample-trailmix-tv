# Trailmix-tv
This is the TV app for Trailmix - a sample video app using Samsung Multiscreen SDK.  You can read more about the Trailmix here - [link](https://github.com/MultiScreenSDK/trailmix-tv/blob/master/trailmix.md).


## App URLs
The latest TV and mobile web apps builds are hosted on AWS S3 and available here:
- [TV](http://s3-us-west-1.amazonaws.com/dev-multiscreen-examples/examples/trailmix/tv/index.html)
- [Mobile](http://s3-us-west-1.amazonaws.com/dev-multiscreen-examples/examples/trailmix/mobile/index.html)


## Getting Started
The project utilizes ReactJS for components and BabelJS for ES6/React code compilation support.

## Source Code Structure
- **src** (all uncompiled code and assets)
	- **tv**
		- **index.html** (staticaly copied upon build)
		- **index.js** (used as the entry point for mapping script dependencies)
		- **fonts** (staticaly copied upon build)
		- **images** (staticaly copied upon build)
		- **js** (compiled by babel using the index.js for dependency graphing upon build ... js and jsx files)
		- **styles** (compiled by lessc upon build using styles.less for the entry point)


## Building and Development
To build the app, clone the repo and run the following command:

```bash
$ npm install
```

The postinstall script will create an initial build. Gulp is used for all task including compiling scripts, styles, and assets.

### Gulp tasks
**Build the application**
```bash
$ gulp build
```

**Run the local test server**
```bash
$ gulp server (available at http://localhost:3000/(mobile|tv)
```

**Develop with livereload support**
Watches for src file changes and recompiles the needed files. This includes livereload support. You can install the livereload extension [here](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en).
```bash
$ gulp watch (available at http://localhost:3000/
```

## Communication Protocol (Channel Events)
Refer to this [document](https://github.com/MultiScreenSDK/trailmix-tv/blob/master/trailmix.md) for the communication protocol between TV host app and the mobile client apps.
