const minData = 10;
const redisKey = "stairwell";

const client = require("redis").createClient(); //database
const http = require("http").createServer(); //web server

//websocket setup
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

http.

//we do a little bit of error checking
client.on("error", (err) => console.log("Redis Client Error", err));
async function init() {
  await client.connect();

  io.on("connection", (socket) => {
    console.log("client connected");
    socket.on("form to server", (color, a, b, c, d, e) => {
      let data = { color: color, a: a, b: b, c: c, d: d, e: e };
      client.LPUSH(redisKey, JSON.stringify(data));
      console.log(data.color);
    });
  });

  http.listen(3000, () => console.log("Listening on port 3000"));
}

async function popData() {
  if ((await client.LLEN(redisKey)) > 0) {
    //grab data from database
    let data = JSON.parse(await client.RPOP(redisKey));
    //emit to clients
    io.emit(
      "server to listener",
      data.color,
      data.a,
      data.b,
      data.c,
      data.d,
      data.e
    );
    console.log("emitted data");
    //if data in database is low, re-add old data
    if ((await client.LLEN(redisKey)) < minData) {
      //client.LPUSH(redisKey, JSON.stringify(data));
    }
  } else {
    //console.log("data empty");
  }
}

init();

setInterval(popData, 3000);
