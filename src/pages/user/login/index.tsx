import { Alert } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import LoginComponents from './components/Login';
import { IStateType, namespace } from '@/models/login';
import styles from './style.less';

const { UserName, Password, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  userAndlogin: IStateType;
  submitting: boolean;
}
interface LoginState {
  type: string;
  // autoLogin: boolean;
}
export interface FormDataType {
  username: string;
  password: string;
}

@connect(
  ({
    userAndlogin,
    loading,
  }: {
    userAndlogin: IStateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userAndlogin,
    submitting: loading.effects[`${namespace}/login`],
  }),
)
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'account',
    // autoLogin: true,
  };

  handleSubmit = (err: any, values: FormDataType) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: `${namespace}/login`,
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  onTabChange = (type: string) => {
    this.setState({ type });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    // const { status, type: loginType } = userAndlogin;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          {/* {status === 'error' &&
            loginType === 'account' &&
            !submitting &&
            this.renderMessage(
              formatMessage({ id: 'userandlogin.login.message-invalid-credentials' }),
            )} */}
          <UserName
            name="username"
            placeholder={formatMessage({ id: 'userandlogin.login.userName' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandlogin.userName.required' }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={formatMessage({ id: 'userandlogin.login.password' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandlogin.password.required' }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              // @ts-ignore
              this.loginForm.validateFields(this.handleSubmit);
            }}
          />

          <Submit loading={submitting}>
            <FormattedMessage id="userandlogin.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
