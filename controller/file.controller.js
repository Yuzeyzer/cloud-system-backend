const fileService = require('../services/file.service');
const User = require('../models/User');
const File = require('../models/File');
const path = require('path');
const fs = require('fs');

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent } = req.body;

      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findOne({ _id: parent });
      if (!parentFile) {
        file.path = name;
        await fileService.createDir(file);
      } else {
        file.path = `${parentFile.path}/${file.name}`;
        await fileService.createDir(file);
        parentFile.childs.push(file._id);
        await parentFile.save();
      }
      await file.save();
      return res.json(file);
    } catch (error) {
      console.error(error);
      return res.status(400).json(error);
    }
  }

  async getFile(req, res) {
    try {
      const files = await File.find({ user: req.user.id, parent: req.query.parent });
      res.status(201).json(files);
    } catch (error) {
      res.status(500).json({ message: 'Ошибки создания файла или папки' });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;

      const parent = await File.findOne({ user: req.user.id, _id: req.body.parent });
      const user = await User.findOne({ _id: req.user.id });

      if (user.usedSpace + file.size > user.diskSpace) {
        return res
          .status(400)
          .json({ message: 'На вашем диске больше нет места для загрузки данного файла' });
      }

      user.usedSpace = user.usedSpace + file.size;

      let pathFolder;

      const folderName = path.resolve(__dirname, '../files');

      if (parent) {
        pathFolder = `${folderName}/${user.id}/${parent.path}/${file.name}`;
      } else {
        pathFolder = `${folderName}/${user.id}/${file.name}`;
      }

      if (fs.existsSync(pathFolder)) {
        return res.status(400).json({ message: 'Данный файл уже есть, бро' });
      }

      file.mv(pathFolder);

      const type = file.name.split('.').pop();

      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: parent?.path,
        parent: parent?._id,
        user: user._id,
      });

      await dbFile.save();
      await user.save();

      res.json(dbFile);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Ошибка загрузки файла' });
    }
  }

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });

      const folderName = path.resolve(__dirname, '../files');

      const pathFolder = `${folderName}/${req.user.id}/${file.path}/${file.name}`;

      if (fs.existsSync(pathFolder)) {
        return res.download(pathFolder);
      }

      return res.status(400).json({message: 'Файл не был найден для скачивания'})
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Download error' });
    }
  }
}

module.exports = new FileController();
