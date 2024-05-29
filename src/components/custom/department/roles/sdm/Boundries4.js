import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import {
  cilChevronCircleDownAlt,
  cilChevronCircleUpAlt,
  cilCloudDownload,
  cilPencil,
} from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Boundries4 = ({ showCaseData }) => {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  var { id } = useParams()

  let loggedinUserRole = useSelector((state) => state?.userRole)

  return (
    <>
      <CRow className="mt-4">
        <CCol md={12}>
          <CCard className="applicant-details">
            <CCardHeader className="d-flex justify-content-between align-items-center c-card-headerSdm">
              4 Boundries
              <div className="action-btn">
                {params.type !== 'show-case-details' && (
                  <div className="edit-btn">
                    <CIcon
                      icon={cilPencil}
                      onClick={() =>
                        navigate(`/case/${id}/update/boundries/by/${loggedinUserRole.name}`, {
                          state: { secondStepVisible: true, formStep: 2 },
                        })
                      }
                    />
                  </div>
                )}
                {show ? (
                  <CIcon icon={cilChevronCircleUpAlt} size="xl" onClick={() => setShow(!show)} />
                ) : (
                  <CIcon icon={cilChevronCircleDownAlt} size="xl" onClick={() => setShow(!show)} />
                )}
              </div>
            </CCardHeader>
            {show && (
              <CCardBody>
                <CRow>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                      Property Hold Type
                    </span>
                    <h6>{showCaseData.type_of_property ?? '-'}</h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Proximity</span>
                    {/* <h6>{showCaseData.contact_number_1 ?? '-'}</h6> */}
                    <h6>{showCaseData.proximity ?? ' - '} </h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>East</span>
                    {/* <h6>{showCaseData.person_meet_at_site_name ?? '-'}</h6> */}
                    <h6>{showCaseData.east ?? ' - '}</h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>West</span>
                    {/* <h6>{showCaseData.person_meet_at_site_mobile ?? '-'}</h6> */}
                    <h6>{showCaseData.west ?? ' - '}</h6>
                  </CCol>
                </CRow>
                <CRow className="mt-3">
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>North</span>
                    {/* <h6>{showCaseData.person_meet_at_site_relation ?? '-'}</h6> */}
                    <h6>{showCaseData.north ?? ' - '}</h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>South</span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{showCaseData.south ?? ' - '}</h6>
                  </CCol>
                  <CCol md={6}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                      If Not Matching Reason
                    </span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{showCaseData.not_match_reason ?? ' - '}</h6>
                  </CCol>
                </CRow>
              </CCardBody>
            )}
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default Boundries4
