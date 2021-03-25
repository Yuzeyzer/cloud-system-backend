const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const authRouter = require('./routes/auth.routes');
const corsMiddleware = require('./middleware/cors.middleware');
const app = express();
const PORT = config.get('PORT');

app.use(corsMiddleware)
app.use(express.json());
app.use('/api/auth', authRouter);

const start = async () => {
  try {
    await mongoose
      .connect(config.get('DB_URL'), { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        app.listen(PORT, () => {
          console.log('Сервер был запущен на этом порту', PORT);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};
start();
