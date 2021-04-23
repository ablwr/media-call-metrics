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
	// We need to collect:
	// videoRecvBitsPerSecond, videoRecvPacketLoss, 
	// videoSendBitsPerSecond, videoSendPacketLoss
  // and timestamp for each user
	let netStats = await callFrame.getNetworkStats();
  let session_id = callFrame.participants().local.session_id;
  let user_id = callFrame.participants().local.user_id;

  const data = { "session_id": session_id, "user_id": user_id, "logs": JSON.stringify(netStats.stats.latest) };

  fetch("/log-data", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(response => {
    	// do nothing, it's fine
    })

}
