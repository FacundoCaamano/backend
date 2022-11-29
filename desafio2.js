const fs = require('fs')

class ProductManager{
    constructor(path){
        this.path=path
        this.format='utf-8'
    }
    
    
    getNextId= async ()=>{
        const products = await this.getProducts()
        const count =products.length
        if (count > 0) return products[count-1].id + 1
        else return 1        
    }

    addProducto = async (title,description,price,thunmbail,code,stock)=>{
        const id= await this.getNextId()
        return this.getProducts()
        .then(products =>{
            if(products.some(prod=>prod.code===code)){
                return
            } 
            products.push({id,title,description,price,thunmbail,code,stock})
            return products
        })
        .then(products => fs.promises.writeFile(this.path, JSON.stringify(products))
        )
        .catch(()=>console.log('este producto ya existe')) 
    }
    getProducts= async()=>{
        return fs.promises.readFile(this.path,this.format)
        .then(products=>JSON.parse(products))
        .catch(e =>{
            if(e)return []
        })
    }

    

    getProductById=async(id)=>{
        const products=await this.getProducts()
        const productById= await products.find(prod=> prod.id ==id)
        return productById ?? 'producto no encontrado'
    }
    
    deleteProduct= async(id)=>{
        const products=await this.getProducts()
        const filt = products.filter(prod=> prod.id !== id)
        fs.promises.writeFile(this.path,JSON.stringify(filt))
    }
    updateProduct = async (id, campo,newValue)=>{
        const products=await this.getProducts()
        const update = products.find(prod=> prod.id === id)
        if(update ===undefined) return console.log('producto no encontrado')
        if(update[campo]===undefined)return console.log('no existe el campo');

        update[campo]=newValue
        fs.writeFileSync(this.path, JSON.stringify(products))
    }
    
}



async function run(){
    const productmanager=new ProductManager('products.json')
    await productmanager.addProducto('arroz','doshermanos',500,'foto',122,15)
    await productmanager.addProducto('arroz integral','doshermanos',500,'foto',123,15)
    await productmanager.addProducto('leche','entera',500,'foto',130,15)
    await productmanager.addProducto('manteca','la anonima',500,'foto',1224,15)
    await productmanager.addProducto('dulce de leche','la anonima',500,'foto',112,15)
    await productmanager.addProducto('tallarines','molto',500,'foto',1232,15)
    //await productmanager.updateProduct(2,'title','agua')
    //await productmanager.updateProduct(2,'description','sin gas')
    //await productmanager.deleteProduct(3)
    console.log(await productmanager.getProductById(5));
    
}
run()