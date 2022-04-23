const express = require('express');
const router = express.Router();

//Middleware to deckde the username from the jwt token
const {fetchuser} = require('../middleware/fetchuser');
//SQL QUERY functions are imported here
const {fetchNotes,addNote,updateNotes,findNoteId,deleteNotes} = require('../schemas/noteoperations');

//Route 1 to fetch all notes of the user using the auth token semt in the header . Its a get request . Returns all notes of that user. Login required 
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
  try{
    const notes = await fetchNotes(req.id);
    res.json({notes});
  }
  catch(error){
    res.status(400).json({msg:error.msg});
  }
})


//Route 2 Add a note to the database . Using POST request details (TITLE , TAG , DESCRIPTION ) are sent in body as well as auth token in header . Returns whether there was a succesfull insertion or not .

router.post('/addnote',fetchuser,async(req,res)=>{
    let note={id: req.id, ...req.body}
    try{
      const added = await addNote(note);
      res.status(added.status).json({added});
     }
    catch(error){
        res.status(error.status).json({msg:error.msg});
    }
});


//Route 3 Updating a note of the specified user. Using POST request sending update details ( title , tag, description) in request body and auth token in the req header. Uses dynamic routing to send note id

router.patch('/updatenote/:id',fetchuser,async (req,res)=>{
  try{
  const didNoteIdFound = await findNoteId(req.params.id);
  const {found , id , userid} = didNoteIdFound;
  if(!found){
    return res.status(404).json({msg:'Note not found'});
  }
  if(!id || userid!==req.id){
    return res.status(401).json({msg:'Unauthorized user'});
  }
  const resp= await updateNotes(req.body);
  res.status(200).json({msg:'Note updated'});
  }
  catch(error){
    //console.log(error);
    res.status(error.status).json({msg:error.msg});
  }
});

//Route 4 Deleting a note of the specified user. Using DELETE request ,sending the auth token in the req header. Uses dynamic routing to send noteid.

router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
  try{
    const didNoteIdFound = await findNoteId(req.params.id);
  const {found , id , userid} = didNoteIdFound;
  if(!found){
    return res.status(404).json({msg:'Note not found'});
  }
  console.log(found);
  console.log(id);
  console.log(userid);
  console.log(req.id);
  if(!id || userid!==req.id){
    return res.status(401).json({msg:'Unauthorized user'});
  } 
  const resp= await deleteNotes(req.params.id);
  res.status(200).json({msg:resp.msg});
  }
  catch(error)
  {
    res.status(error.status).json({msg:error.msg});
  }
});

module.exports=router;
