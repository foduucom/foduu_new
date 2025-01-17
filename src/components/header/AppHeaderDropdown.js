import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import AuthHelpers from 'src/helpers/authHelper'
import { useNavigate } from 'react-router-dom'

import noImage from 'src/assets/images/noImage.png'

const URL = process.env.REACT_APP_NODE_URL

const AppHeaderDropdown = ({ userData }) => {
  const navigate = useNavigate()
  
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {userData && (
          <CAvatar
            src={userData?.featured_image ? `${URL}/${userData.featured_image}` : noImage}
            size="md"
          />
        )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem href="#" className="mt-2">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownDivider />
        <CDropdownItem
          onClick={async () => {
            await AuthHelpers.logout()
            navigate('/login')
          }}
        >
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
