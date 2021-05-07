const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');
const fileService = require('../services/file.service');
const File = require('../models/File');

const registration_post = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ message: 'Uncorrect Request', errors });
    }
    console.log(req.body, 'auth.controller');
    let { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: `User with that email ${email} already exist` });
    }

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password });
    await newUser.save();
    await fileService.createDir(new File({ user: newUser.id, name: '' }));
    return res.json({ message: 'User was created' });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Server Error' });
  }
};

const login_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User was not Found' });
    }

    const isPassValid = bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '24h' });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Server Error', err });
  }
};

const auth_get = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Server error', e });
  }
};

module.exports = { registration_post, login_post, auth_get };
