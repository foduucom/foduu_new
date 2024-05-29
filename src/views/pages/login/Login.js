import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/logo/Apple-logo.png'

import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import AuthHelpers from 'src/helpers/authHelper'
// import AuthHelpers from 'src/helpers/AuthHelpers'

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})
const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isNotLoggin = useSelector((state) => state.isNotLoggin)
  const isBlock = useSelector((state) => state.isBlock)
  const [customError, setcustomError] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  const [blockError , setBlockError] = useState(null)
  const [blockTimeOut , setBlockTimeOut] = useState(null)


  useEffect(() => {
    if (isNotLoggin) {
      setcustomError('This credentials do not match our records!')
      if (!timeoutId) {
        const newTimeoutId = setTimeout(() => {
          setcustomError(null)
          dispatch({ type: 'set', isNotLoggin: 'notLogin' })
        }, 2000)
        setTimeoutId(newTimeoutId)
      }
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        setTimeoutId(null)
      }
    }
  }, [isNotLoggin, timeoutId])

  
  useEffect(() => {
    if (isBlock) {
      setBlockError('Your Account has been blacklisted!')
      if (!blockTimeOut) {
        const newTimeoutId = setTimeout(() => {
          setBlockError(null)
          dispatch({ type: 'set', isBlock: 'notLogin' })
        }, 2000)
        setBlockTimeOut(newTimeoutId)
      }
    }

    return () => {
      if (blockTimeOut) {
        clearTimeout(blockTimeOut)
        setBlockTimeOut(null)
      }
    }
  }, [isBlock, blockTimeOut])

  return (
    <div className="bg-theme-color min-vh-100 d-flex flex-row align-items-center" style={{background:"url('real-apple.avif')",backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4 login_card">
                <CCardBody>
                  <Formik
                    initialValues={{
                      email: '',
                      password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting, isSubmitting }) => {
                      AuthHelpers.login(values, navigate, dispatch).finally(() => {
                        setSubmitting(false)
                      })
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form className="admin-login-page">
                        <div className="text-center">
                          <img src={logo} alt="logo" className="w-75" />
                          {/* <h2>
                            <span className="yellow">Real</span> Apple
                          </h2> */}
                          <p className="text-medium-emphasis  mb-3">Sign In to your account</p>
                        </div>
                        {customError && <CAlert color="danger">{customError}</CAlert>}
                        {blockError && <CAlert color="danger">{blockError}</CAlert>}


                        <CRow className="mb-2">
                          <CFormLabel htmlFor="exampleInputEmail1" className="label-text">
                            Email<span className="text-danger">*</span>
                          </CFormLabel>
                          <CInputGroup>
                            {/* <CInputGroupText className="bg-theme-color ">
                            <CIcon icon={cilUser} />
                          </CInputGroupText> */}
                            <Field
                              type="text"
                              name="email"
                              placeholder="Enter your email"
                              autoComplete="email"
                              className="form-control"
                            />
                          </CInputGroup>
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-danger text-start"
                          />
                        </CRow>
                        <CRow className="mb-4">
                          <CFormLabel htmlFor="exampleInputEmail1" className="label-text">
                            Password<span className="text-danger">*</span>
                          </CFormLabel>
                          <CInputGroup>
                            {/* <CInputGroupText className="bg-theme-color border-none">
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText> */}
                            <Field
                              type="password"
                              name="password"
                              placeholder="Enter your password"
                              autoComplete="current-password"
                              className="form-control "
                            />
                          </CInputGroup>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-danger text-start"
                          />
                        </CRow>
                        <CRow>
                          <CCol xs={12} className="m-auto ">
                            <CButton className="px-4 sign-up" type="submit" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <div class="spinner-border" role="status"></div>
                              ) : (
                                'Login'
                              )}
                            </CButton>
                          </CCol>
                          {/* <CCol xs={6} className="text-right">
                          <CButton
                            color="link"
                            className="px-0"
                            onClick={() => {
                              navigate('/reset/password')
                            }}
                          >
                            Forgot password?
                          </CButton>
                        </CCol> */}
                        </CRow>
                      </Form>
                    )}
                  </Formik>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
