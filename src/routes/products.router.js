import {Router} from 'express'

const router = Router()


import ProductManager from '../productManager.js';
const manager = new ProductManager('./productos.json');


router.get('/', async (req, res) => {
    const products = await manager.get()
    let limit = req.query.limit
    if (!limit) res.send({products})
    else {
        const prodLimit = [];
        if (limit > products.length) limit = products.length;
        for (let index = 0; index < limit; index++) {
            prodLimit.push(products[index]);
        }
        req.io.emit('update', products) 
    }
})
router.post('/', async (req, res) => {
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const addProduct = await manager.add(title, description, price, code, stock, category, status, thumbnails)
    req.io.emit('update',await manager.get())
    res.send(addProduct)
})

router.get('products/:pid', async (req, res) => {
    const id = req.params.pid
    const product = await manager.getById(id)
    res.send({product})
})


router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const {title, description, price, thumbnails, code, stock, category, status} = req.body
    const updateProduct = await manager.updateById(id, title, description, price, code, stock, category, status, thumbnails)
    req.io.emit('update', await manager.get())
    res.send(updateProduct)
})

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    const deleteProduct =  await manager.deleteById(id)
    req.io.emit('update', await manager.get())
    res.send(deleteProduct)
})
router.get('/productosTR', async (req, res) =>{
    const products = await manager.get()
    res.render('productosTR',
    {
        title: "e-commerce",
        products: products
    })

})

router.get('/home', async (req, res) =>{
    const products = await manager.get()
    res.render('home',
    {
        title: "e-commerce",
        products: products
    })
})


export default router;