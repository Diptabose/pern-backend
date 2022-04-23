const jwt = require('jsonwebtoken');

const fetchuser= (req,res,next)=>{
  const token = req.header('auth-token');
  if(!token){
    res.status(401).json({msg:'Cant fetch user details'});
  }
  try{
    const data = jwt.verify(token,'12511255');
   // console.log(data);
    req.id= data.id;
  }
  catch(error)
  {
    res.status(401).json({msg:'Cant fetch user details'});
  }
  next();
};

module.exports={fetchuser};

