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
  CFormTextarea,
  CFormSelect,
} from '@coreui/react'
import { cilPaperPlane } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import BasicProvider from 'src/constants/BasicProvider'

import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'

const Concern = (props) => {
  const { visible, close, caseId } = props
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [getdata, setGetData] = useState('')
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [message, setMessage] = useState('')
  const [hasSelection, setHasSelection] = useState(false)

  // const [message, setMessage] = useState('')

  const token = Cookies.get(`${process.env.REACT_APP_COOKIE_PREFIX}_auth`)
  var decoded = jwtDecode(token)

  useEffect(() => {
    setShow(false)
    fetchData()
  }, [])

  // const handleClose = () => {
  //   close()
  // }

  // const fetchData = async() => {
  //   const respone = await new BasicProvider('templates ').getRequest()
  //   console.log("conern dropdown data",respone.data.data);

  // }

  const fetchData = async () => {
    try {
      const response = await new BasicProvider('templates').getRequest()
      const options = response.data.data
      const optionsData = options.map((item) => ({
        value: item._id,
        label: item.subject,
        message: item.message,
      }))
      console.log('otpion data', optionsData)
      setOptions([{ value: '', label: 'Select an option', disabled: true }, ...optionsData])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }


  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    const selectedOption = options.find((option) => option.value === selectedValue)

    setSelectedOption(selectedOption)
    console.log('selected value', selectedValue)

    if (selectedOption) {
      setMessage(selectedOption.message)
    } else {
      setMessage('')
    }
  }

  console.log('seleted value', selectedOption)
  const handleConcern = async () => {
    try {
      // let json = {
      //   case_id: caseId,
      //   user_id: decoded._id,
      //   message: message,
      //   type: 'fe call',
      //   role_id: decoded.role,
      // }
      
      let response = await new BasicProvider(`cases/update/${caseId}`, dispatch).patchRequest({
        status: 'concern by fe',
        message:message,
        type: 'fe call',
      })

      if (response) {
        // let response = await new BasicProvider(`case-update-logs/create`, dispatch).postRequest(json)
        if (response) {
          setMessage('')
        }
        
        close()

      }


    } catch (error) {
      console.log('error', error)
    }
  }

  console.log('show selected user message', message)
  return (
    <>
      <CModal
        alignment="center"
        visible={visible}
        // onClose={() => setVisibleConcernModel(false)}
        className="delete_item_box"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Reason For Concern</CModalTitle>
        </CModalHeader>

        {/* <CModalBody>
          <CFormSelect aria-label="Default select example" options={options} />
          <CFormTextarea
          className='mt-2'
            placeholder="Leave a comment here"
            id="floatingTextarea2"
            style={{ height: '100px' }}
            value={message ?? ''}
            onChange={(e) => setMessage(e.target.value)}
          ></CFormTextarea>
        </CModalBody> */}
        <CModalBody>
          <CFormSelect
            aria-label="Default select example"
            options={options}
            onChange={handleSelectChange}
            value={selectedOption ? selectedOption.value : ''}
            placeholder="select your"
          />
          <CFormTextarea
            className="mt-2"
            placeholder="Leave a comment here"
            id="floatingTextarea2"
            style={{ height: '100px' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></CFormTextarea>
        </CModalBody>

        <CModalFooter>
          <CButton onClick={handleConcern} color="danger" className="text-white">
            Submit
          </CButton>
          <CButton className="close_btn model_btn" color="secondary" onClick={close}>
            No, cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Concern
