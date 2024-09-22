const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const auth = require('../middlewares/auth')

// Login
router.post('/login', async (req, res) => {
    try{
        const{email, password, usertype} = req.body;
        let token = req.headers.authorization;
        if (email && password) {
            //Login with credentials
            const result = await UserService.login_with_cred(email, password, usertype);
            if(result.success){
                res.setHeader('Authorization', `Bearer ${result.token}`);
                res.status(200).json({token : result.token});
            }
            else{
                res.status(401).json({message: result.message});
            }
        }
        else if(token){
            //Login with token
            console.log(token)
            const result = await UserService.login_with_token(token.slice(7));
            if(result.success){
                res.status(200).json({user: result.user});
            }
            else{
                res.status(401).json({message: result.message});
            }
        }
        else{
            res.status(400).json({message: "Invalid request"});
        }
    }
    catch(error){
        console.error('Error in login controller:', error);
        res.status(500).json({message: "Server error" });
    }
});


//Signup
router.post('/signup', async (req, res) => {
    try{
        const{username, email, password, phone_number, country_code, usertype} = req.body;
        console.log(req.body)
         
        const result = await UserService.save_to_DB(username, email, password, phone_number, country_code, usertype);
        if(result.success){
            res.status(201).json({message: result.message });
        }
        else{
            res.status(400).json({message: result.message });
        }
    }
    catch(error){
        console.error('Error in signup controller:', error);
        res.status(500).json({message: "Server error" });
    }
});


//Edit profile
router.put('/profile/:user_id', async (req, res) => {
    try{
        const{user_id} = req.params;
        const newData = req.body;
        const result = await UserService.edit_profile(user_id, newData);
        if(result.success){
            res.json({success: true, message: result.message});
        }
        else{
            res.status(404).json({message: result.message});
        }
    }
    catch(error){
        console.error('Error in edit_profile controller:', error);
        res.status(500).json({success: false, message: "Server error"});
    }
});

// module.exports = router;

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if the user with the provided email exists
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Generate a random verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
      // Save the verification code to the user document
    //   user.otp = verificationCode;
      const user2 = await User.update({otp: verificationCode},{where:{email: email }});
      console.log(user2)
      // Send the verification code via email
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'cs21btech11017@iith.ac.in',
          pass: 'vpbp dzks proz jnoi',
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Your verification code is: ${verificationCode}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Error sending verification code' });
        }
        console.log('Email sent:', info.response);
        return res.status(200).json({ message: 'Verification code sent successfully' });
      });
    } catch (error) {
      console.error('Error sending verification code:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });
  

// Route: POST /verify-code
// Description: Verify the verification code sent via email
router.post('/verify-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user,email)
    // Check if the provided verification code matches the code in the user document
    console.log(user.otp, code)
    if (parseInt(user.otp) !== parseInt(code)) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    return res.status(200).json({ message: 'Verification code verified successfully' });
  } catch (error) {
    console.error('Error verifying verification code:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ where: { email: email } });
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.update({otp: null, password: hashedPassword},{where:{email: email }});
    

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


router.get("/profile" , auth , async(req,res) =>{
     try{
         const user_id = req.user_id;
         console.log(user_id)
         const user = await User.findOne({ where: { user_id : user_id } });
         //console.log(user)
         if (!user) {
            console.log('Not found')
           return res.status(404).json({ error: 'User not found' });
         }

         return res.status(200).json({message : "User present" , user: user});
     }
     catch(error){
      console.log('Error getting password' , error);
      return res.status(500).json({ error: 'Server error' });
     }
})

module.exports = router;
