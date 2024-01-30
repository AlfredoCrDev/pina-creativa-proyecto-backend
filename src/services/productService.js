const ProductRepository = require('../repositories/productRepository');
const utils = require("../utils")
const productRepository = new ProductRepository();

// Función para obtener todos los productos
async function getAllProducts( {limit, page, sort, status, category} ) {
  try {
    const result = await productRepository.getAllProducts( {limit, page, sort, status, category} );
    return result;
  } catch (error) {
    console.log('Error en ProductService.getAllProducts:', error);
    throw error;
  }
}

// Función para obtener los productos por nombre
async function findProductsByName(productName) {
  return productRepository.findProductsByName(productName);
}

async function getProductByCode(codeProduct) {
  return productRepository.getProductByCode(codeProduct);
}

// Función para crear un nuevo producto
async function createProduct({ title, description, price, stock, category, code, owner }) {
  try {
    const newProduct = {
      title,
      description,
      price,
      stock,
      category,
      code,
      owner
    };
    const product = productRepository.createProduct(newProduct); 
    return product
  } catch (error) {
    throw new Error(`Error in ProductService.createProduct: ${error.message}`);
  }
}

// Función para actualizar un producto
async function updateProduct(productId, productData) {
  try {
    if (productData.stock === 0) {
      productData.status = false;
    } else {
      productData.status = true;
    }
    return await productRepository.updateProduct(productId, productData)
  } catch (error) {
    throw new Error(`Error in ProductService.updateProduct: ${error.message}`);
  }
}

// Función para eliminar un producto
async function deleteProduct(productId, userEmail, userRole) {
  try {
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    // Comprobar si el usuario tiene permisos para borrar este producto
    if (userRole === 'admin' || (userRole === 'premium' && product.owner === userEmail)) {
      // El admin puede borrar cualquier producto
      // El usuario premium solo puede borrar sus propios productos
      await productRepository.deleteProduct(productId);
      return { 
        status: 'success', 
        message: 'Producto eliminado correctamente' 
      };
    } else {
      return {
        status: false,
        message: 'No puedes eliminar productos creados por el ADMIN'
      }
    }
  } catch (error) {
    // Manejar otros errores
    throw new Error(`Error en ProductService.deleteProduct: ${error.message}`);
  }
}

async function updateStock(productId, newStock){
  try {
    return await productRepository.updateStock(productId, newStock)
  } catch (error) {
    throw new Error(`Error en ProductService.updateStock: ${error.message}`);
  }
}

module.exports = {
  getAllProducts,
  findProductsByName,
  createProduct,
  getProductByCode,
  updateProduct,
  deleteProduct,
  updateStock
};
