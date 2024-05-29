import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import {
  cilChevronCircleDownAlt,
  cilChevronCircleUpAlt,
  cilCloudDownload,
  cilPencil,
} from '@coreui/icons'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const DevelScopeDetails = ({ showCaseData }) => {
  let loggedinUserRole = useSelector((state) => state?.userRole)
  var params = useParams()
  const id = params.id
  const [show, setShow] = useState(false)
  const navigate =  useNavigate()

  return (
    <>
      <CRow className="mt-4">
        <CCol md={12}>
          <CCard className="applicant-details">
            <CCardHeader className="d-flex justify-content-between align-items-center c-card-headerSdm rounded">
              Development and Scope
              <div className="action-btn">
              {
                params.type !=='show-case-details' && (
                  <div className="edit-btn">
                  <CIcon icon={cilPencil} 
                    onClick={() => navigate(`/case/${id}/update/development-scope/by/${loggedinUserRole.name}`,{state:{fourthStepVisible:true,formStep:4}})}

                  />
                </div>
                )
              }
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
                      Postive Point
                    </span>
                    <h6 className="floor_header">
                      {' '}
                      {showCaseData?.positive_point.map((item) => {
                        return <span>{item.slug},</span>
                      })}{' '}
                    </h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                      Negative Point
                    </span>
                    <h6 className="floor_header">
                      {showCaseData?.negative_point.map((item) => {
                        return <span>{item.slug},</span>
                      })}{' '}
                    </h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                      Additional Amenities Like
                    </span>
                    <h6 className="floor_header">
                      {showCaseData?.additional_amenities_like.map((item) => {
                        return <span>{item.slug},</span>
                      })}{' '}
                    </h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Road Type</span>
                    {/* <h6>{showCaseData.person_meet_at_site_relation ?? '-'}</h6> */}
                    <h6>{showCaseData.road_type ?? ' - '}</h6>
                  </CCol>
                </CRow>
                <CRow className="mt-3">


                <CCol md={3}>
                      <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                        Community Dominated
                      </span>
                      {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                      <h6>{showCaseData.community_dominated?? ' - '}</h6>
                    </CCol>
                 

                 {/* ---------------------------<<<<<<<<<<<< Cummunity Dominate>>>>>>>>>>>>>>>>>> --------------------------- */}

                  {showCaseData.community_dominated === 'yes' && (
                    <CCol md={3}>
                      <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                        Community Dominated Details
                      </span>
                      {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                      <h6>{showCaseData.community_dominated_details?? ' - '}</h6>
                    </CCol>
                  )}
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                      Age Of The Property
                    </span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{showCaseData.age_of_property ?? ' - '}</h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Life</span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{showCaseData.life_of_property ?? ' - '}</h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                      Development Of Area
                    </span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{showCaseData.development_of_area ?? ' - '}</h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Habitation</span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{showCaseData.habitation ?? ' - '}</h6>
                  </CCol>
                  {/* <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                      If Property Mortgaged
                    </span>
                  
                    <h6>{showCaseData.property_mortaged ?? ' - '}</h6>
                  </CCol> */}
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                      If Property Mortgaged
                    </span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{showCaseData.property_mortaged ?? ' - '}</h6>
                  </CCol>
                  {showCaseData.property_mortaged ==="yes"&&
                  <>
                  
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                     Property Mortgaged Month/Year
                    </span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{moment(showCaseData.mortaged_month_year).format("D MMM YYYY")?? ' - '}</h6>
                  </CCol>
                  <CCol md={3}>
                    <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                       Mortgaged Bank 
                    </span>
                    {/* <h6> {showCaseData.type_of_property ?? '-'}</h6> */}
                    <h6>{showCaseData.mortaged_bank_name?? ' - '}</h6>
                  </CCol>
                  </>
                  }
                </CRow>
              </CCardBody>
            )}
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default DevelScopeDetails
