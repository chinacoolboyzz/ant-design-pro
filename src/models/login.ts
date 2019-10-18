import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';

import { authLogin, refreshToken } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import token from '@/utils/token';
import { reloadAuthorized } from '@/utils/Authorized';

export interface IStateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: IStateType;
  effects: {
    login: Effect;
    logout: Effect;
    reloadToken: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<IStateType>;
  };
}

export const namespace = 'login';

const Model: LoginModelType = {
  namespace,

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(authLogin, payload);
      if (!(response || {}).token) {
        return;
      }
      token.save(response.token);

      yield put({
        type: 'changeLoginStatus',
        payload: {
          ...response,
          currentAuthority: (token.parse() as any).usr.type,
          status: 'ok',
          type: payload.type,
        },
      });
      reloadAuthorized();
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params as { redirect: string };
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      const { href, pathname } = window.location;
      token.remove();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      // redirect
      if (pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: href,
            }),
          }),
        );
      }
    },
    *reloadToken(_, { call }) {
      const response = yield call(refreshToken);
      return (response || {}).token;
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        token: payload.token,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
