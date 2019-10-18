import { Button, Card, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { Dispatch } from 'redux';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formLayout, validateMessages } from '@custom/utils';
import token from '@/utils/token';
import { namespace } from '@/models/user';

interface PropsType extends FormComponentProps {
  dispatch: Dispatch;
  loading: boolean;
}
interface StateType {
  password?: string;
}
@connect((store: any) => {
  const {
    loading,
  }: {
    loading: {
      models: { [key: string]: boolean };
    };
  } = store;
  return {
    loading: loading.models[namespace],
  };
})
class ChangePassword extends PureComponent<PropsType, StateType> {
  state: StateType = {
    password: undefined,
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields(
      async (err, data): Promise<void> => {
        if (err) {
          return;
        }
        const res = await dispatch({
          type: `${namespace}/changePassword`,
          payload: data,
        });
        if (res) {
          dispatch({
            type: 'login/logout',
          });
        }
      },
    );
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      loading,
    } = this.props;

    const tonkeVal: any = token.parse();
    return (
      <PageHeaderWrapper
        title={formatMessage({
          id: 'account.changePassword.changePassword',
          defaultMessage: 'Change Password',
        })}
      >
        <Card bordered={false}>
          {tonkeVal && (
            <Form {...formLayout} onSubmit={this.handleSubmit}>
              {getFieldDecorator('uuid', {
                initialValue: tonkeVal.usr.uuid,
              })(<Input hidden />)}
              <Form.Item label="原密码">
                {getFieldDecorator('current_password', {
                  rules: [
                    {
                      required: true,
                      min: 6,
                    },
                  ],
                })(
                  <Input.Password
                    placeholder="请输入原密码"
                    onChange={el => {
                      this.setState({ password: el.currentTarget.value });
                    }}
                  />,
                )}
              </Form.Item>
              <Form.Item
                label={formatMessage({
                  id: 'account.changePassword.newPassword',
                  defaultMessage: 'New Password',
                })}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        if ((value || '').length < 6) {
                          callback(new Error('新密码必须至少为 6 个字符'));
                        } else if (value === getFieldValue('current_password')) {
                          callback(new Error('新密码不能和原密码相同'));
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <Input.Password
                    disabled={_.isEmpty(this.state.password)}
                    placeholder="请输入新密码"
                  />,
                )}
              </Form.Item>
              <Form.Item label="确认密码">
                {getFieldDecorator('password_confirmation', {
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        if (value !== getFieldValue('password')) {
                          callback(new Error('确认密码和新密码不一致'));
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <Input.Password
                    disabled={_.isEmpty(this.state.password)}
                    placeholder="请输入确认密码"
                  />,
                )}
              </Form.Item>
              <Form.Item
                {...{
                  wrapperCol: {
                    xs: { span: 24, offset: 0 },
                    sm: { span: 16, offset: 6 },
                  },
                }}
              >
                <Button type="primary" htmlType="submit" loading={loading}>
                  确认
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create(validateMessages)(ChangePassword);
