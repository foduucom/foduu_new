import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CTable,
    CTableHead,
    CTableDataCell,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
  } from '@coreui/react'
  import { useEffect, useState } from 'react'
  import BasicProvider from 'src/constants/BasicProvider'
  
  export const MessageShow = (props) => {
    let caseValue = props.caseValue
  
    // console.log('caseValue',caseValue);
  
    const handleClose = () => {
      props.handleCloseShowMessage()
    }
  
    
    return (
      <>
        <CModal
          alignment="center"
          scrollable
          visible={props.visible}
          onClose={handleClose}
          aria-labelledby="VerticallyCenteredScrollableExample"
          className="model_show"
        >
          <CModalHeader>
            <CModalTitle id="ToggleBetweenModalsExample1">Message</CModalTitle>
          </CModalHeader>
          <CModalBody className="bg-theme b-0 ">
            <div className="mx-2 my-3">
              <CTable borderless>
                <CTableHead></CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Bank Case no :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue.los_number ? caseValue.los_number : '-'}
                    </CTableDataCell>
                  </CTableRow>
  
  
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      CIN No. :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue?.cin_number ? caseValue?.cin_number : '-'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Serial No. :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue?.serial_number ? caseValue?.serial_number : '-'}
                    </CTableDataCell>
                  </CTableRow>
  
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Finance Name :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue?.finance_name?.name
                        ? caseValue?.finance_name?.name
                        : '-'}
                    </CTableDataCell>
                  </CTableRow>
  
                  {/* <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Date of Login :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">19-Mar-2024</CTableDataCell>
                  </CTableRow> */}
  
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Case types :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue?.case_type ? caseValue?.case_type : '-'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Case of Branch :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue?.case_of_branch ? caseValue?.case_of_branch : '-'}
                    </CTableDataCell>
                  </CTableRow>
  
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Applicant Name :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue?.applicant_name ? caseValue?.applicant_name : '-'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Contact No :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue.contact_number_1 ? caseValue.contact_number_1 : '-'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      Visit Address :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue?.location ? caseValue?.location : '-'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row" className="font-small-size">
                      RA Branch :
                    </CTableHeaderCell>
                    <CTableDataCell className="font-small-size-data">
                      {caseValue && caseValue?.ra_branch?.name ? caseValue?.ra_branch?.name : '-'}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => props.setshowMessage(false)}>
              Close
            </CButton>
            {/* <CButton color="primary">Save changes</CButton> */}
          </CModalFooter>
        </CModal>
      </>
    )
  }
  