import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Prisma } from '@prisma/client';

dotenv.config();

import { login } from './src/api/login.js';
import { register } from './src/api/register.js';
import { getUsers, getUserById } from './src/api/users.js';
import { authToken } from './src/utils/authToken.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'ok'
  });
});

app.post('/api/login',authToken, login);
app.post('/api/register', register);

app.get("/api/users", getUsers);
app.get("/api/users/:userId", getUserById);


// Prisma 错误处理中间件
app.use((err, req, res, next) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(409).json({
            error: '唯一性约束冲突',
            field: err.meta?.target
          });
        case 'P2025':
          return res.status(404).json({
            error: '记录未找到'
          });
        case 'P2003':
          return res.status(400).json({
            error: '外键约束失败'
          });
        default:
          console.error('Prisma Error:', err);
          return res.status(500).json({
            error: '数据库操作失败'
          });
      }
    }
  
    if (err instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        error: '数据验证失败'
      });
    }
  
    next(err);
  });

const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});