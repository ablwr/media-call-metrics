# media-call-metrics

Small proof-of-concept app for collecting and visualizing video stream metadata.

## User goals

Public user goals:
- [ ] can create a video conference room
- [ ] can send video conference link to friends
- [ ] more than one user can do this at a time (conference IDs are generated and unique, not everyone joining the same room -- that's awkward)

Administrator user goals:
- [ ] can see dashboard with call history
- [ ] can click on each call to see call details
- [ ] call details should include visualized charts for received/sent bits per second and received/sent packet loss
- [ ] data should be at 15s granularity level

## Development

To run this application locally, you need:
- An API key from [Daily.co](https://daily.co), an audio/video API.
- `npm` installed and running on your computer. `npm` is a package manager for Node.js, which is used to build the server component of this application. Node.js is a JavaScript library for doing this kind of work. Even though `npm` is for Node.js, it also includes a lot of other libraries that allow this application to download everything it needs to run smoothly on your computer. You can find installation instructions and more information [here](https://www.npmjs.com/).

To get up and running:
- Clone this repository and open this directory in your terminal
- Run `npm install` to install dependencies
- Run `npm start` to start your server
- Go to [http://localhost:1337/](http://localhost:1337/) in your browser
