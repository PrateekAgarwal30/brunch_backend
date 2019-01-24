const express = require('express');
const app = express();
const auth = require('./middleware/auth');
require('./start_up/db')();
app.use(express.json());
app.get('/',auth,(req,res)=>{
    res.status(200).send("Connected Successfully");
});

const port = process.env.port||3500;

app.listen(port,()=>{
    console.log(`Listening at Port : ${port}`);
})