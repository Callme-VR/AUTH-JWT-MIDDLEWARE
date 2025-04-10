import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const JWT_SECRET = "Vishal@123"; // Keep this secret safe in production

app.use(express.json());

const users = [];

// Signup route
app.post("/signup", (req, res) => {
    const {
        username,
        password
    } = req.body;

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    users.push({
        username,
        password
    });
    res.json({
        message: "You are signed up"
    });
});

// Signin route
app.post("/signin", (req, res) => {
    const {
        username,
        password
    } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({
            message: "User not found or invalid credentials"
        });
    }

    const token = jwt.sign({
        username
    }, JWT_SECRET, {
        expiresIn: "5d"
    });
    res.json({
        token
    });
});

// Logout route (simulation)
app.get("/logout", (req, res) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(400).json({
            message: "Token missing"
        });
    }

    try {
        const decodedData = jwt.verify(token, JWT_SECRET); // safer than decode()

        const foundUser = users.find(user => user.username === decodedData.username);

        if (!foundUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: `${foundUser.username} is logged out (token should be discarded client-side)`
        });

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
});

// Start the server
app.listen(3001, () => {
    console.log("✅ Server is listening on port 3001");
});