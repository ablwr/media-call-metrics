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

window.setInterval(function() {
  console.log("collecting some network stats")
  collection();
}, 15000); // 15000 milliseconds or 15 seconds
