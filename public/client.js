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
  })
  .catch(err => console.error(err));
};

async function collection() {
	let netStats = await callFrame.getNetworkStats();
	console.log(netStats.stats.latest.videoRecvBitsPerSecond);
	console.log(netStats.stats.latest.videoRecvPacketLoss);
	console.log(netStats.stats.latest.videoSendBitsPerSecond);
	console.log(netStats.stats.latest.videoSendPacketLoss);
}

window.setInterval(function() {
  collection();
}, 15000); // 15000 milliseconds or 15 seconds