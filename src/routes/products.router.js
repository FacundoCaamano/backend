import { Router } from 'express'

import ProductManager from '../managers/product.manager.js'

const router = Router()
const manager = new ProductManager()

router.get('/', async (req, res) => {
  const { limit, page, query, sort } = req.query
  const products = await manager.get(limit, page, sort, query)

  req.io.emit('updatedProducts', products)
  res.send(products)
})

router.post('/', async (req, res) => {
  const { title, description, price, thumbnails, code, stock, category, status } = req.body
  const addProduct = await manager.add(title, description, price, code, stock, category, status, thumbnails)
  req.io.emit('updateProducts', await manager.get())
  res.send(addProduct)
})

router.get('/:pid', async (req, res) => {
  const id = req.params.pid
  const product = await manager.getById(id)
  res.send(product)
})

router.put('/:pid', async (req, res) => {
  const id = req.params.pid
  const { title, description, price, thumbnails, code, stock, category, status } = req.body
  const updateProduct = await manager.updateById(id, title, description, price, code, stock, category, status, thumbnails)
  req.io.emit('update', await manager.get())
  res.send(updateProduct)
})

router.delete('/:pid', async (req, res) => {
  const id = req.params.pid
  const deleteProduct = await manager.deleteById(id)
  req.io.emit('update', await manager.get())
  res.send(deleteProduct)
})

router.get('/productosTR', async (req, res) => {
  const products = await manager.get()
  res.render('productosTR',
    {
      title: 'lista',
      products: products.payload
    })
})

export default router
