const express = require('express');
const router = express.Router();
const sellerController = require('../controller/seller');
const { protect } = require('../middlewares/auth')
const { checkInputSeller, checkUpdateSeller, checkDeleteSeller } = require('../middlewares/common')
const upload = require('../middlewares/upload')

router.get('/', protect, sellerController.getPaginationSeller);
router.get('/:id', protect, sellerController.getSeller);
router.post('/', protect, upload.single('logo'), checkInputSeller, sellerController.insertSeller);
router.put('/', protect, upload.single('logo'), checkUpdateSeller, sellerController.updateSeller);
router.delete('/', protect, checkDeleteSeller, sellerController.deleteSeller);

module.exports = router