const Router = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const router = new Router();
const fileController = require('../controller/file.controller');

router.post('', authMiddleware, fileController.createDir);

module.exports = router;
