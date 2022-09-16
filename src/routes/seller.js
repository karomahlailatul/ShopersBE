const express = require('express');
const router = express.Router();
const sellerController = require('../controller/seller');
// const { protect } = require('../middlewares/auth')
// const { checkInputSeller, checkUpdateSeller, checkDeleteSeller } = require('../middlewares/common')
const upload = require('../middlewares/upload')

// router.get('/', sellerController.getPaginationSeller);
// router.get('/:id', sellerController.getSeller);
// router.post('/', upload.single('logo'), checkInputSeller, sellerController.insertSeller);
// router.put('/', upload.single('logo'), checkUpdateSeller, sellerController.updateSeller);
// router.delete('/', checkDeleteSeller, sellerController.deleteSeller);


router.get('/', sellerController.getPaginationSeller);
router.get('/:id', sellerController.getSeller);
router.post('/', upload.single('logo'), sellerController.insertSeller);


router.put('/:id', upload.single('logo'), sellerController.updateSeller);

// router.put('/:id', upload.single('logo'), sellerController.updateSeller);
// router.put('/:id', (upload ? (upload.single('logo'), sellerController.updateSeller) : (sellerController.updateSeller)));
// console.log(upload)



router.delete('/:id', sellerController.deleteSeller);

router.post('/on-register', sellerController.insertSellerOnRegister);


module.exports = router