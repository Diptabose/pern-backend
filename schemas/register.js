const {pool} = require('../dbConnect');

//To create hash and salt of the password and store that hash in data base.
var bcrypt = require('bcryptjs');


const registerUser =async (userDetails) =>{
  const {name , email, password } = userDetails;
  
  //Salt creation and hashing the password.
  const salt = await bcrypt.genSalt(10);
  let hash_password = await bcrypt.hash(password, salt);
  
  try{
  const client = await pool.connect();
  const resp = await client.query('INSERT INTO USERS(name, email, password) VALUES($1,$2,$3)',[userDetails.name ,userDetails.email,hash_password]);
  return {status:200 , msg:'Insertion  Successful'};
  }
  catch(error)
  {
      let err = new Error();
      let  errObj= {msg:error.detail, status:400, code :Number(error.code)};
      err= {err ,...errObj};
      throw err;
  }
  await client.release();
}


module.exports={registerUser}
