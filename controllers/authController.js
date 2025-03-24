const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../errors");

exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        if (username.length < 5 || username.length > 20) {
            throw new CustomError("Username must be between 5 and 20 characters", 400);
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            throw new CustomError("Username can only contain letters, numbers, underscores, and hyphens", 400);
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new CustomError("Invalid email format", 400);
        }

        if (password.length < 8) {
            throw new CustomError("Password must be at least 8 characters long", 400);
        }

        if (!/[A-Z]/.test(password)) {
            throw new CustomError("Password must contain at least one uppercase letter", 400);
        }

        if (!/[a-z]/.test(password)) {
            throw new CustomError("Password must contain at least one lowercase letter", 400);
        }

        if (!/[0-9]/.test(password)) {
            throw new CustomError("Password must contain at least one number", 400);
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            throw new CustomError("Email already registered", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({username, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1h'});

        res.json({token});
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if (!user) {
            throw new CustomError('Invalid credentials', 401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new CustomError('Invalid credentials', 401);
        }

        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1h'});

        res.json({token});
    } catch (error) {
        next(error);
    }
};
