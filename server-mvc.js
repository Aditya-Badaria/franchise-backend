require("dotenv").config();

const express = require("express");
const fileuploader = require("express-fileupload");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 2004;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());

// console.log("USING MONGO URI:", process.env.MONGO_URI);

// 🔥 CONNECT FIRST, THEN START SERVER
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4   // 🔥 FORCE IPv4
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
  });
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});





// Define the Application model
// const applicationSchema = new mongoose.Schema({}, { strict: false });
// const Application = mongoose.model('Application', applicationSchema, 'applications');


// ✅ Fetch all applications
app.get("/applications", async (req, res) => {
    try {
        const applications = await Application.find(); // Fetch all documents
        res.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});

app.delete("/applications/:id", async (req, res) => {
    try {
        const deletedApp = await Application.findByIdAndDelete(req.params.id);
        if (!deletedApp) {
            return res.status(404).json({ status: false, msg: "Application not found" });
        }
        res.json({ status: true, msg: "Application deleted successfully!" });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ status: false, msg: "Failed to delete application" });
    }
});

var userRouter=require("./routers/userRouter");
app.use("/user",userRouter);

var adminRouter=require("./routers/adminRouter");
app.use("/admin",adminRouter)

const dailySalesRouter = require('./routers/dailySalesRouter');
app.use('/api/dailysales', dailySalesRouter);


// const authRoutes = require("./routes/auth");     
// app.use("/api/auth", authRoutes);