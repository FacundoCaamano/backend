import ProductDTO from '../dao/DTO/products.dto.js'
import CustomError from '../services/errors/custom_errors.js'
import { generateProductErrorInfo, generateCodeErrorInfo } from '../services/errors/info.js'
import EnumErrors from '../services/errors/enums.js'
class ProductRepository {
  constructor (dao) {
    this.dao = dao
  }

  get = async (limit = '', page = '', sort = '', query = '') => {
    try {
      const querySearch = query ? (query === 'disponible' ? { stock: { $gt: 0 } } : { category: { $regex: query, $options: 'i' } }) : {}
      const sortChoosen = sort ? (sort === 'asc' ? { price: 1 } : (sort === 'desc' ? { price: -1 } : {})) : {}
      const content = await this.dao.get(querySearch, limit, page, sortChoosen)
      const prevLink = content.hasPrevPage ? (`/views/products?${'page=' + content.prevPage}${limit && '&limit=' + limit}${sort && '&sort=' + sort}${query && '&query=' + query}`) : null
      const nextLink = content.hasNextPage ? (`/views/products?${'page=' + content.nextPage}${limit && '&limit=' + limit}${sort && '&sort=' + sort}${query && '&query=' + query}`) : null
      return {
        status: 'success',
        payload: content.docs,
        totalPages: content.totalPages,
        prevPage: content.prevPage,
        nextPage: content.nextPage,
        page: content.page,
        hasPrevPage: content.hasPrevPage,
        hasNextPage: content.hasNextPage,
        prevLink,
        nextLink
      }
    } catch (err) {
      console.log(err)
      return { status: 'error', message: "Can't reach products" }
    }
  }

  async add (title, description, price, code, stock, category, status = true, thumbnails = [], ownerId = 'admin') {
    const newProduct = this.#newProduct(title, description, price, code, stock, category, status, thumbnails, ownerId)
    console.log(newProduct)
    const productToInsert = new ProductDTO(newProduct)
    const errors = await this.#errorCheck(productToInsert, 'add', false)
    return errors.length === 0 ? (await this.dao.create(productToInsert), productToInsert) : { error: errors }
  }

  getById = async (id) => {
    try {
      const product = await this.dao.getOne(id)
      if (product) return product

      else return { status: 'error', error: 'Product ID not found' }
    } catch (error) {
      return { status: 'error', error: 'Incorrect Id' }
    }
  }

  updateProductById = async (id, product, userId) => {
    if (typeof (id) !== 'object' && id.length !== 24) return (console.log('ID must be 24 characters'), { error: 'ID must be 24 characters' })
    const errors = await this.#errorCheck(product, 'update', id)
    const originalProduct = await this.dao.getOne(id)
    if (!originalProduct) errors.push('Product Id not found')
    if ((originalProduct.owner !== userId) && (userId !== 'admin')) errors.push('Product Owner not match')
    const updatedProduct = await this.dao.update(id, product)
    const newProduct = await this.getProductById(id)
    return errors.length === 0 ? (updatedProduct, newProduct) : errors
  }

  deleteById = async (id, userId) => {
    if (id.length === 24) {
      const productToDelete = await this.dao.getOne(id)
      if (!productToDelete) return { error: 'Product Id not found' }
      console.log(userId)
      if ((productToDelete.owner !== userId) && (userId !== 'admin')) return { error: 'Product Owner not match' }
      if (productToDelete) return (productToDelete, await this.dao.delete(id), { message: 'Success' })
      else return { error: 'No product to delete found' }
    } else {
      return { error: 'ID must be 24 characters' }
    }
  }

  #newProduct (title, description, price, code, stock, category, status, thumbnails, owner) {
    const newProduct = {
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      category,
      status,
      owner
    }
    return newProduct
  }

  async #errorCheck (newProduct, operation, id) {
    const errors = new Array()
    if (operation === 'add') {
      /* if(await this.dao.getOther({code:newProduct.code}) ) errors.push(`Code "${newProduct.code}" already exists`) */
      if (await this.dao.getOther({ code: newProduct.code })) {
        errors.push(`Code "${newProduct.code}" already exists`)
        CustomError.createError({
          name: `Code "${newProduct.code}" already exists`,
          cause: generateCodeErrorInfo(newProduct),
          message: 'Error trying to create product',
          code: EnumErrors.DATABASES_ERROR
        })
      }
    }
    if (operation === 'update') {
      /* if (newProduct.code) if (await this.dao.getOther({code:newProduct.code, _id: {$ne: id}}) ) errors.push(`Code "${newProduct.code}" already exists`) */
      if (newProduct.code) {
        if (await this.dao.getOther({ code: newProduct.code, _id: { $ne: id } })) {
          errors.push(`Code "${newProduct.code}" already exists`)
          CustomError.createError({
            name: `Code "${newProduct.code}" already exists`,
            cause: generateCodeErrorInfo(newProduct),
            message: 'Error trying to create product',
            code: EnumErrors.DATABASES_ERROR
          })
        }
      }
    }
    /* if (Object.values(newProduct).includes("")) errors.push('There are empty fields.') */
    if (Object.values(newProduct).includes('')) {
      errors.push('There are empty fields.')
      CustomError.createError({
        name: 'Product creation error',
        cause: generateProductErrorInfo(newProduct),
        message: 'Error trying to create product',
        code: EnumErrors.INVALID_TYPES_ERROR
      })
    }
    return errors
  }
}

export default ProductRepository
