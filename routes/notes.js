const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  
  let obj= {
    name:'Bose',
    email:'diptabose484@gmail.com',
  }
  res.json(obj);
})

module.exports=router;

