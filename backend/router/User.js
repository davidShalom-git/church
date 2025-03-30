const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require('../models/User')
require('dotenv').config()

router.post('/signup', async (req, res) => {
    const { Name, Email, Password, role } = req.body;

    if (!Name || !Email || !Password) {
        return res.status(400).json({ message: "All Fields are Required" });
    }

    try {
        const hashPassword = await bcrypt.hash(Password, 10);
        const newUser = await user.create({
            Name,
            Email,
            Password: hashPassword,
            role: role || 'user', // Default to 'user' if no role is provided
        });
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(201).json({ message: "User Created Successfully", userId: newUser._id, token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});



router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;
    console.log("Req Body: ", req.body);

    if (!Email || !Password) {
        console.log("Missing Fields are Required");
        return res.status(400).json({ message: "All Fields are Required" });
    }

    try {
        const foundUser = await user.findOne({ Email });
        if (!foundUser) {
            return res.status(401).json({ message: "User Not Found" });
        }
        console.log('foundUser', foundUser);

        const isMatch = await bcrypt.compare(Password, foundUser.Password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password doesn't Match" });
        }
        const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Logged Successfully", token });
    } catch (error) {
        console.log('Error during login:', error);
        res.status(401).json({ message: error.message });
    }
});

router.post('/logout',(req,res)=> {
    res.status(200).json({message: "Logout Successfully"})
})

module.exports = router;