const express = require('express');
const router = express.Router();
const { userRegister, userLogin, userAuth, checkRole } = require('../utils/Auth');


// * register 

// register admin route
router.post('/register-admin', async (req, res) => {
    await userRegister(req.body, 'admin', res)
});


// register student route
router.post('/register-student', async (req, res) => await userRegister(req.body, 'student', res));


// register instructor route
router.post('/register-instructor', async (req, res) => await userRegister(req.body, 'instructor', res));


// * login 

// login admin route
router.post('/login-admin', async (req, res) => await userLogin(req.body, 'admin', res));


// login student route
router.post('/login-student', async (req, res) => await userLogin(req.body, 'student', res));


// login instructor route
router.post('/login-instructor', async (req, res) => await userLogin(req.body, 'instructor', res));



// * profile 

router.get('/profile', userAuth, async (req, res) => {
    res.json(req.user);
});


// profile protected admin route
router.get('/admin-profile', userAuth, checkRole(['admin']), async (req, res) => {
    res.json('hi aadmin');
});


// profile protected student route
router.get('/student-profile', userAuth, checkRole(['student']), async (req, res) => {
    res.json('hi student');
});


// profile protected instructor route
router.get('/instructor-profile', userAuth, checkRole(['instructor']), async (req, res) => {
    res.json('hi instructor');
});



// common route for instructor and admin only
router.get('/instructor-admin', userAuth, checkRole(['instructor', 'admin']), async (req, res) => {
    res.json('instructor-admin');
});


module.exports = router;