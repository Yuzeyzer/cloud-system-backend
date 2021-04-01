const fs = require('fs');
const File = require('../models/File');
const config = require('config');

class FileService {
  createDir(File) {
    const filePath = `${config.get('filePath')}\\${File.user}\\${File.path}`;
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdir(filePath);
          return resolve({ message: 'Этот файл был успешно создан' });
        } else {
          return reject({ message: 'Данный файл уже есть' });
        }
      } catch (err) {
        return reject(err);
      }
    });
  }
}

module.exports = new FileService();
