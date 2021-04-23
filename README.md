# media-call-metrics

Small proof-of-concept app for collecting and visualizing video stream metadata.

## User goals

Public user goals:
- [x] can create a video conference room
- [x] can send video conference link to friends
- [x] more than one user can do this at a time (conference IDs are generated and unique, not everyone joining the same room -- that's awkward)
- [ ] Consider if users should only need to create a session, not a new room
- [ ] Stretch goal: pass in randomly generated but human-readable name
- [ ] Stretch goal: set rooms to auto-delete after X amount of minutes 

Administrator user goals:
- [x] can see dashboard with call history
- [x] can see details of a call
- [x] call details should include visualized charts for received/sent bits per second and received/sent packet loss
- [x] because calls have sessions, determine how to note those breaks, or if they should be separate charts
- [x] data should be at 15s granularity level
- [x] can click on each call to see call details
- [ ] call details should be per user, not overall / for one user
- [ ] Stretch goal: user should be able to delete rooms from the dashboard

## Getting started

These resources were helpful in getting me up-to-speed with the Daily API:
- [Daily reference documentation](https://docs.daily.co/reference)
- [Deploy a Daily backend Node.js server instantly](https://www.daily.co/blog/deploy-a-daily-co-backend-node-js-server-instantly/)

## Development

To run this application locally, you need:
- An API key from [Daily.co](https://daily.co), an audio/video API.
- `npm` installed and running on your computer. `npm` is a package manager for Node.js, which is used to build the server component of this application. Node.js is a JavaScript library for doing this kind of work. Even though `npm` is for Node.js, it also includes a lot of other libraries that allow this application to download everything it needs to run smoothly on your computer. You can find installation instructions and more information [here](https://www.npmjs.com/).

To get up and running:
- Clone this repository and open this directory in your terminal
- Add your Daily.co API key to a `.env` file in the root of your folder, like this: `DAILY_API=your-api-key-here`
- Run `npm install` to install dependencies
- Run `npm start` to start your server
- Go to [https://localhost:1337/](http://localhost:1337/) in your browser

*Note bene: This application is configured to run https on localhost using the [https-localhost](https://www.npmjs.com/package/https-localhost) package. This may require extra installation steps. See the package page for more information.*