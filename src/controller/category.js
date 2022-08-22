const categoryModel = require('../models/category')
const createError = require('http-errors')
const commonHelper = require('../helper/common');
const categoryController = {

  getPaginationCategory: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const search = req.query.search;
      let querysearch = '';
      if (search === undefined) {
        querysearch = ``;
      } else {
        querysearch = ` where name like '%${search.toLowerCase()}%' `;
      }
      const sortby = req.query.sortby || ('created_on');
      const sort = req.query.sort || 'asc';
      const result = await categoryModel.selectPagination({ limit, offset, sortby, sort, querysearch });
      const totalData = parseInt((await categoryModel.selectAll()).rowCount);
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
  getCategory: async (req, res) => {
    try {
      const id = req.params.id;

      const checkCatagory = await categoryModel.selectCategoryId(id)

      try {
        if (checkCatagory.rowCount == 0) throw 'Category has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }
      const result = await categoryModel.selectCategoryId(id);
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertCategory: async (req, res) => {
    try {
      const nameBody = req.body.name;
      const name = nameBody.toLowerCase()
      const { rows: [count] } = await categoryModel.countData()
      const id = `category-${Number(count.count) + 1}`;
      await categoryModel.insertCategory(id, name);
      commonHelper.response(res, null, 201, "New Category Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const nameBody = req.body.name;
      const name = nameBody.toLowerCase()
      const checkCatagory = await categoryModel.selectCategoryId(id)

      try {
        if (checkCatagory.rowCount == 0) throw 'Category has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      await categoryModel.updateCategory(id, name);
      commonHelper.response(res, null, 201, "Category Updated");
    } catch (error) {
      res.send(createError(400))
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;

      const checkCatagory = await categoryModel.selectCategoryId(id)

      try {
        if (checkCatagory.rowCount == 0) throw 'Category has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      await categoryModel.deleteCategory(id);
      commonHelper.response(res, null, 200, "Category Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  }
}

module.exports = categoryController