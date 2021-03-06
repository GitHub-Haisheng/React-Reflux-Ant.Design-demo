import React from 'react';
import { Link } from 'react-router';
import { Row, Col, Button, Form, Input, notification } from 'antd';
import UserActions from '../../actions/user';
const createForm = Form.create;
const FormItem = Form.Item;

import './index.less';

function noop() {
  return false;
}

class Reg extends React.Component {
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    // 校验
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        // console.log(errors);
        notification.error({
            message: '输入错误',
            description: ''
        });
        return;
      }
      console.log('Submit!!!');
      // 注册
      UserActions.reg(values);
    });
  }

  userExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      setTimeout(() => {
        if (value === 'JasonWood') {
          callback([new Error('抱歉，该用户名已被占用。')]);
        } else {
          callback();
        }
      }, 800);
    }
  }

  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['rePasswd']);
    }
    callback();
  }

  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('passwd')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;

    return (
      <Row className="reg-row" type="flex" justify="space-around" align="middle">
        <Col span="8">
          <h1 style={{textAlign: 'center'}}>注册</h1>
          <Form horizontal form={this.props.form} className="reg-form">
            <FormItem
              label="用户名："
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 12 }}
              hasFeedback
              help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}>
              <Input placeholder="实时校验，输入 JasonWood 看看"
                {...getFieldProps('name', {
                  rules: [
                    { required: true, min: 5, message: '用户名至少为 5 个字符' },
                    { validator: this.userExists },
                  ],
                })} />
            </FormItem>

            <FormItem
              label="邮箱："
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 12 }}
              hasFeedback>
              <Input type="email" placeholder="onBlur 与 onChange 相结合"
                {...getFieldProps('email', {
                  validate: [{
                    rules: [
                      { required: true },
                    ],
                    trigger: 'onBlur',
                  }, {
                    rules: [
                      { type: 'email', message: '请输入正确的邮箱地址' },
                    ],
                    trigger: ['onBlur', 'onChange'],
                  }]
                })}/>
            </FormItem>

            <FormItem
              label="密码："
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 12 }}
              hasFeedback>
              <Input type="password" autoComplete="off"
                {...getFieldProps('passwd', {
                  rules: [
                    { required: true, whitespace: true, message: '请填写密码' },
                    { validator: this.checkPass.bind(this) },
                  ],
                })}
                onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}/>
            </FormItem>

            <FormItem
              label="确认密码："
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 12 }}
              hasFeedback>
              <Input type="password" autoComplete="off" placeholder="两次输入密码保持一致"
                onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                {...getFieldProps('rePasswd', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请再次输入密码',
                  }, {
                    validator: this.checkPass2.bind(this),
                  }],
                })}/>
            </FormItem>

            <FormItem
              label="备注："
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 12 }}>
              <Input type="textarea" placeholder="随便写" id="textarea" name="textarea"
                {...getFieldProps('textarea', {
                  rules: [
                    { required: true, message: '真的不打算写点什么吗？' },
                  ],
                })}/>
            </FormItem>

            <FormItem wrapperCol={{ span: 12, offset: 7 }} >
              已有账号 <Link to="login">登陆</Link>
            </FormItem>

            <FormItem wrapperCol={{ span: 12, offset: 7 }} style={{marginBottom: 5}}>
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
                &nbsp;&nbsp;&nbsp;
              <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    );
  }
}

Reg = createForm()(Reg);

export default Reg;
