const {pool} = require('../dbConnect');


//Function to fetch all note of user
const fetchNotes = async(id) =>{
  try{
    const client = await pool.connect();
   const resp= await client.query('SELECT ID,USERID, TITLE , TAG ,DESCRIPTION , DATE FROM NOTES WHERE USERID = $1 ',[id]);
   return resp.rows;
  }
  catch(error){
    throwError(error);
  }
  await client.release()
}

//Function to add note 
const addNote = async(note)=>{
  const {id , title , tag, description} = note;
  console.log('USERID before insertion '+id);
  try{
    const client = await pool.connect();
    const resp= await client.query('INSERT INTO NOTES(USERID , TITLE , TAG ,DESCRIPTION) VALUES ($1,$2,$3,$4)',[id, title , tag, description]);
    return {status:201,msg:'Insertion success'};
  }
  catch(error){
     throwError(error);
  }
}

//Function to find note by its id
const findNoteId= async(noteid)=>{
  try{
    const client = await pool.connect();
    const resp= await client.query('SELECT id ,userid from notes where id=$1',[noteid]);
    if(resp.rowCount===1){
      const {id , userid }= resp.rows[0];
      return {found:true, id,userid};
    }
      return {found:false};
  }
  catch(error){
    throwError(error);
  }
}

//Function to Update note by its id
const updateNotes = async(notes)=>{
  const {title, tag, description }= notes;
  try{
    const client = await pool.connect();
    const resp= await client.query('UPDATE NOTES SET title=$1 , tag=$2 , description = $3 ',[title ,tag,description]);
    return {status:200, msg:'Updation successful'};
  }
  catch(error){
   throwError(error);
  }
  await client.release();
}

//Function to delete a note by its id 
const deleteNotes = async(noteid)=>{
  try{
    const client = await pool.connect();
    const resp= await client.query('DELETE FROM NOTES WHERE ID = $1',[noteid]);
    //console.log(resp);
    return {status:201 , msg:'Note deletion sucessful'};
  }
  catch(error){
        throwError(error);
  }
  await client.release();
}

const throwError = (error)=>{
  let err = new Error();
    console .log(error);
    let  errObj= {msg:error.message, status:400, code :Number(error.code)};
    err= {err ,...errObj};
    throw err;
}

module.exports ={fetchNotes,addNote,updateNotes,findNoteId,deleteNotes};