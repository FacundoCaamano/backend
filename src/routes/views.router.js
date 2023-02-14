import { Router } from 'express'

import ProductManager from '../dao/manager/db/productManager.js'
import CartManager from '../dao/manager/db/cartManager.js'

const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()

router.get('/products', async (req, res) => {
  const limit = req.query.limit
  const page = req.query.page
  const query = req.query.query
  const sort = req.query.sort

  const products = await productManager.getProducts(limit, page, sort, query)
  res.render('product-pages', { products, user: req.session?.user })
  req.io.emit('updatedProducts', products)
})
router.get('/products/:pid', async (req, res) => {
  const id = req.params.pid
  const product = await productManager.getProductById(id)
  if (!product?.error) res.render('product-detail', { product, user: req.session?.user })
  else res.status(404).send(product.error)
})

router.get('/home', async (req, res) => {
  const products = await productManager.getProducts()
  res.render('home',
    {
      title: 'Lista de Productos',
      products: products.payload,
      user: req.session?.user
    })
})
router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts()
  res.render('realTimeProducts',
    {
      title: 'Lista de Productos',
      products: products.payload,
      user: req.session?.user
    })
})

router.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid
    const selCart = await cartManager.getCartById(cartId)
    res.render('cart-detail', { selCart, user: req.session?.user })
  } catch (error) {
    res.status(401).render('cart-detail', { status: 'error', error: 'Not found' })
  }
})

router.get('/login', (req, res) => {
  res.render('sessions/login')
})

router.get('/register', (req, res) => {
  res.render('sessions/register')
})

router.get('/failregister', (req, res) => {
  res.render('sessions/register', { error: 'Error al registrarse' })
})
router.get('/faillogin', (req, res) => {
  res.render('sessions/login', { error: 'Error al loguearse' })
})

export default router
