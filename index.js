const cors = require('cors');
const express = require('express');
const {pool}= require('./dbConnect');

const app= express();
const PORT= process.env.PORT||5000;

//Allows cross origin requests..
app.use(cors({
  origin: '*'
}));
//Allows to get body in the request
app.use(express.json());


app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));


app.listen(PORT , ()=>{
  console.log(`Server listening at port ${PORT}`);
})
