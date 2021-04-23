const roomsList = document.getElementById("roomsList");

document.getElementById("getRooms").onclick = function() {
	fetch("/rooms", {})
	  .then(res => res.json())
	  .then(response => {
    	roomsList.innerHTML = "";
	    response["data"].forEach(data => {
	      appendNewData(data);
	    });
	  });
}

const appendNewData = data => {
  const d = data["url"];
  const newListItem = document.createElement("li");
  newListItem.innerHTML = d;
  roomsList.appendChild(newListItem);
};

window.addEventListener('load', (event) => {
  fetch("/sessions", {})
    .then(res => res.json())
    .then(response => {
      document.getElementById("sessionsList").innerHTML = "";
      response.forEach(data => {
        const newSessionButton = document.createElement("button");
        newSessionButton.classList.add('sessionButton');
        newSessionButton.innerText = data["session_id"];
        document.getElementById("sessionsList").appendChild(newSessionButton);
        document.getElementById("sessionsList").appendChild(document.createElement("br"));
        buttons();
      });
    });
});

// button needs to become whichever session UUID is clicked
let buttons = function() {
document.querySelectorAll('.sessionButton').forEach(button => {
  button.onclick = function() {
  fetch("/session-data", {
    method: "POST",
    body: JSON.stringify({"session_id": this.innerText}),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      // this big thing condenses the SQL rows into each user with their respective logs
      console.log(response)
      const usersAndTheirLogs = Array.from(response.reduce((map, {user_id, logs}) => 
          map.set(user_id, [...(map.get(user_id) || []), JSON.parse(logs)]), new Map
        ), ([user_id, logs]) => ({user_id, logs})
      );

      console.log(usersAndTheirLogs);
      
      usersAndTheirLogs.forEach(function (user){
        buildChartsForUser(user);
      });

    })
  }
});
}

let buildChartsForUser = function(user) {
  let ts = []
  let received_bps = []
  let received_loss = []
  let send_bps = []
  let send_loss = []

  user.logs.forEach(function (a) {
      ts.push(new Date(1504095567183).toLocaleDateString("en-US") + new Date(a.timestamp).toLocaleTimeString("en-US"));
      received_bps.push(a.videoRecvBitsPerSecond);
      received_loss.push(a.videoRecvPacketLoss);
      send_bps.push(a.videoSendBitsPerSecond);
      send_loss.push(a.videoSendPacketLoss);
  });
  let data = { "timestamps": ts, 
               "videoRecvBitsPerSecond": received_bps,
               "videoRecvPacketLoss": received_loss, 
               "videoSendBitsPerSecond": send_bps,
               "videoSendPacketLoss": send_loss 
             }

  buildChart("videoRecvBitsPerSecond", data["timestamps"], data["videoRecvBitsPerSecond"], opts)
  buildChart("videoRecvPacketLoss", data["timestamps"], data["videoRecvPacketLoss"], opts)
  buildChart("videoSendBitsPerSecond", data["timestamps"], data["videoSendBitsPerSecond"], opts)
  buildChart("videoSendPacketLoss", data["timestamps"], data["videoSendPacketLoss"], opts)
}

// Chart.js has issues with destroying/refreshing, this manually forces a deletion
// if applying this proof-of-concept to a front-end framework e.g. React, this
// won't be necessary because the component will refresh itself
let deleteChart = function(label){
  document.getElementById(label).remove();
  let canvas = document.createElement('canvas');
  canvas.setAttribute('id', label);
  document.getElementById("sessions").appendChild(canvas);
}

// not using any opts right now -- focus not on design!
let opts = {}

// 4 charts is best but lets just put them all in one for now
let buildChart = function(label, time, data, opts) {
  deleteChart(label);
  new Chart(document.getElementById(label).getContext('2d'), {
    type: 'line',
    data: {
      labels: time,
      datasets: [
        {
          label: label,
          data: data,
          fill: false,
          borderColor: "navy",
        },
      ]},
      options: opts,    
  });
}
