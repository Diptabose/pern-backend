//importing pool from dbConnect 
const {pool} = require('../dbConnect');

//To create hash and salt of the password and store that hash in data base.
var bcrypt = require('bcryptjs');


//Function to register an user.
const registerUser =async (userDetails) =>{
  const {name , email, password } = userDetails;
  
  //Salt creation and hashing the password.
  const salt = await bcrypt.genSalt(10);
  const hash_password = await bcrypt.hash(password, salt);
  
  try{
  const client = await pool.connect();
  await client.query('INSERT INTO USERS(name, email, password) VALUES($1,$2,$3)',[userDetails.name ,userDetails.email,hash_password]);
  const resp= await client.query('SELECT ID FROM USERS WHERE NAME =$1',[userDetails.name]);
  return {status:200 , msg:'Insertion  Successful', id:resp.rows[0].id};
  }
  catch(error)
  {
      throwError(error);
  }
  await client.release();
}


//Function to check if user is logged in 
const isUserLogged =async(logDetails)=>{
  
  try{
   const client = await pool.connect(); 
  const res= await client.query('SELECT id ,email, password from users where email=$1',[logDetails.email]);
  if(res.rowCount===1)
  {
    const {id, email, password}= res.rows[0];
    if(email===logDetails.email){
      const didPasswordMatch = await bcrypt.compare(logDetails.password , password);
      if(didPasswordMatch)
      {
        return {status:200,id};
      }
      return {status:401,msg:'Password Mismatch'};
    }
  }
  else{
    return {status:400,msg:'User not found'};
  }
  }
  catch(error)
  {
    throwError(error);
  }
  await client.release();
}


//Function to get user details 
const getuserDetails = async(id)=>{
  
  try{
    const client = await pool.connect();
    const resp= await client.query('SELECT id, name, email,date FROM USERS WHERE ID =$1 ',[id]);
   if(resp.rows.length===0){
        throw new Error('User not found');
   }
    return resp.rows[0];
  }
  catch(error){
    throwError(error);
  }
  await client.release();
}

const throwError =(error)=>{
  let err = new Error();
    console .log(error);
    let  errObj= {msg:error.message,status:400};
    err= {err ,...errObj};
    throw err;
}

module.exports={registerUser ,isUserLogged,getuserDetails};
