//App.js

import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    var token = this.props.token
    try {
        var validToken = jwtDecode(token)
    } catch (error) {
      console.error(error);
    }
    return (
      <DndProvider backend={HTML5Backend}> 
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />


            <Route path="*" name="Home" element={validToken ? <DefaultLayout /> : <Login />} />
            {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}

          </Routes>
        </Suspense>
      </HashRouter>
      </DndProvider>
    )
  }
}

App.propTypes = {
  isLogin: PropTypes.any,
}

function mapStateToProps(state) {
  var token = Cookies.get(`${process.env.REACT_APP_COOKIE_PREFIX}_auth`)
  var isLogin = state.isLogin
  if ((token !== null || token !== '') && token !== undefined && isLogin === undefined) {
    isLogin = true
  }

  return {
    token,
  }
}

export default connect(mapStateToProps)(App)
