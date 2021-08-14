const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const { SECRET } = require('../config/index');


/**
 * @description register the user (admin, instructor, student)
 */
const userRegister = async (user, role, res) => {
    // validate username
    let usernameTaken = await validateUsername(user.username);
    if (!usernameTaken) {
        return res.status(400).json({
            message: "username already taken",
            success: false
        });
    }

    // validate email
    let emailRegistered = await validateEmail(user.email);
    if (!emailRegistered) {
        return res.status(400).json({
            message: "email already registered",
            success: false
        });
    }


    // hash password
    let hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = new User({
        ...user,
        role,
        password: hashedPassword
    });


    try {

        await newUser.save();
        return res.status(201).json({
            message: "register completed",
            success: true
        });

    } catch (error) {

        return res.status(201).json({
            message: "server error",
            success: false
        });

    }
};



/**
 * @description login the user (admin, instructor, student)
 */
const userLogin = async (userReqBody, role, res) => {
    let { username, password } = userReqBody;

    if (!username || !password) {
        return res.status(400).json({
            message: "Please fill all fields",
            success: false
        });
    }


    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "username not found",
            success: false
        });
    }


    // check role
    if (user.role !== role) {
        return res.status(403).json({
            message: `please login from youer correct portal, you are not ${role}`,
            success: false
        });
    }


    // user exsist and role correct
    // compare password
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(403).json({
            message: `incorrect password`,
            success: false
        });
    }

    let token = jwt.sign({
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
    }, SECRET, { expiresIn: "7 days" }
    );

    let result = {
        role: user.role,
        username: user.username,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: 168
    }

    return res.status(200).json({
        ...result,
        message: "logged in successfuly",
        success: true
    })
};



/**
 * @description Passport middleware
*/
const userAuth = passport.authenticate("jwt", { session: false })



/**
 * @description check role middleware
*/
const checkRole = (roles) => (req, res, next) => !roles.includes(req.user.role)
    ? res.status(401).json({ message: "Unathorized", success: false })
    : next();


const validateUsername = async (username) => {
    let user = await User.findOne({ username });
    return user ? false : true;
};


const validateEmail = async (email) => {
    let user = await User.findOne({ email });
    return user ? false : true;
};


module.exports = { userRegister, userLogin, userAuth, checkRole }