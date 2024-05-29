import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import CustomTooltip from 'src/components/custom/CustomTooltip'

const FeShowDeatils = ({ showCaseData }) => {
  // console.log('all value that we need', showCaseData)

  return (
    <>
      <CRow className="mt-4">
        <CCol md={12}>
          <CCard className="applicant-details">
            <CCardHeader>Applicant Details</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>CIN Number</span>
                  <h6>{showCaseData && showCaseData.cin_number ? showCaseData.cin_number : '-'}</h6>
                </CCol>
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Serial Number</span>
                  <h6>
                    {showCaseData && showCaseData.serial_number ? showCaseData.serial_number : '-'}
                  </h6>
                </CCol>
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                    Bank Case Number
                  </span>
                  <h6>{showCaseData && showCaseData.los_number ? showCaseData.los_number : '-'}</h6>
                </CCol>
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                    Date of Initiation (Bank)
                  </span>
                  <h6>
                    {showCaseData && showCaseData.date_initiation_bank
                      ? moment(showCaseData.date_initiation_bank).format('DD MMM YYYY')
                      : '-'}
                  </h6>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Product Name</span>
                  <h6>
                    {showCaseData && showCaseData.product_name ? showCaseData.product_name : '-'}
                  </h6>
                </CCol>
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                    Finance Category
                  </span>
                  <h6>
                    {showCaseData &&
                    showCaseData.finance_name_perent &&
                    showCaseData.finance_name_perent.name
                      ? showCaseData.finance_name_perent.name
                      : '-'}
                  </h6>
                </CCol>
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Finance Name</span>
                  <h6>
                    {showCaseData && showCaseData.finance_name && showCaseData.finance_name.name
                      ? showCaseData.finance_name.name
                      : '-'}
                  </h6>
                </CCol>
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Case of Branch</span>
                  <h6>
                    {showCaseData && showCaseData.case_of_branch
                      ? showCaseData.case_of_branch
                      : '-'}
                  </h6>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Contact Number (1)</span>
                  <h6>
                    {showCaseData && showCaseData.contact_number_1
                      ? showCaseData.contact_number_1
                      : '-'}
                  </h6>
                </CCol>
                <CCol md={3}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Contact Number (2)</span>
                  <h6>
                    {showCaseData && showCaseData.contact_number_2
                      ? showCaseData.contact_number_2
                      : '-'}
                  </h6>
                </CCol>
                <CCol md={6}>
                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>Address</span>
                  <h6>{showCaseData && showCaseData.address ? showCaseData.address : '-'}</h6>
                </CCol>
              </CRow>


              {showCaseData &&
                showCaseData?.additional_fields &&
                showCaseData?.additional_fields.filter((item) => item.role === 'COO').length >
                  0 && (
                  <>
                    <hr />
                    <h6 className="mt-3">Additional Fields By COO</h6>
                    {showCaseData &&
                      showCaseData.additional_fields &&
                      showCaseData.additional_fields
                        .filter((item) => item.role === 'COO')
                        .map((field, index) => (
                          <CRow key={index} className="mt-3">
                            {Object.entries(field)
                              .filter(([key]) => key !== 'role')
                              .map(([key, value]) => (
                                <CCol key={key} md={3}>
                                  <span style={{ fontSize: '13px', color: 'rgb(115 180 60)' }}>
                                    {key ? key : '-'}
                                  </span>
                                  <h6>{value ? value : '-'}</h6>
                                </CCol>
                              ))}
                          </CRow>
                        ))}
                  </>
                )}

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default FeShowDeatils
