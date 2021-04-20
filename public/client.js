const roomsList = document.getElementById("roomsList");

document.getElementById("getRooms").onclick = function() {
fetch("/rooms", {})
  .then(res => res.json())
  .then(response => {
    response["data"].forEach(data => {
      appendNewData(data);
    });
  });
  
}

const appendNewData = data => {
  console.log(data);
  roomsList.innerHTML = "";
  const d = data["url"];
  const newListItem = document.createElement("li");
  newListItem.innerHTML = d;
  roomsList.appendChild(newListItem);
};

// Rooms data:
// {"total_count":1,"data":[{"id":"d989a9a4-e52c-4b86-b8da-225037e47873","name":"hello-daily","api_created":false,"privacy":"public","url":"https://ablwr.daily.co/hello-daily","created_at":"2021-04-20T00:39:37.000Z","config":{"autojoin":true}}]}