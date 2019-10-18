import { baseCRUD } from '@/utils/request';
import { FormDataType } from '@/pages/user/login';

// 登录
export const authLogin = (params: FormDataType, method: string = 'GET') =>
  baseCRUD(params, method, '/api/v1/auth/login');

// 刷新token
export const refreshToken = (params: any, method: string = 'GET') =>
  baseCRUD(params, method, '/api/v1/auth/refresh');
