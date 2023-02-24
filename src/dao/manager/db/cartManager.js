import cartsModel from '../../models/carts.model.js'

class CartManager {
  get = async () => {
    try {
      const content = await cartsModel.find().lean().exec()
      return content
    } catch (error) {
      return 'Cannot reach carts'
    }
  }

  async add () {
    try {
      const newCart = await cartsModel.create({ products: [] })
      return newCart
    } catch (err) {
      return err
    }
  }

  getById = async (id) => {
    const cartById = await cartsModel.findOne({ _id: id }).lean().exec()
    return cartById || 'Cart Id not found'
  }

  addProductById = async (cartId, productId, quantity) => {
    const cart = await this.getById(cartId)
    const product = cart.products?.find(product => product.product._id == productId)
    let newCart
    if (!product) cart.products?.push({ product: productId, quantity }), newCart = await cartsModel.updateOne({ _id: cartId }, { $push: { products: { product: productId, quantity } } })
    else product.quantity += quantity, newCart = await cartsModel.updateOne({ _id: cartId, 'products.product': productId }, { $set: { 'products.$.quantity': product.quantity } })

    return { newCart, cart }
  }

  async cleanedCart (cartId) {
    await cartsModel.updateOne({ _id: cartId }, { products: [] })
    return await cartsModel.findOne({ _id: cartId })
  }

  async deleteProduct (cartId, prodId) {
    await cartsModel.updateOne({ _id: cartId }, { $pull: { products: { product: prodId } } })
    return await cartsModel.findOne({ _id: cartId })
  }

  async replaceCart (cartId, products) {
    await cartsModel.updateOne({ _id: cartId }, { products })
    return await cartsModel.findOne({ _id: cartId })
  }

  async replaceProdQuantity (cartId, prodId, quantity) {
    await cartsModel.updateOne({ _id: cartId, 'products.product': prodId }, { $set: { 'products.$.quantity': quantity } })
    return await cartsModel.findOne({ _id: cartId })
  }
}
// module.exports = ProductManager;

export default CartManager
