//const socket = io("ws://127.0.0.1:3000"); //LOCAL TESTING
//const socket = io(); //LIVE SERVER
console.log("connected to websocket");

let inLaterHalf = false;
let fadeValue = 3;

let base, entry, cello, glacier, tundra, blurosti, chords;
let readyToListen = false;
let loadingStatus = document.getElementById("audio-status");
function loadSongs() {
  document.querySelector("button").disabled = "true";
  base = new Pizzicato.Sound("./sound/base.mp3", () => {
    loadingStatus.innerHTML = "14%";
    entry = new Pizzicato.Sound("./sound/entry.mp3", () => {
      loadingStatus.innerHTML = "28%";
      cello = new Pizzicato.Sound("./sound/one/cello.mp3", () => {
        loadingStatus.innerHTML = "42%";
        glacier = new Pizzicato.Sound("./sound/one/glacier.mp3", () => {
          loadingStatus.innerHTML = "56%";
          tundra = new Pizzicato.Sound("./sound/one/tundra.mp3", () => {
            loadingStatus.innerHTML = "70%";
            blurosti = new Pizzicato.Sound("./sound/two/blurosti.mp3", () => {
              loadingStatus.innerHTML = "84%";
              chords = new Pizzicato.Sound("./sound/two/chords.mp3", () => {
                init();
              });
            });
          });
        });
      });
    });
  });
}

function init() {
  console.log("done loading");
  loadingStatus.innerHTML = "✅";
  //start base
  base.play();
  //start phase two but muted
  blurosti.play();
  blurosti.volume = 0;
  blurosti.attack = fadeValue;

  chords.play();
  chords.volume = 0;
  chords.attack = fadeValue;

  //loop base tracks
  base.on("end", () => {
    base.play();
    blurosti.play();
    chords.play();
  });

  //ready to accept websocket data
  readyToListen = true;

  setInterval(toggleHalf, 168000); //168000 ms is half of base track
}

function toggleHalf() {
  inLaterHalf = !inLaterHalf;
}

socket.on("server to listener", (color, a, b, c, d, e) => {
  let avgWhoFive = (a + b + c + d + e) / 5;
  if (readyToListen) {
    if (!inLaterHalf) {
      if (avgWhoFive > 66) {
        cello.play();
        console.log("Playing cello");
      } else if (avgWhoFive > 33) {
        glacier.play();
        console.log("Playing glacier");
      } else {
        tundra.play();
        console.log("Playing tundra");
      }
    } else {
      if (avgWhoFive > 50) {
        console.log("Unmuted blurosti");
        blurosti.volume = 1;
        chords.volume = 0;
      } else {
        console.log("Unmuted chords");
        blurosti.volume = 0;
        chords.volume = 1;
      }
    }
  }
});

function simData() {
  let avgWhoFive = document.getElementById("test-slider").value;
  if (readyToListen) {
    if (!inLaterHalf) {
      if (avgWhoFive > 66) {
        cello.play();
        console.log("Playing cello");
      } else if (avgWhoFive > 33) {
        glacier.play();
        console.log("Playing glacier");
      } else {
        tundra.play();
        console.log("Playing tundra");
      }
    } else {
      if (avgWhoFive > 50) {
        console.log("Unmuted blurosti");
        blurosti.volume = 1;
        chords.volume = 0;
      } else {
        console.log("Unmuted chords");
        blurosti.volume = 0;
        chords.volume = 1;
      }
    }
  }
}
