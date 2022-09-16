const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category');
const { protect } = require('../middlewares/auth')
const { checkInputCategory, checkUpdateCategory, checkDeleteCategory,
} = require('../middlewares/common');


router.get('/', categoryController.getPaginationCategory);
router.get('/:id', categoryController.getCategory);
router.post('/', protect, checkInputCategory, categoryController.insertCategory);
router.put('/:id', protect, checkUpdateCategory, categoryController.updateCategory);
router.delete('/:id', protect, checkDeleteCategory, categoryController.deleteCategory);

module.exports = router