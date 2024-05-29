import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CCardImage,
  CFormInput,
  CCardHeader,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { cilPaperPlane } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import BasicProvider from 'src/constants/BasicProvider'

const TiedUp = (props) => {
  const { visible, close, handleTiedUp } = props
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setShow(false)
  }, [])

  const handleClose = () => {
    setShow(false)
    props.close()
  }

  return (
    <>
      <CModal alignment="center" visible={visible} className="delete_item_box">
        <CModalBody className="text-center mt-4">
          <div className="logo_x m-auto mb-3">x</div>
          <span>Are you sure you want to Tied UP</span>
        </CModalBody>

        <CModalFooter className="model_footer justify-content-center mb-3 pt-0">
          <CButton
            onClick={() => {
              handleTiedUp()
              handleClose()
            }}
            className="delete_btn model_btn"
            color="danger"
          >
            Yes
          </CButton>
          <CButton className="close_btn model_btn" color="secondary" onClick={handleClose}>
            No, cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default TiedUp
