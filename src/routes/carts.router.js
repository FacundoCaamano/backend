import { Router } from 'express'
import { addCart, addProductById, cleanCart, deleteProductFromCart, getCartById, getCarts, replaceCart, replaceProductQuantity, purchaseCart } from '../controller/carts.controller.js'
import { passportCall, authorization } from '../passport_custom.js'

const router = Router()

router.post('/', addCart)

router.get('/:cid', getCartById)

router.get('/', getCarts)

router.post('/:cid/products/:pid', passportCall('current', { session: false, failureRedirect: '/views/login' }), authorization(['USER', 'ADMIN', 'PREMIUM']), addProductById)

router.post('/:cid/purchase', passportCall('current', { session: false, failureRedirect: '/views/login' }), authorization(['USER', 'ADMIN', 'PREMIUM']), purchaseCart)

router.delete('/:cid', cleanCart)

router.delete('/:cid/products/:pid', deleteProductFromCart)

router.put('/:cid', replaceCart)

router.put('/:cid/products/:pid', replaceProductQuantity)

export default router
