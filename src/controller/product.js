const { v4: uuidv4 } = require('uuid');
const productModel = require('../models/product')
const createError = require('http-errors')
const commonHelper = require('../helper/common');
const client = require('../config/redis')

const productController = {
  getPaginationProduct: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const search = req.query.search;
      let querysearch = '';
      if (search === undefined) {
        querysearch = ``;
      } else {
        querysearch = ` where name  like '%${search.toLowerCase()}%' `;
      }
      const sortby = req.query.sortby || ('created_on');
      const sort = req.query.sort || 'asc';
      const result = await productModel.selectPagination({ limit, offset, sortby, sort, querysearch });
      const totalData = parseInt((await productModel.selectAll()).rowCount);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage

      }
      commonHelper.response(res, result.rows, 200, null, pagination);
    } catch (error) {
      res.send(createError(404));
    }
  },
  getProduct: async (req, res) => {
    try {
      const id = req.params.id;

      const checkProduct = await productModel.selectProduct(id)
      try {
        if (checkProduct.rowCount == 0) throw 'Product has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const result = await productModel.selectProduct(id)
      client.setEx(`product/${id}`, 60 * 60, JSON.stringify(result.rows))
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertProduct: async (req, res) => {
    try {
      const id = uuidv4().toLocaleLowerCase();
      const PORT = process.env.PORT
      const DB_HOST = process.env.DB_HOST
      const filephoto = req.file.filename;
      const photo = `http://${DB_HOST}:${PORT}/upload/${filephoto}`

      const {
        name,
        brand,
        price,
        stock,
        color,
        size,
        description,
        status,
        category_id,
        seller_id
      } = req.body;

      const statusLowerCase = status.toLowerCase()
      const category_idLowerCase = category_id.toLowerCase()
      const seller_idLowerCase = seller_id.toLowerCase()

      const checkCategory = await productModel.selectCategory(category_idLowerCase)

      try {
        if (checkCategory.rowCount == 0) throw 'Category has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const checkSeller = await productModel.selectSeller(seller_idLowerCase)

      try {
        if (checkSeller.rowCount == 0) throw 'Seller has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      await productModel.insertProduct(
        id,
        name,
        brand,
        price,
        stock,
        photo,
        color,
        size,
        description,
        statusLowerCase,
        category_idLowerCase,
        seller_idLowerCase
      )
      commonHelper.response(res, null, 201, "New Product Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id

      const checkProduct = await productModel.selectProduct(id)
      try {
        if (checkProduct.rowCount == 0) throw 'Product has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const PORT = process.env.PORT
      const DB_HOST = process.env.DB_HOST
      const filephoto = req.file.filename;
      const photo = `http://${DB_HOST}:${PORT}/upload/${filephoto}`

      const {
        name,
        brand,
        price,
        stock,
        color,
        size,
        description,
        status,
        category_id,
        seller_id
      } = req.body;

      const statusLowerCase = status.toLowerCase()
      const category_idLowerCase = category_id.toLowerCase()
      const seller_idLowerCase = seller_id.toLowerCase()

      const checkCategory = await productModel.selectCategory(category_idLowerCase)

      try {
        if (checkCategory.rowCount == 0) throw 'Category has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const checkSeller = await productModel.selectSeller(seller_idLowerCase)

      try {
        if (checkSeller.rowCount == 0) throw 'Seller has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      await productModel.updateProduct(
        id,
        name,
        brand,
        price,
        stock,
        photo,
        color,
        size,
        description,
        statusLowerCase,
        category_idLowerCase,
        seller_idLowerCase
      )

      const result = await productModel.selectProduct(id)
      client.setEx(`product/${id}`, 60 * 60, JSON.stringify(result.rows))

      commonHelper.response(res, null, 201, "Product Update");

    } catch (error) {
      res.send(createError(400));
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id

      const checkProduct = await productModel.selectProduct(id)

      try {
        if (checkProduct.rowCount == 0) throw 'Product has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      await productModel.deleteProduct(id)
      commonHelper.response(res, null, 200, "Product Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  }
}

module.exports = productController