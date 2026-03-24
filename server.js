const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 3000, () => {
        console.log("Server running");
    });
})
.catch(err => {
    console.error("MongoDB Error:", err);
});

// Model
const Student = require("./models/Student");

// Add Student
app.post("/add", async (req, res) => {
    try {
        const { name, age } = req.body;

        if (!name || !age) {
            return res.status(400).json({ error: "Missing data" });
        }

        const student = new Student({ name, age });
        await student.save();

        res.json({ message: "Student Added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get Students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});