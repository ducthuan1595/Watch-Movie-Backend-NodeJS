import express from 'express';
import cors from 'cors';
import path from 'path';

import initRoute from './routers/route.js';

const app = express();
const port = 5000;
const __dirname = path.resolve();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

initRoute(app);

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
    errCode: 1
  })
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
