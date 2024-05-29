import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import AsyncSelect from 'react-select/async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CRow,
} from '@coreui/react'

import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import BasicProvider from 'src/constants/BasicProvider'
import handleSubmitHelper from 'src/helpers/submitHelper'
import { data } from 'src/views/banks/data'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilShieldAlt } from '@coreui/icons'
import { faCheck, faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons'

let json = data[0].fields

// console.log("mainJson========================",json);

const DmForm = ({
  initialValues,
  setInitialValues,
  handleSubmit,
  showCaseData,
  additionalFields,
  setAdditionalFields,
  additionalJson,
  setAdditionalJson,
  beforSubmitError,
  setBeforSubmitError,
  fetchData,
  fetchSHowCaseData,

}) => {
  let loggedinUserRole = useSelector((state) => state?.userRole)

  var params = useParams()
  var dispatch = useDispatch()
  const navigate = useNavigate()
  const id = params.id
  const isEditMode = !!id

  const [dmFields, setDmFields] = useState([])

  const [defaultOptionRC, setDefaultOptionRC] = useState([])

  const [dmJson, setDmJson] = useState({})

  const [isAssignRC, setIsAssignRC] = useState(false)

  useEffect(() => {
    setDmJson(initialValues.dm_fields)
  }, [initialValues.dm_fields])


  // useEffect(() => {
  //   const initialFormData = {};
  //   dmFields.forEach((field) => {
  //     initialFormData[field.key] = '';
  //   });
  //   setDmJson(initialFormData);
  // }, [dmFields, initialValues]);


  useEffect(() => {
    const initialFormData = {}
    dmFields.forEach((field) => {
      initialFormData[field.key] = dmJson[field.key] || ''
    })
    setDmJson(initialFormData)
  }, [])

  console.log('additionalJson----------------------->', additionalJson)

  const renderField = (field) => {
    // console.log("=============== here",field);
    const fieldName = field.key
    const fieldValue = dmJson && dmJson ? dmJson[fieldName] : ''

    switch (field.type) {
      case 'text':
        return (
          <CFormInput
            type="text"
            name={fieldName}
            autoComplete="off"
            value={fieldValue}
            onChange={(e) => {
              const key = field.key
              const value = e.target.value
              setDmJson((prevFormData) => ({
                ...prevFormData,
                [key]: value,
              }))
            }}
          />
        )
      case 'select':
        return (
          <CFormSelect
            name={fieldName}
            value={fieldValue}
            onChange={(e) => {
              const key = field.key
              const value = e.target.value
              setDmJson((prevFormData) => ({
                ...prevFormData,
                [key]: value,
              }))
            }}
          >
            {field?.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </CFormSelect>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    fetchDefaultOptionForRC()
  }, [])

  const fetchDefaultOptionForRC = async () => {
    try {
      const response = await new BasicProvider(
        `admins/get-by-roll/${process.env.REACT_APP_RC}`,
      ).getRequest()
      const options = response.data.data.map((item) => ({
        label: item.name,
        value: item._id,
      }))
      setDefaultOptionRC(options)
    } catch (error) {
      console.error(error)
    }
  }

  const loadOptionsForRC = async (inputValue, callback) => {
    try {
      const response = await new BasicProvider(
        `admins/get-by-roll/${process.env.REACT_APP_RC}?page=1&count=12&search=${inputValue}`,
      ).getRequest()
      const options = response.data.data.map((item) => ({
        label: item.name,
        value: item._id,
      }))
      callback(options)
    } catch (error) {
      console.error(error)
    }
  }

  // const renderAdditonalFields = (field) => {
  //   const fieldName = field.key
  //   const fieldValue = additionalJson && additionalJson ? additionalJson[fieldName] : ''

  //   // const fieldValue = ''

  //   switch (field.type) {
  //     case 'text':
  //       return (
  //         <CFormInput
  //           type="text"
  //           name={fieldName}
  //           autoComplete="off"
  //           value={fieldValue}
  //           placeholder="Enter Value"
  //           onChange={(e) => {
  //             const key = field?.key
  //             const value = e.target.value
  //             setAdditionalJson((prevFormData) => ({
  //               ...prevFormData,
  //               [key]: value,
  //             }))
  //           }}
  //         />
  //       )

  //     case 'select':
  //       return (
  //         <CFormSelect
  //           name={fieldName}
  //           value={fieldValue}
  //           placeholder="Select one "
  //           onChange={(e) => {
  //             const key = field?.key
  //             const value = e.target.value
  //             setAdditionalJson((prevFormData) => ({
  //               ...prevFormData,
  //               [key]: value,
  //             }))
  //           }}
  //         >
  //           {/* <option>{`Select ${fieldName}`}</option> */}
  //           {field?.options.map((option) => (
  //             <>
  //               <option key={option} value={option}>
  //                 {option}
  //               </option>
  //             </>
  //           ))}
  //         </CFormSelect>
  //       )
  //     default:
  //       return null
  //   }
  // }

  const renderAdditonalFields = (field) => {
    const fieldName = field.key
    const role = field?.role

    const additionalJsonArray = Array.isArray(additionalJson) ? additionalJson : []
    const objectIndex = additionalJsonArray.findIndex((obj) => obj.role === role)
    const fieldValue = objectIndex >= 0 ? additionalJsonArray[objectIndex][fieldName] : ''

    const updateFieldValue = (key, value) => {
      setAdditionalJson((prevFormData) => {
        const prevFormDataArray = Array.isArray(prevFormData) ? prevFormData : []

        const newFormData = [...prevFormDataArray]

        if (objectIndex >= 0) {
          newFormData[objectIndex] = {
            ...newFormData[objectIndex],
            [key]: value,
          }
        } else {
          newFormData.push({
            role: role,
            [key]: value,
          })
        }

        return newFormData
      })
    }

    switch (field.type) {
      case 'text':
        return (
          <CFormInput
            type="text"
            name={fieldName}
            autoComplete="off"
            value={fieldValue}
            onChange={(e) => updateFieldValue(fieldName, e.target.value)}
          />
        )
      case 'select':
        return (
          <CFormSelect
            name={fieldName}
            value={fieldValue}
            onChange={(e) => updateFieldValue(fieldName, e.target.value)}
          >
            {field?.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </CFormSelect>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setBeforSubmitError('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [beforSubmitError])

  // console.log('showCaseData?.dm_fields', showCaseData?.dm_fields)

  const updatedFinance = showCaseData?.finance_name?.fields?.map((item) => {
    const matchedData = Object.entries(showCaseData).find(([key, value]) => item.title === key)
    if (matchedData) {
      item.value = matchedData[1]
    } else {
      item.value = ''
    }

    return item
  })

  const generateReport = async () => {
    console.log('showCaseData', showCaseData)
    if (showCaseData && showCaseData?.finance_name) {
      let fullUrl = `${process.env.REACT_APP_NODE_URL}/${showCaseData?.finance_name?.featured_image?.filepath}`
      let json = {
        pdf_url: fullUrl,
        data: updatedFinance,
        images: initialValues.fe_images_data,
        images_2: initialValues.dm_images_data,
        page: showCaseData?.finance_name?.images_page_no,
        addon_data: showCaseData.case_addons,
      }

      try {
        let response = await new BasicProvider('cases/genrate/report').postRequest(json)
        if (response && response.data) {
          let url = response.data.file_url

          if (url) window.open(url, '_blank')
        }
      } catch (error) {
        console.error('Error generating report:', error)
      }
    }
  }

  
  let dmData = showCaseData?.additionalJson?.filter((item) => item.role == 'COO') || []
  console.log('dmData', dmData)







  return (
    <>
      <CForm
        className="g-3 needs-validation mb-3 coo-form mt-4"
        onSubmit={async (e) => {
          console.log('Assign form !!!!!!!!!')
          if (
            showCaseData &&
            Object.keys(showCaseData).length > 0 &&
            typeof showCaseData.fe_images_data === 'object' &&
            Object.keys(showCaseData.fe_images_data).length > 0 &&
            typeof showCaseData.dm_fields === 'object' &&
            Object.keys(showCaseData.dm_fields).length > 0 &&
            showCaseData.dm_fields
          ) {
            initialValues.status = 'pending for rc'
            initialValues.dm_fields = dmJson
            initialValues.additional_fields = additionalJson
            await handleSubmit(e)
          } else {
            console.log('only updated form !!!!')
            initialValues.dm_fields = dmJson
            initialValues.additional_fields = additionalJson
            await handleSubmit(e)
          }

          await fetchData()
          await fetchSHowCaseData()
        }}
      >
        <CRow className="form-input-block">
          <CCol>
            <CCard>
              <CCardHeader>DM Case Details</CCardHeader>
              <CCardBody>
                <CRow className="mt-4">
                  {dmFields.map((field, index) => (
                    <CCol md={3} key={index}>
                      <div className="mb-3">
                        <CFormLabel>{field.key}</CFormLabel>
                        {renderField(field)}
                      </div>
                    </CCol>
                  ))}
                </CRow>

                {additionalFields &&
                  additionalFields?.filter((item) => item.role === 'DM').length > 0 && (
                    <>
                      <CRow>
                        <CCol>
                          {/* <h5 className="mt-3">Additional Fields</h5> */}

                          <CRow className="mt-4">
                            {additionalFields &&
                              additionalFields
                                .filter((item) => item.role === 'DM')
                                .map((field, index) => (
                                  <CCol md={3} key={index}>
                                    <div className="mb-3">
                                      <CFormLabel>{field.key}</CFormLabel>
                                      {renderAdditonalFields(field)}
                                    </div>
                                  </CCol>
                                ))}
                          </CRow>
                        </CCol>
                      </CRow>
                    </>
                  )}

                {showCaseData &&
                  Object.keys(showCaseData).length > 0 &&
                  typeof showCaseData.fe_images_data === 'object' &&
                  Object.keys(showCaseData.fe_images_data).length > 0 &&
                  typeof showCaseData.dm_fields === 'object' && (
                    <div>
                      <CRow className="justify-content-center">
                        <CCol md={3}>
                          <CCard
                            onClick={generateReport}
                            className="mt-3 mb-3 py-2 pb-2 px-2 text-center submit_btn report_generate_btn"
                          >
                            <div className="mb-1">
                              <FontAwesomeIcon icon={faEye} /> Report Preview
                            </div>
                          </CCard>
                        </CCol>

                        <CCol md={3}>
                          <CCard
                            className="mt-3 mb-3 py-2 pb-2 px-2 text-center submit_btn report_generate_btn"
                            onClick={() => setIsAssignRC(!isAssignRC)}
                          >
                            <div className="mb-1">
                              <FontAwesomeIcon icon={faCheck} /> Assign to RC
                            </div>
                          </CCard>
                        </CCol>
                      </CRow>
                    </div>
                  )}

                {isAssignRC &&
                  showCaseData &&
                  Object.keys(showCaseData).length > 0 &&
                  typeof showCaseData.fe_images_data === 'object' &&
                  Object.keys(showCaseData.fe_images_data).length > 0 && (
                    <CRow className="d-flex align-items-center mt-4">
                      <CCol md={2} className="mb-lg-3 pe-0">
                        <CFormLabel className="fs-6">Select RC To Assign :</CFormLabel>
                      </CCol>
                      <CCol md={4} className="px-0">
                        <div className="mb-3 fi_type">
                          <AsyncSelect
                            name="rc"
                            loadOptions={(inputValue, callback) =>
                              loadOptionsForRC(inputValue, callback)
                            }
                            defaultOptions={defaultOptionRC}
                            value={
                              defaultOptionRC.find(
                                (option) =>
                                  option.value === (initialValues?.rc?._id || initialValues.rc),
                              ) || null
                            }
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            onChange={(selected) =>
                              setInitialValues({ ...initialValues, rc: selected.value })
                            }
                          />
                        </div>
                      </CCol>
                    </CRow>
                  )}

                {beforSubmitError && (
                  <>
                    <small className="text-danger">{beforSubmitError}</small>
                  </>
                )}

                <CRow className="mt-4">
                  <CCol md={12}>
                    <CCardBody className="text-center">
                      {isEditMode && (
                        <CButton
                          className="btn btn-secondary me-2 "
                          type="submit"
                          name="buttonClicked"
                          value="update"
                        >
                          {showCaseData &&
                          Object.keys(showCaseData).length > 0 &&
                          typeof showCaseData.fe_images_data === 'object' &&
                          Object.keys(showCaseData.fe_images_data).length > 0 &&
                          additionalJson &&
                          additionalJson.length > 0 ? (
                            <>
                              {loggedinUserRole.name === process.env.REACT_APP_DM ? (
                                <>Assign Case</>
                              ) : (
                                <>Update</>
                              )}
                            </>
                          ) : (
                            <>Submit</>
                          )}
                        </CButton>
                      )}

                      <CButton
                        color="danger"
                        className="text-light"
                        onClick={() => {
                          if (loggedinUserRole.name === process.env.REACT_APP_DM) {
                            setDmJson({})
                            navigate('/case/all')
                          } else if (loggedinUserRole.name === process.env.REACT_APP_RC) {
                            navigate(
                              `/case/${id}/update/dm-details-show/by/${loggedinUserRole.name}`,
                              {
                                state: { toggleDMForm: false },
                              },
                            )
                          }
                        }}
                      >
                        Cancel
                      </CButton>
                    </CCardBody>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default DmForm
