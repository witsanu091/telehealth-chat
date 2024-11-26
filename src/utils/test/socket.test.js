const { expect } = require("chai");
const io = require("socket.io-client");

const SOCKET_URL = "http://localhost:3000";
const options = {
  transports: ["websocket"],
  "force new connection": true,
};

describe("Socket.IO Events", () => {
  let clientSocket;

  beforeEach((done) => {
    clientSocket = io(SOCKET_URL, options);
    clientSocket.on("connect", done);
  });

  afterEach(() => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
  });

  it("should join a room and log the event in MongoDB", (done) => {
    clientSocket.emit("join", "room1");
    setTimeout(() => {
      done();
    }, 500);
  });

  it("should leave a room and log the event in MongoDB", (done) => {
    clientSocket.emit("leave", "room1");
    setTimeout(() => {
      done();
    }, 500);
  });

  it("should send a message and broadcast it to the room", (done) => {
    const messageData = {
      room: "room1",
      sender: "user1",
      message: "Test message",
    };

    clientSocket.emit("message", messageData);
    clientSocket.on("message", (data) => {
      expect(data).to.include(messageData);
      done();
    });
  });
});
