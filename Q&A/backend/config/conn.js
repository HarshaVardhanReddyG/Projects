import pg from "pg"
import dotenv from 'dotenv'
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config({path: __dirname+'../.env' });
const { Pool, Client } = pg
const connectionString = process.env.CONNSTR
const client = new Client({
  connectionString,
  ssl:{
    rejectUnauthorized: true
  }
})
client.connect((err)=>
{
  if(err) throw err
  else console.log('connected to database')
})

export default client;