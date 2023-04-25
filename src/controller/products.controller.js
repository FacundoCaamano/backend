// ver funciones
import { generateProduct } from '../faker_utils.js'
import CustomError from '../services/errors/custom_errors.js'
import EnumErrors from '../services/errors/enums.js'
import { generateProductErrorInfo } from '../services/errors/info.js'
import { ProductService } from '../repositories/index.js'

export const getProducts = async (req, res) => {
  const { limit, page, query, sort } = req.query
  const products = await ProductService.get(limit, page, sort, query)
  req.io.emit('updatedProducts', products.payload)
  res.send(products)
}

export const getProductById = async (req, res) => {
  const id = req.params.pid
  const product = await ProductService.getById(id)
  res.send(product)
}

export const addProduct = async (req, res, next) => {
  try {
    const { title, description, price, thumbnails, code, stock, category, status } = req.body
    const ownerID = req.user.user.role === 'admin' ? 'admin' : req.user.user._id
    const addProduct = await ProductService.add(title, description, price, code, stock, category, status, thumbnails, ownerID)
    req.io.emit('updatedProducts', await ProductService.get())
    res.send(addProduct)
  } catch (err) {
    next(err)
  }
}

export const updateProductById = async (req, res, next) => {
  try {
    const id = req.params.pid
    const product = req.body
    const ownerID = req.user.user.role === 'admin' ? 'admin' : req.user.user._id
    const updateProduct = await ProductService.updateProductById(id, product, ownerID)
    req.io.emit('updatedProducts', await ProductService.get())
    res.send(updateProduct)
  } catch (err) {
    next(err)
  }
}

export const deleteProduct = async (req, res) => {
  const id = req.params.pid
  const ownerID = req.user.user.role === 'admin' ? 'admin' : req.user.user._id
  const deleteProduct = await ProductService.deleteById(id, ownerID)
  req.io.emit('updatedProducts', await ProductService.get())
  res.send(deleteProduct)
}

export const mockingProducts = async (req, res) => {
  const products = []
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct())
  }
  res.send({ status: 'success', payload: products })
}
