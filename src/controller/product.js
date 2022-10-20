const { v4: uuidv4 } = require("uuid");
const productModel = require("../models/product");
const createError = require("http-errors");
const commonHelper = require("../helper/common");
const client = require("../config/redis");

const productController = {
  getPaginationProduct: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 24;
      const offset = (page - 1) * limit;

      const search = req.query.search;
      let querysearch = "";
      if (search === undefined) {
        querysearch = ``;
      } else {
        // querysearch = ` where name  like '%${search.toLowerCase()}%' `;
        querysearch = ` where product.name ilike '%${search}%' `;
      }
      // console.log(querysearch);
      const sortby = req.query.sortby || "created_on";
      const sort = req.query.sort || "desc";
      const result = await productModel.selectPagination({ limit, offset, sortby, sort, querysearch });
      const resultTotal = await productModel.selectPaginationTotal({ querysearch });
      const totalData = parseInt(resultTotal.rowCount);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, null, pagination);
    } catch (error) {
      res.send(createError(404));
    }
  },
  getProduct: async (req, res) => {
    try {
      const id = req.params.id;

      const checkProduct = await productModel.selectProduct(id);
      try {
        if (checkProduct.rowCount == 0) throw "Product has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const result = await productModel.selectProduct(id);
      // client.setEx(`product/${id}`, 60 * 60, JSON.stringify(result.rows));
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertProduct: async (req, res) => {
    console.log(req.files)
    try {
      const id = uuidv4().toLocaleLowerCase();
      const PORT = process.env.PORT;
      const DB_HOST = process.env.DB_HOST;
      try {
        if (!req.file) throw "Photo Must Include";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const filephoto = req.file.filename;
      const photo = `http://${DB_HOST}:${PORT}/upload/${filephoto}`;

      const { name, brand, price, stock, color, size, condition, description, status, category_id, seller_id } = req.body;

      const conditionLowerCase = condition.toLowerCase();
      const namelowerCase = name;
      const statusLowerCase = status.toLowerCase();
      const category_idLowerCase = category_id.toLowerCase();
      const seller_idLowerCase = seller_id.toLowerCase();

      const checkCategory = await productModel.selectCategory(category_idLowerCase);

      try {
        if (checkCategory.rowCount == 0) throw "Category has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const checkSeller = await productModel.selectSeller(seller_idLowerCase);

      try {
        if (checkSeller.rowCount == 0) throw "Seller has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await productModel.insertProduct(id, namelowerCase, brand, price, stock, photo, color, size, conditionLowerCase, description, statusLowerCase, category_idLowerCase, seller_idLowerCase);
      commonHelper.response(res, null, 201, "New Product Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id)
      const checkProduct = await productModel.selectProduct(id);
      try {
        if (checkProduct.rowCount == 0) throw "Product has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      const PORT = process.env.PORT;
      const DB_HOST = process.env.DB_HOST;

      if (!req.file) {

        const { name, brand, price, stock, color, size, condition, description, status, category_id, seller_id } = req.body;

        const conditionLowerCase = condition.toLowerCase();
        const namelowerCase = name;
        const statusLowerCase = status.toLowerCase();
        const category_idLowerCase = category_id.toLowerCase();
        const seller_idLowerCase = seller_id.toLowerCase();

        const checkCategory = await productModel.selectCategory(category_idLowerCase);

        try {
          if (checkCategory.rowCount == 0) throw "Category has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const checkSeller = await productModel.selectSeller(seller_idLowerCase);

        try {
          if (checkSeller.rowCount == 0) throw "Seller has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await productModel.updateProductNoPhoto(id, namelowerCase, brand, price, stock, color, size, conditionLowerCase, description, statusLowerCase, category_idLowerCase, seller_idLowerCase);

        const result = await productModel.selectProduct(id);
        client.setEx(`product/${id}`, 60 * 60, JSON.stringify(result.rows));

      } else {
        const filephoto = req.file.filename;
        const photo = `http://${DB_HOST}:${PORT}/upload/${filephoto}`;

        const { name, brand, price, stock, color, size, condition, description, status, category_id, seller_id } = req.body;

        const conditionLowerCase = condition.toLowerCase();
        const namelowerCase = name;
        const statusLowerCase = status.toLowerCase();
        const category_idLowerCase = category_id.toLowerCase();
        const seller_idLowerCase = seller_id.toLowerCase();

        const checkCategory = await productModel.selectCategory(category_idLowerCase);

        try {
          if (checkCategory.rowCount == 0) throw "Category has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        const checkSeller = await productModel.selectSeller(seller_idLowerCase);

        try {
          if (checkSeller.rowCount == 0) throw "Seller has not found";
        } catch (error) {
          return commonHelper.response(res, null, 404, error);
        }

        await productModel.updateProduct(id, namelowerCase, brand, price, stock, photo, color, size, conditionLowerCase, description, statusLowerCase, category_idLowerCase, seller_idLowerCase);

        const result = await productModel.selectProduct(id);
        client.setEx(`product/${id}`, 60 * 60, JSON.stringify(result.rows));
      }

      commonHelper.response(res, null, 201, "Product Update");
    } catch (error) {
      res.send(createError(400));
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const id = req.params.id;

      const checkProduct = await productModel.selectProduct(id);

      try {
        if (checkProduct.rowCount == 0) throw "Product has not found";
      } catch (error) {
        return commonHelper.response(res, null, 404, error);
      }

      await productModel.deleteProduct(id);
      commonHelper.response(res, null, 200, "Product Deleted Success");
    } catch (error) {
      res.send(createError(404));
    }
  },

  deleteProductSelected: async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      await productModel.deleteProductSelected(id);
      commonHelper.response(res, null, 200, "Product Deleted Selected Success");
    } catch (error) {
      res.send(createError(404));
    }
  },

  getPaginationProductCategory: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 24;
      const offset = (page - 1) * limit;

      // const search = req.query.search;
      const search = req.params.name;
      // const search = req.params.id
      let querysearch = "";
      if (search === undefined) {
        querysearch = ``;
      } else {
        // querysearch = ` where name  like '%${search.toLowerCase()}%' `;
        querysearch = ` where category.name ilike '%${search.toLowerCase()}%' `;
      }
      const sortby = req.query.sortby || "created_on";
      const sort = req.query.sort || "desc";
      const result = await productModel.selectPaginationCategory({ limit, offset, sortby, sort, querysearch });
      const totalData = parseInt(result.rowCount);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, null, pagination);
    } catch (error) {
      res.send(createError(404));
    }
  },

  getPaginationProductPopular: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 24;
      const offset = (page - 1) * limit;

      const search = req.query.search;
      let querysearch = "";
      if (search === undefined) {
        querysearch = ``;
      } else {
        // querysearch = ` where name  like '%${search.toLowerCase()}%' `;
        querysearch = ` where product.name like '%${search.toLowerCase()}%' `;
      }
      const sortby = req.query.sortby || "ValueFrequency";
      const sort = req.query.sort || "desc";
      const result = await productModel.selectPaginationPopular({ limit, offset, sortby, sort, querysearch });
      const resultTotal = await productModel.selectPaginationTotal({ querysearch });
      const totalData = parseInt(resultTotal.rowCount);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, null, pagination);
    } catch (error) {
      res.send(createError(404));
    }
  },
  getPaginationProductSeller: async (req, res) => {
    try {
      const id = req.params.id;
      const {
        rows: [user],
      } = await productModel.selectProduct(id);

      console.log(user.seller_id);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 24;
      const offset = (page - 1) * limit;

      const search = user.seller_id;
      let querysearch = "";
      if (search === undefined) {
        querysearch = ``;
      } else {
        // querysearch = ` where name  like '%${search.toLowerCase()}%' `;
        querysearch = ` where product.seller_id = '${search}' `;
      }
      const sortby = req.query.sortby || "created_on";
      const sort = req.query.sort || "desc";
      const result = await productModel.selectPaginationSeller({ limit, offset, sortby, sort, querysearch });
      const resultTotal = await productModel.selectPaginationTotal({ querysearch });
      const totalData = parseInt(resultTotal.rowCount);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, null, pagination);
    } catch (error) {
      res.send(createError(404));
    }
  },
  getPaginationProductBySeller: async (req, res) => {
    try {
      const id = req.params.id;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 24;
      const offset = (page - 1) * limit;

      const querysearch = ` where product.seller_id = '${id}' `;
      const sortby = req.query.sortby || "created_on";
      const sort = req.query.sort || "desc";
      const result = await productModel.selectPaginationSeller({ limit, offset, sortby, sort, querysearch });
      const resultTotal = await productModel.selectPaginationTotal({ querysearch });
      const totalData = parseInt(resultTotal.rowCount);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, null, pagination);
    } catch (error) {
      res.send(createError(404));
    }
  },
};

module.exports = productController;
