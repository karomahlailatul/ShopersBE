const express = require('express');
const router = express.Router();
const productController = require('../controller/product');
const { protect } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const { checkInputProduct, checkUpdateProduct, checkDeleteProduct } = require('../middlewares/common')
const { hitCacheProductDetail, clearCacheProductDetail } = require('../middlewares/redis')

router.get('/', protect, productController.getPaginationProduct);
router.get('/:id', protect, hitCacheProductDetail, productController.getProduct);
router.post('/', protect, upload.single('photo'), checkInputProduct, productController.insertProduct);
router.put('/:id', protect, clearCacheProductDetail, upload.single('photo'), checkUpdateProduct, productController.updateProduct);
router.delete('/:id', protect, clearCacheProductDetail, checkDeleteProduct, productController.deleteProduct);

module.exports = router