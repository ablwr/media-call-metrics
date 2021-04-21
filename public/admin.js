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

const opts = { responsive: true, aspectRatio: 1.33, legend: {display: false }, scales: {xAxes: [{ticks: {fontColor: "white",fontStyle: "bold"}}]}};

let buildChart = function(name, label, data, opts) {
  new Chart(document.getElementById(name).getContext('2d'), {
    type: 'line',
    data: {
      labels: [1, 2, 3, 4, 5, 6],
      datasets: [{
          label: label,
          data: [5, 10, 15, 16, 15, 20],
          fill: false,
          borderColor: "navy",
      }]},
      options: opts,    
  });
}

buildChart("videoSendBitsPerSecond", "Video Send Bits", [], opts)