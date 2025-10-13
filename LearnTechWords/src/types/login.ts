// 用户信息接口
export interface UserInfo {
  username: string
  password: string
}

// 登录表单接口
export interface LoginForm {
  username: string
  password: string
}

// 注册表单接口
export interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
}

// 表单验证规则
export interface ValidationRules {
  username: {
    minLength: number
    pattern: RegExp
    message: string
  }
  password: {
    pattern: RegExp
    message: string
  }
}

// 组件状态
export interface LoginState {
  isLogin: boolean
  isLoading: boolean
  errorMessage: string
}

// 表单验证错误
export interface FormErrors {
  username?: string
  password?: string
  confirmPassword?: string
}
