export default {
  email: {
    test: /.+@.+\..+/,
    message: '邮箱格式错误'
  },
  required: {
    test: /\S+/,
    message: '必填项'
  },
  url: {
    test: /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[:?\d]*)\S*$/,
    message: 'URL 格式错误'
  },
  phone: {
	test: /^[1][3,4,5,7,8][0-9]{9}$/,
	message: '请输入正确的手机号码'
  }
}