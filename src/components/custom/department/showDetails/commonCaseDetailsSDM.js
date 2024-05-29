import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import BasicProvider from 'src/constants/BasicProvider'
import { checkRole } from 'src/constants/common'
import { cilChevronCircleDownAlt, cilChevronCircleUpAlt } from '@coreui/icons'
import CIcon from '@coreui/icons-react'



const CommonCaseDetailsSDM = ({ showCaseData }) => {

  console.log('showCaseData in common',showCaseData);
  return (
    <>
      <CCard className="applicant-details mt-4">
        <CCardHeader>Case Details</CCardHeader>

        <CCardBody>
          <CRow>
            <CCol md={3}>
              <span className="custom-lebel my-1">Applicant Name</span>
              <h6>{showCaseData?.applicant_name ?? '-'}</h6>
            </CCol>

            <CCol md={3}>
              <span className="custom-lebel my-1">Finance Name</span>
              <h6>{showCaseData?.finance_name ? showCaseData?.finance_name?.name : '-'}</h6>
            </CCol>

            <CCol md={3}>
              <span className="custom-lebel my-1">CIN Number</span>
              <h6>{showCaseData?.cin_number ?? '-'}</h6>
            </CCol>

            <CCol md={3}>
              <span className="custom-lebel my-1">LOS Number</span>
              <h6>{showCaseData?.los_number ?? '-'}</h6>
            </CCol>

            <CCol md={3}>
              <span className="custom-lebel my-1">Visited By</span>
              <h6>
                {showCaseData && showCaseData?.accepted_by?.name
                  ? showCaseData.accepted_by.name
                  : '-'}
              </h6>
            </CCol>
          </CRow>

        </CCardBody>
      </CCard>
    </>
  )
}

export default CommonCaseDetailsSDM
