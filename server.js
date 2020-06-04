'use strict'

const express = require('express')

function devServer() {
  try {
    const app = express()
    const port = process.env.PORT || 3000
    app.use('/assets', express.static(__dirname + '/assets'))
    app.use('/img', express.static(__dirname + '/img'))
    app.use(express.static(__dirname + '/'))
    app.listen(port)

    console.log(`Open: http://localhost:${port}/`)
  } catch (e) {
    console.error(e)
  }
}
devServer()
