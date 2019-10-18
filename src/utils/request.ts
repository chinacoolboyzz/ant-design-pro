/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import { message, notification } from 'antd';
import _ from 'lodash';
import { stringify } from 'qs';
import request, { extend, RequestOptionsInit } from 'umi-request';
import { namespace } from '@/models/login';
import token from './token';
import { checkToken } from './utils';

declare global {
  interface Window {
    g_app: any;
  }
}

interface ResponseError<D = any> extends Error {
  name: string;
  data: D;
  response: Response;
}

let isReloadToken = false;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response = {} as Response } = error;

  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });

  // token 失效强制登出
  if (response.status === 401) {
    /* eslint-disable-next-line no-underscore-dangle */
    window.g_app._store.dispatch({
      type: `${namespace}/logout`,
    });
  }

  const err: any = new Error(errortext);
  err.response = response;
  throw error;
};

/**
 * 配置request请求时的默认参数
 */
const extendRequest = extend({
  errorHandler, // 默认错误处理
  // omit: 默认值，忽略cookie的发送
  // same-origin: 表示cookie只能同域发送，不能跨域发送
  // include: cookie既可以同域发送，也可以跨域发送
  credentials: 'omit',
  mode: 'cors', // 跨域模式
});

// @ts-ignore
// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  let newHeaders = { ...options.headers };
  if (/get/i.test(options.method as string)) {
    newHeaders = {
      ...newHeaders,
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    };
  }

  // JWT认证
  let tokenVal = token.get();
  if (tokenVal) {
    if (!isReloadToken && !checkToken(10)) {
      isReloadToken = true;
      /* eslint-disable-next-line no-underscore-dangle */
      const result = await window.g_app._store.dispatch({
        type: `${namespace}/reloadToken`,
      });
      isReloadToken = false;
      if (result) {
        token.save(result);
        tokenVal = token.get();
      } else {
        message.error('刷新 token 失败');
      }
    }

    newHeaders = {
      ...newHeaders,
      Authorization: `Bearer ${tokenVal}`,
    };
  }
  return { url, options: newHeaders };
});

// 增删改查模版
export async function baseCRUD(params: any, method = 'GET', apiPath = '') {
  let url = '';
  const option: RequestOptionsInit = { method };
  switch (method) {
    case 'POST':
      option.data = params;
      break;
    case 'PUT':
      url = `/${params.uuid}`;
      option.data = params;
      break;
    case 'DELETE':
      url = `/${params}`;
      break;
    default:
      // GET
      if (!_.isEmpty(params)) url = `?${stringify(params)}`;
  }
  return extendRequest(`${API_HOST}${apiPath}${url}`, option);
}

export default extendRequest;
