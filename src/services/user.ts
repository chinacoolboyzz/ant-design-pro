import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

// 修改密码
export async function userPasswordPUT(params: any) {
  const option = {
    method: 'PUT',
    data: params,
  };
  return request(`${API_HOST}/api/v1/user/${params.uuid}/password`, option);
}
