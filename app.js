const express = require('express')
const app = express()
const userRouter = require('./routes')

app.set('view engine', 'ejs')
app.use('/', userRouter)
app.use(express.static('public'))
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.listen(3000, ()=> console.log('welcome!'))
