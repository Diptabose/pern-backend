const express = require('express');
//Npm package to validate user details...
const { body, validationResult } = require('express-validator');
const router = express.Router();
const {registerUser} = require('../schemas/register');
//npm package for authorization of valid users
const jwt = require('jsonwebtoken');

router.post('/createuser',
body('name','Invalid name').isLength({ min: 5 }),
body('password','Invalid password').isLength({ min: 8 }),
body('email','Invalid Email').isEmail(),
async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
      var authToken = jwt.sign({name:req.body.name}, '12511255');
      const resp= await registerUser(req.body);
      res.json(authToken);
      
    }
    catch(error){
      const {msg, code, status} = error;
       res.status(400).json({status,msg,code});
    }
    
});
module.exports=router;
