export default {
  proxy: {
    '/api': {
      target: 'http://localhost/',
      changeOrigin: true,
    },
  },
};
