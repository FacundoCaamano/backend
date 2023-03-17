import CartMongo from '../dao/db/cart.mongo.js'
import CartFs from '../dao/fs/cartmanager.js'

class CartManager {
  constructor () {
    this.dao = new CartMongo()
  }

  get = async () => {
    try {
      const content = await this.dao.get()
      return content
    } catch (error) {
      return 'Manager - Cannot reach carts'
    }
  }

  add = async () => {
    try {
      const newCart = await this.dao.create()
      return newCart
    } catch (err) {
      return 'Manager - Cannot create cart'
    }
  }

  getById = async (id) => {
    const cartById = await this.dao.get(id)
    return cartById || 'Manager - Cart Id not found'
  }

  addProductById = async (cartId, productId, quantity) => {
    const cart = await this.getById(cartId)
    const product = cart.products?.find(product => product.product._id == productId)
    let newCart
    if (!product) cart.products?.push({ product: productId, quantity }), newCart = await this.dao.update(cartId, productId, quantity, false)
    else product.quantity += quantity, newCart = await this.dao.update(cartId, productId, product.quantity, true)

    return { newCart, cart }
  }

  async cleanedCart (cartId) {
    await this.dao.clean(cartId)
    return await this.getById(cartId)
  }

  async deleteProduct (cartId, prodId) {
    await this.dao.delete(cartId, prodId)
    return await this.getById(cartId)
  }

  async replaceCart (cartId, products) {
    await this.dao.replace(cartId, products)
    return await this.getById(cartId)
  }

  async replaceProdQuantity (cartId, prodId, quantity) {
    await this.dao.update(cartId, prodId, quantity, true)
    return await this.getById(cartId)
  }
}
// module.exports = ProductManager;

export default CartManager
