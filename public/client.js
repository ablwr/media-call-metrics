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
  })
  .catch(err => console.error(err));
};

