import { Request, Response } from 'express';
import moment from 'moment';

function base64urlEncode(o: object) {
  const data = JSON.stringify(o);
  const str = typeof data === 'number' ? (data as number).toString() : data;
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function getToken() {
  return {
    token: `jwt.${base64urlEncode({
      exp: moment()
        .add(1, 'h')
        .valueOf(),
      usr: {
        uuid: 'dc6e8c8a-6e88-4816-b928-bf9b62a13132',
        username: 'admin',
        type: 'admin',
      },
    })}.token`,
  };
}

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  // GET POST 可省略
  '/api/v1/auth/login': (req: Request, res: Response) => {
    // const { } = req.body;
    res.status(200).send(getToken());
  },
  '/api/v1/auth/refresh': (req: Request, res: Response) => {
    // const { } = req.body;
    res.status(200).send(getToken());
  },
  'PUT /api/v1/user*': (req: Request, res: Response) => {
    // const { } = req.body;
    res.status(200).send({});
  },
};
