import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CFormInput,
  CCol,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu, cilSearch } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import BasicProvider from 'src/constants/BasicProvider'
// import logo from 'src/assets/images/logo/Apple-2-logo.png'
import logoimg from 'src/assets/images/logo/Apple-2-logo.png'

const AppHeader = () => {
  const dispatch = useDispatch()
  const token = Cookies.get(`${process.env.REACT_APP_COOKIE_PREFIX}_auth`)
  var decoded = jwtDecode(token)

  useEffect(() => {
    dispatch({ type: 'setUserData', userData: decoded })
    dispatch({ type: 'setUserRole', userRole: decoded?.role[0]})
  }, [])

  const sidebarShow = useSelector((state) => state.sidebarShow)
  const userData = useSelector((state) => state.userData)

  
  return (
    <CHeader position="sticky" >
      <CContainer fluid className="appheader-custom">
        <div className='d-flex align-items-center'>
          <CHeaderToggler
            className="ps-1 d-flex align-items-center "
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderBrand className="mx-auto d-md-none mms-2" to="/">
            {/* <CIcon icon={logo} height={48} alt="Logo" /> */}

            <h1>
              <CImage src={logoimg} width={50} height={50}></CImage>
              {/* <span className="yellow">Real</span>Apple */}
            </h1>
          </CHeaderBrand>
        </div>
        <div className="text-end  d-none d-md-block search_bar position-relative">
          <CIcon icon={cilSearch} className="search_icon" />
          <input
            className="search_bar_box border-none outline-none"
            placeholder="Search"
            type="text"
            style={{ width: '250px' }}
            // value={search}
            // onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <CHeaderNav className="d-none d-md-flex me-auto"></CHeaderNav>
        {/* 
        <CHeaderNav>
         
        </CHeaderNav> */}
        <CHeaderNav className="align-items-center ">
          Hii, <span className="text-capitalize">{`  ${userData?.name ?? '-'}`}</span>
          <AppHeaderDropdown userData={userData} />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
