require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); // Fix typo: mongoosse -> mongoose
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

// Add this middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow requests from your React app
//   })
// );
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.get("/", (req, resp) => {
  resp.send("This is my");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
app.use("/user", require("./routes/userRoute"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));

// Connect MongoDB
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
