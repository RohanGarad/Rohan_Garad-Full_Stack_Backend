const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const connectDB = require("./config/db");
const matchRoutes = require("./routes/matchRoutes");
const cors = require("cors");

const app = express();
const server = http.createServer(app); 
// Use CLIENT_URL from .env or default to localhost for local development
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

// Enable CORS
app.use(cors({
  origin: allowedOrigin, // Use the dynamic value
  methods: ['GET', 'POST'], // Allowed methods
  credentials: true, // Allow credentials
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigin, // Use the dynamic value
    methods: ['GET', 'POST'], // Allowed methods
    credentials: true, // Allow credentials
  },
});

app.get('/', (req, res) => {
  res.send('Welcome to the CrickScore backend server. For UserView goto:http://localhost:5173/ and for AdminView goto:http://localhost:5173/admin');
});

// Connecting to MongoDB....
connectDB();

// Middleware for JSON parsing
app.use(express.json());

app.use("/api", matchRoutes);

// Socket.io connection event
io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit score updates to all connected clients
  socket.on("score_updated", (updatedScore) => {
    io.emit("score_updated", updatedScore);
  });

  // disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));