const paymentModel = require('../models/payment')
const createError = require('http-errors')
const commonHelper = require('../helper/common');
const paymentController = {

  getPaginationPayment: async (req, res) => {
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
      const result = await paymentModel.selectPagination({ limit, offset, sortby, sort, querysearch });
      const totalData = parseInt(result.rowCount);
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
  getPayment: async (req, res) => {
    try {
      const id = req.params.id;

      const checkPayment = await paymentModel.selectPaymentId(id)

      try {
        if (checkPayment.rowCount == 0) throw 'Payment has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const result = await paymentModel.selectPaymentId(id);
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertPayment: async (req, res) => {
    try {
      const nameBody = req.body.name;
      const name = nameBody.toLowerCase()
      const { rows: [count] } = await paymentModel.countData()
      const id = `payment-${Number(count.count) + 1}`;
      await paymentModel.insertPayment(id, name);
      commonHelper.response(res, null, 201, "New Payment Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
  updatePayment: async (req, res) => {
    try {
      const id = req.params.id;
      const nameBody = req.body.name;
      const name = nameBody.toLowerCase()
      const checkPayment = await paymentModel.selectPaymentId(id)

      try {
        if (checkPayment.rowCount == 0) throw 'Payment has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      await paymentModel.updatePayment(id, name);
      commonHelper.response(res, null, 201, "Payment Updated");
    } catch (error) {
      res.send(createError(400))
    }
  },
  deletePayment: async (req, res) => {
    try {
      const id = req.params.id;

      const checkPayment = await paymentModel.selectPaymentId(id)

      try {
        if (checkPayment.rowCount == 0) throw 'Payment has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      await paymentModel.deletePayment(id);
      commonHelper.response(res, null, 200, "payment Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  },
  test: async (req, res) => {
    try {
      commonHelper.response(res, "Test", 200, "payment Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  }
}

module.exports = paymentController