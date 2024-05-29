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


const GenrateWithAi = (props) => {
  const { activeUser } = props
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [report, setReport] = useState({
    message: '',
    to_customer_id: '',
  })

  useEffect(() => {
    setShow(false)
  }, [])

  const handleClose = () => {
    setShow(false)
    props.closeShortDecsMOdel()
  }

    const handleSubmit = async () => {
      setShow(true)
    return
    try {
      const response = await new BasicProvider(`public/report/create`).postRequest(report)
    } catch (error) {
      console.log(error)
    }
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
          size="lg"
        >
          <CModalHeader>
            <CModalTitle id="ToggleBetweenModalsExample1">Generate with AI.</CModalTitle>
          </CModalHeader>
          <CModalBody className="bg-theme b-0 ">
            <div className="report_user_Select mx-2 my-3">
              <CFormLabel className="white">Enter prompt here</CFormLabel>
              <div className="d-flex align-items-center gap-3">
                <CFormInput
                  id="floatingInput"
                  onChange={(event) => {
                    setReport({ ...report, message: event.target.value })
                  }}
                  placeholder='Type...'
                />
                <CButton className="btn-default btn-lg" onClick={handleSubmit}>
                  <CIcon icon={cilPaperPlane} size="lg" />
                </CButton>
              </div>
            </div>

            {show && (
              <CCard className="mt-4">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  Response
                </CCardHeader>
                <CCardBody>
                  In this regard, the Institute of Chartered Accountants of India (ICAI) has been
                  taking various initiatives from time to time to streamline and sustain the efforts
                  in providing effective articleship. Currently, the total period of articleship is
                  three years after clearing Group 1 of CA Intermediate Course.
                </CCardBody>
              </CCard>
            )}
          </CModalBody>
          {show && (
            <CModalFooter>
              <CButton color="primary" className=''>Insert</CButton>
            </CModalFooter>
          )}
        </CModal>
      
    </>
  )
}

export default GenrateWithAi




























// import React, { useEffect, useRef, useState } from 'react'
// // import { Formik, Form, Field, ErrorMessage } from 'formik'
// // import * as Yup from 'yup'
// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCol,
//   CContainer,
//   CFormCheck,
//   CFormInput,
//   CFormLabel,
//   CInputGroup,
//   CInputGroupText,
//   CRow,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CCardImage,
//   CFormTextarea,
//   CCardHeader,
// } from '@coreui/react'

// import 'react-datepicker/dist/react-datepicker.css'
// import { faGraduationCap, faShield } from '@fortawesome/free-solid-svg-icons'
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import CIcon from '@coreui/icons-react'
// import { useNavigate } from 'react-router-dom'

// import { cilArrowRight, cilCheck, cilChevronRight, cilPaperPlane } from '@coreui/icons'
// import BasicProvider from 'src/constants/BasicProvider'

// const GenrateWithAi = (props) => {
//   const { activeUser } = props

//   // console.log('Lastuser>>', activeUser)

//   const navigate = useNavigate()
//   const [report, setReport] = useState({
//     message: '',
//     to_customer_id: '',
//   })

//   useEffect(() => {
//     setReport({ ...report, to_customer_id: activeUser?._id || activeUser?.id })
//   }, [activeUser])

//   const handleSubmit = async () => {
//     return
//     try {
//       const response = await new BasicProvider(`public/report/create`).postRequest(report)
//       // console.log('ReportRes', report)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   return (
//     <>
//       <div className="more_then_mates_Customer ">
//         <CModal
//           alignment="center"
//           scrollable
//           visible={props.visible}
//           onClose={props.closeShortDecsMOdel}
//           aria-labelledby="VerticallyCenteredScrollableExample"
//           className="model_show"
//           // size="lg"
//         >
//           <CModalBody className="bg-theme b-0 ">
//             <div className="d-flex justify-content-between align-items-center">
//               <div> Can AI helps you to generate content for this ?</div>
//               <CButton
//                 className="bg-transparent primary f-6 text-primary"
//                 onClick={props.closeShortDecsMOdel}
//               >
//                 Cancel
//               </CButton>
//             </div>

//             {/*
//             <div className="text-center disable-hover my-3">
//               <h5 className="white">Report someone</h5>
//             </div> */}
//             {/* <div className="my-3 p-3">
//               <h6 className="white text-center mb-0">
//                 Can AI helps you to generate content for this ?
//               </h6>
//             </div> */}

//             <div className="report_user_Select mx-2 my-3 py-2">
//               {/* <CButton className={`report_img ${noMatched ? 'active' : ''}`} onClick={getMatched}>
//                 <CRow className="align-items-center">
//                   <CCol md={3}>
//                     <div className={`default_img w-70 m-auto ${noMatched ? 'img-active' : ''}`}>
//                       <img src={Profile} className={`w-100 ${noMatched ? 'img-active' : ''}`} />
//                     </div>
//                   </CCol>
//                   <CCol md={9}>
//                     <div className="whtie text-start bb d-flex justify-content-between ">
//                       <p className="mb-4"> Someone I’m no longer matched with</p>

//                       {noMatched && <CIcon icon={cilCheck} className="me-2 primary" />}
//                     </div>
//                   </CCol>
//                 </CRow>
//               </CButton> */}
//               <CFormLabel className="white">Enter prompt here</CFormLabel>
//               <CFormTextarea
//                 id="floatingTextarea"
//                 onChange={(event) => {
//                   setReport({ ...report, message: event.target.value })
//                 }}
//               ></CFormTextarea>
//             </div>

//             <div className="save text-center">
//               <CButton className="btn-default w-100" onClick={handleSubmit}>
//                 <CIcon icon={cilPaperPlane} />
//                 {'  '}
//                 Submit
//                 {/* <CIcon icon={cilPaperPlane} style={{ transform: 'rotate(0deg)' }} /> */}
//               </CButton>
//             </div>

//             <>
//               <CCard className="mt-4">
//                 <CCardHeader className="d-flex justify-content-between align-items-center">
//                   Response
//                   <div>Insert</div>
//                 </CCardHeader>
//                 <CCardBody>
//                   In this regard, the Institute of Chartered Accountants of India (ICAI) has been
//                   taking various initiatives from time to time to streamline and sustain the efforts
//                   in providing effective articleship. Currently, the total period of articleship is
//                   three years after clearing Group 1 of CA Intermediate Course.
//                 </CCardBody>
//               </CCard>
//             </>
//           </CModalBody>
//         </CModal>
//       </div>
//     </>
//   )
// }
// export default GenrateWithAi
