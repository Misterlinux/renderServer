const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3020;

//const cookieParser = require('cookie-parser');
//app.use(cookieParser());

//user session data in the server
/*const session = require('express-session');*/

const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000", 
  methods: [`DELETE`,  `PUT`, `POST`],
  allowedHeaders: ["Content-Type"],
  credentials: true
};

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if ('OPTIONS' == req.method) {
      res.sendStatus(200);
  } else {
    next();
  }
});


//app.use( cors(corsOptions) )

app.use(express.json())

//  mini.dpg-cun1gphu0jms73b9u8pg-a.frankfurt-postgres.render.com

//postgresql://mini:KG1MnQCzJTxN19xi7fNxPfYwl8mMw6f4
// @
// dpg-cun1gphu0jms73b9u8pg-a.frankfurt-postgres.render.com
// /renderserver_jjqh

//We install the postSQL client pg
const { Pool } = require("pg");
//dpg-cun1gphu0jms73b9u8pg-a
const connectionString = 
  `postgres://mini:${process.env.DATABASE_PASSWORD}@dpg-cun1gphu0jms73b9u8pg-a/renderserver_jjqh`;


const pool = new Pool({
  connectionString,
});

//let HOST = process.env.HOST

/*
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mrlzarate",
  port: 5432,
});
*/

app.post("/hotels", function(req, res) {
  console.log( "manda -->", req.body )
  let {primo , secondo } = req.body

  console.log("Datte", primo, secondo ) 
  //${primo}, ${Number(secondo)}
  pool.query(`INSERT into multi (name, employed, age) VALUES ( 'primgles' , true, 199 ) ` , 
    (error, result) => {
      console.log( result )
      res.json(result.rowCount);
    }
  );
});

app.get("/fila", (req, res)=>{
  let nomefila = req.query.name
  let query;

  if( nomefila ){
     query = `select * from multi where nome like '%${nomefila}%' order by id;`
  }

  console.log( "resulted query->", nomefila )
})

app.get("/remova/:index", async (req, res)=>{
  let index = Number( req.params.index )
  console.log( index )

    try {
      await pool.query(`delete from multi where age= ${index}`);
      const result = await pool.query(`select * from multi`);
      console.log(result.rows);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' }); // Handle errors!
    }
    
})


// ---------------------

app.get("/", (req, res)=> {
  console.log( PORT )

  res.send( `postgres://mini:${process.env.DATABASE_PASSWORD}@dpg-cun1gphu0jms73b9u8pg-a/renderserver_jjqh` )
})

app.get(`/metro`, (req, res)=> {
  console.log( "metro balling" )

  res.send("make it boom")
})

app.get(`/vedo`, (req, res)=> {

  pool
    .query(`SELECT * from users`)
    .then((risultato) => {
      if(risultato.rows.length){
        console.log( risultato.rows )

        res.send( risultato.rows )
      }
    })

})

app.post('/aggiungi', async (req, res) => {
  let {nomen, cognomen, pass, logged} = req.body
  let query = "INSERT INTO users (username, email, password, loggedin) VALUES ($1, $2, $3, $4)"

  try {
    const resultado = await pool.query(query, [nomen, cognomen, pass, logged])

    if (resultado) {
      res.status(202).send(resultado)
    } else {
      res.status(404).send(resultado)
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
});

app.post(`/togli`, async (req, res)=>{

  let {elimina, passa} = req.body
  console.log( passa )

  let query = "DELETE from users WHERE username = $1 AND password = $2"

  try {
    const result = await pool.query(query, [elimina, passa])
 
    if(result.rowCount){
      res.status(202).send( result )
    }else{
      res.status(404).send( result )
    }
  } catch(error){
    console.log( error )
    res.status(500).send("Not more data")
  }
})

//listen() sets the localhost: endpoint 
app.listen(PORT, () => console.log(`Server is up and running ${PORT}`))