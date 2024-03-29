//const socket = io("ws://127.0.0.1:3000"); //LOCAL TESTING
const socket = io(); //LIVE SERVER
console.log("connected to websocket");

let inLaterHalf = false;
let fadeValue = 3;

let id = null;

//files
let base, entry, cello, glacier, tundra, blurosti, chords, bubbles, pingpong;
let randomSounds = [];
let readyToListen = false;
let loadingStatus = document.getElementById("audio-status");
function loadSongs() {
  document.querySelector("button").disabled = "true";
  base = new Pizzicato.Sound(
    { source: "file", options: { path: "./sound/base.mp3", loop: true } },
    () => {
      loadingStatus.innerHTML = "14%";
      entry = new Pizzicato.Sound("./sound/entry.mp3", () => {
        loadingStatus.innerHTML = "28%";
        cello = new Pizzicato.Sound("./sound/one/cello.mp3", () => {
          loadingStatus.innerHTML = "42%";
          glacier = new Pizzicato.Sound("./sound/one/glacier.mp3", () => {
            loadingStatus.innerHTML = "56%";
            tundra = new Pizzicato.Sound("./sound/one/tundra.mp3", () => {
              loadingStatus.innerHTML = "70%";
              blurosti = new Pizzicato.Sound(
                { source: "file", options: { path: "./sound/two/blurosti.mp3", loop: true } },
                () => {
                  loadingStatus.innerHTML = "84%";
                  chords = new Pizzicato.Sound(
                    { source: "file", options: { path: "./sound/two/chords.mp3", loop: true } },
                    () => {
                      randomSounds[0] = new Pizzicato.Sound("./sound/random/1.mp3", () => {
                        randomSounds[1] = new Pizzicato.Sound("./sound/random/2.mp3", () => {
                          randomSounds[2] = new Pizzicato.Sound("./sound/random/3.mp3", () => {
                            randomSounds[3] = new Pizzicato.Sound("./sound/random/4.mp3", () => {
                              randomSounds[4] = new Pizzicato.Sound("./sound/random/5.mp3", () => {
                                randomSounds[5] = new Pizzicato.Sound(
                                  "./sound/random/6.mp3",
                                  () => {
                                    randomSounds[6] = new Pizzicato.Sound(
                                      "./sound/random/7.mp3",
                                      () => {
                                        randomSounds[7] = new Pizzicato.Sound(
                                          "./sound/random/8.mp3",
                                          () => {
                                            randomSounds[8] = new Pizzicato.Sound(
                                              "./sound/random/9.mp3",
                                              () => {
                                                randomSounds[9] = new Pizzicato.Sound(
                                                  "./sound/random/10.mp3",
                                                  () => {
                                                    randomSounds[10] = new Pizzicato.Sound(
                                                      "./sound/random/11.mp3",
                                                      () => {
                                                        randomSounds[11] = new Pizzicato.Sound(
                                                          "./sound/random/12.mp3",
                                                          () => {
                                                            randomSounds[12] = new Pizzicato.Sound(
                                                              "./sound/random/13.mp3",
                                                              () => {
                                                                randomSounds[13] =
                                                                  new Pizzicato.Sound(
                                                                    "./sound/random/14.mp3",
                                                                    () => {
                                                                      randomSounds[14] =
                                                                        new Pizzicato.Sound(
                                                                          "./sound/random/15.mp3",
                                                                          () => {
                                                                            bubbles =
                                                                              new Pizzicato.Sound(
                                                                                "./sound/one/bubbles.mp3",
                                                                                () => {
                                                                                  pingpong =
                                                                                    new Pizzicato.Sound(
                                                                                      "./sound/pingpong.mp3",
                                                                                      () => {
                                                                                        init();
                                                                                      }
                                                                                    );
                                                                                }
                                                                              );
                                                                          }
                                                                        );
                                                                    }
                                                                  );
                                                              }
                                                            );
                                                          }
                                                        );
                                                      }
                                                    );
                                                  }
                                                );
                                              }
                                            );
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              });
                            });
                          });
                        });
                      });
                    }
                  );
                }
              );
            });
          });
        });
      });
    }
  );
}

async function init() {
  console.log("done loading");
  loadingStatus.innerHTML = "✅";
  //start base
  base.play();
  blurosti.play();
  chords.play();
  //mute phase two bases
  blurosti.volume = 0;
  chords.volume = 0;

  //ready to accept websocket data
  readyToListen = true;

  setInterval(toggleHalf, 168000); //168000 ms is half of base track
}

function toggleHalf() {
  inLaterHalf = !inLaterHalf;
}

socket.on("server to listener", (color, a, b, c, d, e) => {
  if (readyToListen) {
    entry.volume = 1;
    entry.play();
    let rgb = hexToRgb(color);
    let maxRGB = Math.max(rgb.r, rgb.g, rgb.b);
    let minRGB = Math.min(rgb.r, rgb.g, rgb.b);
    let lum = 0.5 * (maxRGB + minRGB);
    let sat = (maxRGB - minRGB) / (1 - Math.abs(2 * lum - 1));

    let avgWhoFive = (a + b + c + d + e) / 5;
    let dA = Math.abs(a - avgWhoFive);
    let dB = Math.abs(b - avgWhoFive);
    let dC = Math.abs(c - avgWhoFive);
    let dD = Math.abs(d - avgWhoFive);
    let dE = Math.abs(e - avgWhoFive);
    let biggestDiff = Math.max(dA, dB, dC, dD, dE);
    //cello is b
    //glacier is d
    //tundra is nothing
    if (!inLaterHalf) {
      let songToPlay = cello; // CHANGE

      //a
      if (dA === biggestDiff) {
        songToPlay = bubbles;
      } else if (dB === biggestDiff) {
        songToPlay = cello;
      } else if (dC === biggestDiff) {
        songToPlay = bubbles;
      } else if (dD === biggestDiff) {
        songToPlay = glacier;
      } else {
        songToPlay = pingpong;
        playRandomNotes();
      }

      songToPlay.play();
    } else {
      if (dA === biggestDiff) {
        blurosti.volume = 1;
        chords.volume = 0;
      } else if (dB === biggestDiff) {
        blurosti.volume = 0;
        chords.volume = 1;
      } else if (dC === biggestDiff) {
        blurosti.volume = 1;
        chords.volume = 0;
      } else if (dD === biggestDiff) {
        blurosti.volume = 0;
        chords.volume = 1;
      } else {
        playRandomNotes();
      }
    }
  }
});

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function fadeIn(song) {
  if (song.volume < 1) {
    song.volume += 0.005;
    console.log(song.volume);
    id = window.requestAnimationFrame(() => {
      fadeIn(song);
    });
  } else {
    window.cancelAnimationFrame(id);
    return;
  }
}

async function playRandomNotes() {
  console.log("playing random notes");
  let numNotes = Math.round(Math.random() * 13 + 1);
  console.log("playing a total of " + numNotes + " notes");
  for (let i = 0; i < numNotes; i++) {
    let index = Math.floor(Math.random() * randomSounds.length);
    let delay = Math.random() * 1000 + 100;
    randomSounds[index].play();
    console.log("playing note " + index + " and waiting for " + delay + "ms");
    await sleep(delay);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
