const fs = require('fs')

class ProductManager {
    constructor(path){
        this.path = path
        this.format = 'utf-8'
    }

     generateID = async () => {
        const data = await this.getProduct()
        const count = data.length

        if (count == 0) return 1;

        const lastProduct = data[count - 1]
        const lastID = lastProduct.id
        const nextID = lastID + 1

        return nextID
    }


    addProduct = async (title, description, price, thumbnail, stock, code) => {
        const id= await this.generateID()
        return this.getProduct()
        .then(products =>{
            if(products.some(prod=>prod.code===code)){
                return
            } 
            products.push({id,title,description,price,thumbnail,code,stock})
            return products
        })
        .then(products => fs.promises.writeFile(this.path, JSON.stringify(products))
        )
        .catch(()=>console.log('este producto ya existe')) 
}

    getProductById = async (id) => {
        const data = await this.getProduct()
        const productFound = data.find(product => product.id === id)
        return productFound || console.log(`EL PRODUCTO CON EL ID ${id} NO EXISTE.`);
    }

    getProduct = async () => {
        const product = fs.promises.readFile(this.path, this.format)
        return product
            .then(content => JSON.parse(content))
            .catch(e => {if(e) return []})
    }

    deleteProduct = async (id) => {
        const data = await this.getProduct()
        const toBeDeleted = data.find(product => product.id === id)

        if(toBeDeleted){
            const index = data.indexOf(toBeDeleted)
            data.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(data))
            console.log(`\nPRODUCTO "${id} ELIMINADO".`);
        } else {
            console.log(`\n\nERROR EL PRODUCTO CON EL ID "${id}" NO EXISTE.`);
        }
    }

    updateProduct = async (id, field, newValue) => {
        const data = await this.getProduct()
        const toBeUpdated = data.find(product => product.id === id)

        toBeUpdated[field] = newValue;
        
        await fs.promises.writeFile(this.path, JSON.stringify(data))
    }
}



async function run(){
    const manager = new ProductManager('./products.json')
    await manager.addProduct('arroz', 'dosHermano', 300, 'N/A', 15, '3123')
    await manager.addProduct('leche', 'La Serenisima', 380, 'N/A', 10, '4456')
    await manager.addProduct('harina', '000', 160, 'N/A', 15, '7869')
    await manager.addProduct('manteca', 'la serenisima', 300, 'N/A', 20, '1273')
    await manager.addProduct('fideos', 'tallarines', 200, 'N/A', 20, '4586')
    await manager.addProduct('galletitas', 'oreos', 150, 'N/A', 10, '7689')
    await manager.addProduct('gaseosa', 'Coca Cola', 460, 'N/A', 15, '67869')
    await manager.addProduct('gaseosa', 'Spray', 300, 'N/A', 20, '12573')
    await manager.addProduct('gaseosa', 'Fanta', 300, 'N/A', 20, '44586')
    await manager.addProduct('agua', 'Manaos', 150, 'N/A', 20, '76389')
    
    //await manager.updateProduct(4, "title", "PRODUCTO ACTUALIZADO")
    //await manager.deleteProduct(5);
}

run()