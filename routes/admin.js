const express = require('express')
const router = express.Router()

const db = require('../db/db')

router.get('/products', (req, res)=> {
res.render('admin')
})

router.get('/products/new', (req, res)=> {
res.render('new')
})

router.use(express.urlencoded({extended : true}))



module.exports = router;
