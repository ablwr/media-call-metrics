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


document.getElementById("makeRoom").onclick = function() {
  fetch("/make-room", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(response => {
  	console.log(response);
  	document.getElementById('newRoomWrapper').style.display = "";
    document.getElementById("newRoom").setAttribute("href", response["url"]);
    document.getElementById("newRoom").innerText = response["url"];
    callFrame = window.DailyIframe.createFrame();
	  callFrame.join({ url: response["url"] });

		window.setInterval(function() {
		  collection();
		}, 15000); // 15000 milliseconds or 15 seconds

  })
  .catch(err => console.error(err));
};

async function collection() {
	// We need videoRecvBitsPerSecond, videoRecvPacketLoss, 
	// videoSendBitsPerSecond, videoSendPacketLoss
  // and timestamp
	let netStats = await callFrame.getNetworkStats();
  let session_id = callFrame.participants().local.session_id;
  let client_id = callFrame.participants().local.client_id;
	// insert netStats.stats.latest into sqlite database
  const data = { "session_id": session_id, "client_id": client_id, "logs": JSON.stringify(netStats.stats.latest) };
  console.log(data);
  fetch("/log-data", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
    	// do nothing
    })

}

// window.setInterval(function() {
//   collection();
// }, 15000); // 15000 milliseconds or 15 seconds