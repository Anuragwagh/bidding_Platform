const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
    console.log("New client connected");
  
    socket.on("bid", async (data) => {
      try {
        const bid = await Bid.create({
          item_id: data.item_id,
          user_id: data.user_id,
          bid_amount: data.bid_amount,
        });
        io.emit("update", bid);
      } catch (e) {
        console.error(e.message);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  