// const express = require('express');
import express from 'express'
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<h1 style="color:red">LISTA DE USUARIOS NO DESEADOS</h1>');
});

// module.exports = router;
export default router;