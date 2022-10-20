const { v4: uuidv4 } = require('uuid');
const transactionModel = require('../models/transaction')
const createError = require('http-errors')
const commonHelper = require('../helper/common');
const client = require('../config/redis')

const transactionController = {
  getPaginationTransaction: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search;
      let querysearch = '';
      if (search === undefined) {
        querysearch = ``;
      } else {
        querysearch = ` inner join product on transaction.product_id = product.id where name like '%${search.toLowerCase()}%' `;
      }
      const sortby = req.query.sortby || ('created_on');
      const sort = req.query.sort || 'asc';
      const result = await transactionModel.selectPagination({ limit, offset, sortby, sort, querysearch });
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
  getTransaction: async (req, res) => {
    try {
      const id = req.params.id;

      const checkTransaction = await transactionModel.selectTransactionId(id)

      try {
        if (checkTransaction.rowCount == 0) throw 'Transaction has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const result = await transactionModel.selectTransactionId(id)
      // client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))
      commonHelper.response(res, result.rows, 200, null);
    } catch (error) {
      res.send(createError(404));
    }
  },
  insertTransaction: async (req, res) => {
    try {
      const id = uuidv4().toLocaleLowerCase();
      const {
        product_id,
        quantity,
        discount,
        payment_id,
        users_id
      } = req.body;

      const status_payment = 'pending'
      const status_transaction = 'process'

      const product_idToLowerCase = product_id.toLowerCase()
      const checkProduct = await transactionModel.checkProduct(product_idToLowerCase)

      let cekProduct = checkProduct.rows[0];
      let getStock = (object, row) => { return object[row] }
      const valueStockProduct = getStock(cekProduct, "stock")
      const valuePriceProduct = getStock(cekProduct, "price")

      const payment_idToLowercase = payment_id.toLowerCase()
      const checkPayment = await transactionModel.checkPayment(payment_idToLowercase)

      const users_idToLowercase = users_id.toLowerCase()
      const checkUsers = await transactionModel.checkUsers(users_idToLowercase)

      try {
        if (checkProduct.rowCount == 0) throw 'Product has not found';
        if (valueStockProduct - quantity < 0) throw 'Insufficient stock product';
        if (checkPayment.rowCount == 0) throw 'Payment has not found';
        if (checkUsers.rowCount == 0) throw 'Users has not found';

      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const total_amount = (valuePriceProduct * quantity) - discount

      await transactionModel.insertTransaction(
        id,
        product_idToLowerCase,
        quantity,
        discount,
        total_amount,
        payment_idToLowercase,
        status_payment,
        status_transaction,
        users_idToLowercase
      )

      const stockProductUpdate = (valueStockProduct - quantity)

      await transactionModel.updateStockProduct(
        product_idToLowerCase, stockProductUpdate
      )

      commonHelper.response(res, null, 201, "New Transaction Created");
    } catch (error) {
      res.send(createError(400));
    }
  },
  updateTransaction: async (req, res) => {
    try {
      const id = req.params.id
      const {
        product_id,
        quantity,
        discount,
        payment_id,
        status_payment,
        status_transaction,
        users_id
      } = req.body;

      const product_idToLowerCase = product_id.toLowerCase()
      const checkProduct = await transactionModel.checkProduct(product_idToLowerCase)

      let cekProduct = checkProduct.rows[0];
      let getStock = (object, row) => { return object[row] }
      const valueStockProduct = getStock(cekProduct, "stock")
      const valuePriceProduct = getStock(cekProduct, "price")

      const payment_idToLowercase = payment_id.toLowerCase()
      const checkPayment = await transactionModel.checkPayment(payment_idToLowercase)

      const users_idToLowercase = users_id.toLowerCase()
      const checkUsers = await transactionModel.checkUsers(users_idToLowercase)

      const status_paymentToLowercase = status_payment.toLowerCase()
      const status_transactionToLowercase = status_transaction.toLowerCase()

      try {
        if (checkProduct.rowCount == 0) throw 'Product has not found';
        if (valueStockProduct - quantity < 0) throw 'Insufficient stock product';
        if (checkPayment.rowCount == 0) throw 'Payment has not found';
        if (checkUsers.rowCount == 0) throw 'Users has not found';

      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const total_amount = (valuePriceProduct * quantity) - discount

      const checkTransaction = await transactionModel.selectTransactionId(id)
      let cekQuantity = checkTransaction.rows[0];
      let getQuantity = (object, row) => { return object[row] }
      const valueQuantity = getQuantity(cekQuantity, "quantity")

      let stockProductUpdate = ''

      if (valueQuantity != quantity) {
        stockProductUpdate = valueStockProduct - (quantity - valueQuantity)
      } else {
        stockProductUpdate = valueStockProduct
      }

      await transactionModel.updateStockProduct(
        product_idToLowerCase, stockProductUpdate
      )

      await transactionModel.updateTransaction(
        id,
        product_idToLowerCase,
        quantity,
        discount,
        total_amount,
        payment_idToLowercase,
        status_paymentToLowercase,
        status_transactionToLowercase,
        users_idToLowercase
      )

      console.log(
        id,
        product_idToLowerCase,
        quantity,
        discount,
        total_amount,
        payment_idToLowercase,
        status_paymentToLowercase,
        status_transactionToLowercase,
        users_idToLowercase
      )

      const result = await transactionModel.selectTransactionId(id)
      client.setEx(`transaction/${id}`, 60 * 60, JSON.stringify(result.rows))

      commonHelper.response(res, null, 201, "Transaction Updated");
    } catch (error) {
      res.send(createError(400));
    }
  },
  deleteTransaction: async (req, res) => {
    try {

      const id = req.params.id;

      const checkTransaction = await transactionModel.selectTransactionId(id)

      try {
        if (checkTransaction.rowCount == 0) throw 'Transaction has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      transactionModel.deleteTransaction(id)
      commonHelper.response(res, null, 200, "Transaction Deleted");
    } catch (error) {
      res.send(createError(404));
    }
  },
  getInvoiceTransaction: async (req, res) => {
    try {

      const id = req.params.id;

      const checkTransaction = await transactionModel.selectTransactionId(id)

      try {
        if (checkTransaction.rowCount == 0) throw 'Transaction has not found';
      } catch (error) {
        return (commonHelper.response(res, null, 404, error))
      }

      const result = await transactionModel.selectInvoiceTransaction(id)
      client.setEx(`transaction/invoice/${id}`, 60 * 60, JSON.stringify(result.rows))
      commonHelper.response(res, result.rows, 200, null);

    } catch (error) {
      res.send(createError(404));
    }
  }
}

module.exports = transactionController