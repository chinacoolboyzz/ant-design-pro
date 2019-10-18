export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
          },
          // 登录页
          {
            name: 'login',
            icon: 'smile',
            path: '/user/login',
            component: './user/login',
          },
          {
            component: './exception/404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
          {
            name: 'account',
            icon: 'user',
            path: '/account',
            routes: [
              // 修改密码
              {
                path: '/account/change-password',
                name: 'changePassword',
                icon: 'lock',
                component: './account/changePassword',
              },
            ],
          },
          {
            path: '/',
            redirect: '/account/change-password',
            authority: ['admin', 'user'],
          },
          {
            component: './exception/404',
          },
        ],
      },
    ],
  },
];
