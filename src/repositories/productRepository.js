const productModel = require('../models/products.model');

class ProductRepository {
  // Función para buscar todos los productos
  async getAllProducts( {limit, page, sort, status, category} ) {
    try {
        const queryOptions = {};
  
        if (limit) {
          queryOptions.limit = parseInt(limit);
        } else {
          queryOptions.limit = 50;
        }
  
        if (page){
          queryOptions.page = parseInt(page);
        } else {
          queryOptions.page = 1;
        }

        if (sort) {
          queryOptions.sort = sort === 'asc' ? 'price' : '-price';
        }
  
        const filter = {};
  
        if (category) {
          filter.category = category;
        } else if (status === 'true') {
          filter.status = true;
        } else if (status === 'false') {
          filter.status = false;
        }
  
        const result = await productModel.paginate(filter, queryOptions);
        const leanProducts = result.docs.map((product) => product.toObject());
        result.docs = leanProducts
        return result;  
    } catch (error) {
      throw new Error(`Error en ProductRepository.getAllProducts: ${error.message}`);
    }
  }

  // Función para buscar productos por nombre
async findProductsByName(productName) {
  try {
    const products = await productModel.find({ title: { $regex: productName, $options: "i" } });
    return products;
  } catch (error) {
    throw new Error(`Error in findProductsByName: ${error.message}`);
  }
}

  async getProductByCode(codeProduct) {
    try {
      const product = await productModel.findOne({code: codeProduct});
      return product || null
    } catch (error) {
      throw new Error(`Error en ProductRepository.getProductByCode: ${error.message}`);
    }
  }

  async getProductById(productId) {
    try {
      const product = await productModel.findOne({_id: productId});
      return product || null
    } catch (error) {
      throw new Error(`Error en ProductRepository.getProductById: ${error.message}`);
    }
  }


  async createProduct(productData) {
    try {
      const newProduct = new productModel(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error(`Error en ProductRepository.createProduct: ${error.message}`);
    }
  }

  async updateProduct(productId, productData) {
    try {
      const updateData = await productModel.updateOne({_id: productId}, productData);
      if (updateData.modifiedCount > 0) {
        return {
          success: true,
          message: "Producto modificado correctamente",
        };
      } else {
        return {
          success: false,
          message: `No se encontró un producto con el ID: ${productId}`,
        };
      }
    } catch (error) {
      throw new Error(`Error en ProductRepository.updateProduct: ${error.message}`);
    }
  }

  async updateStock(productId, newStock) {
    try {

      const existingProduct = await productModel.findOne({_id: productId});

    if (!existingProduct) {
      return {
        success: false,
        message: `No se encontró un producto con el ID: ${productId}`,
      };
    }

    // Guardar la actualización en la base de datos
    const updateData = await productModel.updateOne(
      { _id: existingProduct._id },
      { $set: { stock: newStock.stock } }
    );

    return {
      success: true,
      message: "Producto modificado correctamente",
      updatedProduct: updateData, // Puedes devolver el producto actualizado si es necesario
    };
    } catch (error) {
      throw new Error(`Error en ProductRepository.updateStock: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    try {
      const productToDelete = await productModel.findOne({_id: productId});
      
      if (!productToDelete) {
        // Producto no encontrado
      throw new Error("Producto no encontrado.");
    }
    
    const result = await productModel.deleteOne({ _id: productId });
    return result
    } catch (error) {
      console.error(error);
      throw new Error(`Error en ProductRepository.deleteProduct: ${error.message}`);
    }
  }
}

module.exports = ProductRepository;
