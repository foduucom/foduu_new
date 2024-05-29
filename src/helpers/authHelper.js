import Cookies from 'js-cookie'
import BasicProvider from 'src/constants/BasicProvider'
import jwt_decode from 'jwt-decode'


class AuthHelpers {
  static async login(formdata, navigate, dispatch) {
    try {
      const response = await new BasicProvider('auth/admin/login', dispatch).postRequest(formdata)
      console.log(response)
      Cookies.set(`${process.env.REACT_APP_COOKIE_PREFIX}_auth`, response.data.access_token, {
        // expires: new Date(response.data.expires_in),
        path: '',
        domain: process.env.REACT_APP_URL,
        sameSite: 'strict',
      })
      dispatch({ type: 'set', isLogin: true })

      navigate('/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  static async logout(token) {
    try {
      Cookies.remove(`${process.env.REACT_APP_COOKIE_PREFIX}_auth`, {
        path: '',
        domain: process.env.REACT_APP_URL,
      })
    } catch (error) {
      console.error(error)
    }
  }
}
export default AuthHelpers
