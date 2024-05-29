import React, { useEffect } from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CWidgetStatsF,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilSettings,
  cilMoon,
  cilBell,
} from '@coreui/icons'

const WidgetSideBox = ({ counts }) => {
  const navigate = useNavigate()

  return (
    <CRow className="cust_side_box mt-4 mt-md-0">
      <CCol sm={6} md={12}>
        <CWidgetStatsF
          className="mb-3 overview_dashboard All-case"
          icon={<CIcon width={24} icon={cilBell} size="xl" />}
          padding={false}
          title="All Case"
          value="260"
          color="danger"
        />
      </CCol>
      <CCol sm={6} md={12}>
        <CWidgetStatsF
          className="mb-3 overview_dashboard visit"
          icon={<CIcon width={24} icon={cilSettings} size="xl" />}
          padding={false}
          title="Pending For Visit"
          value="50k"
          color="primary"
        />
      </CCol>
      <CCol sm={6} md={12}>
        <CWidgetStatsF
          className="mb-3 overview_dashboard "
          icon={<CIcon width={24} icon={cilUser} size="xl" className="" />}
          padding={false}
          title="Pending From Draft"
          value="3k"
          color="info"
        />
      </CCol>
      <CCol sm={6} md={12}>
        <CWidgetStatsF
          className="mb-3 overview_dashboard rc"
          icon={<CIcon width={24} icon={cilMoon} size="xl" />}
          padding={false}
          title="Pending For RC"
          value="200"
          color="warning"
        />
      </CCol>
      <CCol sm={6} md={12}>
        <CWidgetStatsF
          className="mb-3 overview_dashboard Query"
          icon={<CIcon width={24} icon={cilBell} size="xl" />}
          padding={false}
          title="Case Under Query"
          value="260"
          color="danger"
        />
      </CCol>
      {/* <CCol lg={12}>
        <CWidgetStatsF
          className="mb-3 overview_dashboard case"
          icon={<CIcon width={24} icon={cilBell} size="xl" />}
          padding={false}
          title="All Cases"
          value="260"
          color="danger"
        />
      </CCol> */}
    </CRow>
  )
}

export default WidgetSideBox
