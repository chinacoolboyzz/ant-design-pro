import { message } from 'antd';

interface ErrType {
  preventDefault: Function;
  message: string;
  response: Response;
}

export const dva = {
  config: {
    async onError(err: ErrType) {
      err.preventDefault();
      message.error(err.message);
      /* eslint-disable-next-line no-console */
      console.log({ err });
    },
  },
};
