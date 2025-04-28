// ladda moduler vi behöver

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// sort le absolute link to database

const dbFilePath = path.resolve(process.cwd(), './db/FreakyFashion.db')

// creer db object - on utilise ca pour communiquer avec la database

const db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, (err)=>{
  if(err){ return console.error(err.message)}
})

// exportera

module.exports = db