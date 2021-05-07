const Router = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const router = new Router();
const fileController = require('../controller/file.controller');

router.post('', 				authMiddleware, fileController.createDir);
router.post('/upload', 	authMiddleware, fileController.uploadFile);
router.get('', 					authMiddleware, fileController.getFile);
router.get('/search', 	authMiddleware, fileController.searchFile);
router.get('/download', authMiddleware, fileController.downloadFile);
router.delete('/', 			authMiddleware, fileController.deleteFile);

module.exports = router;
