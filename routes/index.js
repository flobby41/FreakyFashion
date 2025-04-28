const express = require('express')
const router = express.Router()
const db = require('../db/db')
const checkoutRouter = require('./checkout')
const prodRouter = require('./products')
const admin = require('../routes/admin')

router.use('/checkout', checkoutRouter)
router.use('/products', prodRouter)
router.use('/admin', admin)
router.use(express.urlencoded({extended : true}))
router.use(express.json())

router.get('/', (req, res, next)=>{
  const sql = `
  SELECT id, name, price, brand, picture, publicationDate, slug
  FROM products`
  db.all(sql, [], function(err, rows){
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("Internal Server Error");
    }
  res.render('index', {products: rows})
})
})

module.exports = router