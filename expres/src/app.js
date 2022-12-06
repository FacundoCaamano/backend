const express = require('express')
const format = "utf-8"
const fs = require('fs')
const path = "../../fileSystem/products.json"
const products = fs.readFileSync(path, format)
const parsProducts = JSON.parse(products)

const app = express()

app.get('/products', (req, response) => {
    const limit = req.query.limit
    
    if(limit){
        response.send(parsProducts.slice(0,limit))
    }else{
        response.send(parsProducts)
    }
})
app.get('/products/:pid', (req, response) => {

    const productID = req.params.pid 
    const product = parsProducts.find(product => product.id == productID)
    if(!product) response.send(`<h2>Error: El producto no existe.</h2>`)
    else response.send(product)
})

app.listen(8080)