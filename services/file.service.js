const fs = require('fs');
const path = require('path');

class FileService {
  getPath(file) {
    const folderName = path.resolve(__dirname, '../files');
    return `${folderName}/${file.user}/${file.path}`;
  }
  createDir(file) {
    const filePath = this.getPath(file);
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: 'Этот файл был успешно создан' });
        } else {
          return reject({ message: 'Данный файл уже есть' });
        }
      } catch (err) {
        return reject(err);
      }
    });
  }
  deleteFileService(file) {
    const path = this.getPath(file);
    if (file.type === 'directory') {
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
  }
}

module.exports = new FileService();
