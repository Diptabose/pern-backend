const express = require('express');
//Npm package to validate user details...
const { body, validationResult } = require('express-validator');
const router = express.Router();
const {registerUser,isUserLogged,getuserDetails} = require('../schemas/register');
//npm package for authorization of valid users
const jwt = require('jsonwebtoken');

const {fetchuser} = require('../middleware/fetchuser');



//Route 1 to create a user from the credentials (name , email, password) passed , No login required . Also returns a JWT token . POST request
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
      const resp= await registerUser(req.body);
      var authToken = jwt.sign({id:resp.id}, '12511255');
      res.json(authToken);
    }
    catch(error){
      const {msg, code, status} = error;
       res.status(400).json({msg,code ,error});
    }
});


//Route 2 Logging in an user with correct credentials (email and password) , also returning a JWT Token to user. POST request
router.post('/login',
body('password','Invalid password').isLength({ min: 8 }),
body('email','Invalid Email').isEmail(),
async (req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const resp= await isUserLogged(req.body);
    if(resp.status===200){
     // console.log('ID at login '+ resp.id);
    var authToken = jwt.sign({id:resp.id}, '12511255');
    //console.log('JWT TOKEN AT LOGIN '+authToken);
    res.json(authToken);
    }
    else{
      return res.status(resp.status).json({msg:resp.msg});
    }
  }
  catch(error)
  {
    console.log(error);
    return res.status(400).json({msg:error.msg});
  }
});


//Route 3 Fetching user details , with the JWT Token passed into the header of the request as auth-token.POST request
router.post('/getuser',fetchuser,async (req,res)=>{
     try{
       
       const userDetails = await getuserDetails(req.id);
       const {id, name , email,date} = userDetails;
       return res.status(200).json({id,name,email,date});
     }
     catch(error){
       res.status(400).json({msg:error.msg});
     }
});

module.exports=router;
