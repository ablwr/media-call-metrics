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

// todo: expand to work for getSessions as well, if getRooms stays around
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
        const newListItem = document.createElement("button");
        newListItem.innerText = JSON.stringify(data["session_id"]);
        document.getElementById("sessionsList").appendChild(newListItem);
        document.getElementById("sessionsList").appendChild(document.createElement("br"));
      });
    });
});

// button needs to become whichever session UUID is clicked
document.getElementById("button").onclick = function() {
  fetch("/session-data", {
    method: "POST",
    body: JSON.stringify({"session_id": "28c5b098-d85a-4099-bad3-a8ae80859c0f"}),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
      // this big thing condenses the SQL rows into each user with their respective logs
      const usersAndTheirLogs = Array.from(response.reduce((map, {user_id, logs}) => 
          map.set(user_id, [...(map.get(user_id) || []), JSON.parse(logs)]), new Map
        ), ([user_id, logs]) => ({user_id, logs})
      );
      console.log(usersAndTheirLogs);
      // start with first user
      let ts = []
      let received_bps = []
      let received_loss = []
      let send_bps = []
      let send_loss = []
      usersAndTheirLogs[0].logs.forEach(function (a) {
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
      console.log(data)
      buildChart("videoRecvBitsPerSecond", data["timestamps"], data["videoRecvBitsPerSecond"], opts)
      buildChart("videoRecvPacketLoss", data["timestamps"], data["videoRecvPacketLoss"], opts)
      buildChart("videoSendBitsPerSecond", data["timestamps"], data["videoSendBitsPerSecond"], opts)
      buildChart("videoSendPacketLoss", data["timestamps"], data["videoSendPacketLoss"], opts)
    })
}

// not using any opts right now -- focus not on design!
let opts = {}

// 4 charts is best but lets just put them all in one for now
let buildChart = function(label, time, data, opts) {
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

