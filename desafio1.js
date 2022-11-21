class ProductManager{
    constructor(){
        this.products=[]
    }

    getProducts=()=>{return this.products}

    getNextId=()=>{
        const count =this.products.length

        if (count==0) return 1
        const lastProduct=this.products[count -1]
        const lastId = lastProduct.id
        const nextId=lastId + 1

        return nextId
    }

    addProduct=(title,description,price,thunmbail,code,stock)=>{
        const id = this.getNextId()
        const product={
            id,
            title,
            description,
            price,
            thunmbail,
            code,
            stock
        }

        
        if (product.title == undefined ) return console.log('campo obligatorio');
        if (product.description == undefined ) return console.log('campo obligatorio');
        if (product.price == undefined ) return console.log('campo obligatorio');
        if (product.thunmbail == undefined ) return console.log('campo obligatorio');
        if (product.stock == undefined ) return console.log('campo obligatorios');

        const codigo=this.products.find(product => product.code==code)
        
        if( codigo==undefined) return this.products.push(product)
        
        else console.log('error el codigo se repite'); 
        
    }
    getProductById=(id)=>{
        const productFound=this.products.find(product => product.id===id)
        return productFound || console.log('not found');
    }


}

const productomanage=new ProductManager()


console.log(productomanage.products)//trae el array vacio

productomanage.addProduct('pan','harina',300,'foto','12255',12)//se pushea con exito
productomanage.addProduct('manteca','lacteo',400,'foto','13255')//falta un campo
productomanage.addProduct('leche','descremada',350,'foto','1242',22)//se pushea con exito
productomanage.addProduct('leche','descremada',350,'foto','1242',22)//error se repite el codigo
productomanage.addProduct('leche','entera',300,'foto',"1233332",33)//se pushea con exito

console.log(productomanage.products)//trae el array con los pusheo 






console.log(productomanage.getProductById(1));//trae el primer producto del array
console.log(productomanage.getProductById(10));//not found 


