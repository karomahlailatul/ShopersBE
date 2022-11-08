const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transaction");
// const { protect } = require('../middlewares/auth')
// const { checkInputTransaction, checkUpdateTransaction, checkDeleteTransaction } = require('../middlewares/common');
// const { hitCacheTransactionDetail, clearCacheTransactionDetail, hitCacheTransactionInvoice } = require('../middlewares/redis')

// router.get('/', protect, transactionController.getPaginationTransaction);
// router.get('/:id', protect, hitCacheTransactionDetail, transactionController.getTransaction);
// router.post('/', protect, checkInputTransaction, transactionController.insertTransaction);
// router.put('/:id', protect, clearCacheTransactionDetail, checkUpdateTransaction, transactionController.updateTransaction);
// router.delete('/:id', protect, clearCacheTransactionDetail, checkDeleteTransaction, transactionController.deleteTransaction);

// router.get('/invoice/:id', protect, hitCacheTransactionInvoice, transactionController.getInvoiceTransaction);

router.get("/", transactionController.getPaginationTransaction);
router.get(
  "/:id",
  // hitCacheTransactionDetail,
  transactionController.getTransaction
);
router.post("/", transactionController.insertTransaction);
router.put(
  "/:id",
  // clearCacheTransactionDetail,
  transactionController.updateTransaction
);
router.delete(
  "/:id",
  // clearCacheTransactionDetail,
  transactionController.deleteTransaction
);

router.get(
  "/invoice/:id",
  // hitCacheTransactionInvoice,
  transactionController.getInvoiceTransaction
);

module.exports = router;
