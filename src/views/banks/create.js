import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { cilPencil, cilSpreadsheet, cilTrash } from '@coreui/icons'
import SubHeader from 'src/components/custom/SubHeader'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CContainer,
  CFormLabel,
  CInputGroup,
  CRow,
  CFormSelect,
} from '@coreui/react'
import handleSubmitHelper from 'src/helpers/submitHelper'
import BasicProvider from 'src/constants/BasicProvider'
import { useEffectFormData } from 'src/helpers/formHelpers'
import { setAlertTimeout } from 'src/helpers/alertHelper'
import ImagePreview from 'src/components/custom/ImagePreview'
import { ImageHelper } from 'src/helpers/imageHelper'
import Draggable from 'react-draggable'
import PdfPreview from 'src/components/PdfPreview'
import AsyncSelect from 'react-select/async'

import { data } from './data'
import { COO_Fields } from './CooJson'
import { FE_Fields } from './FeJson'

var subHeaderItems = [
  {
    name: 'All Banks',
    link: '/bank/all',
    icon: cilSpreadsheet,
  },
  {
    name: 'Create Bank',
    link: '/bank/create',
    icon: cilPencil,
  },
  {
    name: 'Trash Banks',
    link: '/bank/trash',
    icon: cilTrash,
  },
]

const validationRules = {
  name: {
    required: true,
  },
}

const Create = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const id = params.id
  const isEditMode = !!id

  let commonJson = data[0].fields

  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [fieldsPerPage, setFieldsPerPage] = useState({})
  const [boxes, setBoxes] = useState([])

  const [selectedRole, setSelectedRole] = useState('')

  const [defaultOptions, setDefaultOptions] = useState([])

  const [defaultOptionsFinanceName, setDefaultOptionsFinanceName] = useState([])

  const [additionalFields, setAdditionalFields] = useState([])

  // console.log('Boxes Cordinates', boxes)

  const [selectedFields, setSelectedFields] = useState([])

  const [initialValues, setInitialValues] = useState({
    name: '',
    module: 'banks',
    featured_image: '',
    finance_type: '',
    images_page_no: '',
    fields: [],
    selected_fields: [],
  })

  console.log('INIT', initialValues)

  useEffect(() => {
    setInitialValues({
      name: '',
      module: 'banks',
      featured_image: '',
      finance_type: '',
      images_page_no: '',
      fields: [],
      selected_fields: [],
    })

    setSelectedFields([])
    setBoxes([])
  }, [navigate])

  useEffect(() => {
    setInitialValues((prev) => ({ ...prev, fields: boxes, selected_fields: selectedFields }))
  }, [boxes, selectedFields])

  useEffect(() => {
    defaultOptionsSetup()
  }, [selectedRole])

  const defaultOptionsSetup = async () => {
    try {
      if (selectedRole === 'coo') {
        const options = COO_Fields.map((item) => ({
          label: item.key,
          value: item.key,
          type: item.type,
          role: item.role,
        }))

        setDefaultOptions(options)
      } else if (selectedRole === 'fe') {
        const options = FE_Fields.map((item) => ({
          label: item.key,
          value: item.key,
          type: item.type,
          role: item.role,
        }))

        setDefaultOptions(options)
      } else if (selectedRole === 'dm') {
        const options = commonJson
          .filter((item) => item.role === 'DM')
          .map((item) => ({
            label: item.key,
            value: item.key,
            type: item.type,
            role: item.role,
          }))

        setDefaultOptions(options)
      } else if (selectedRole === 'additional fields') {
        const options = additionalFields?.map((item) => ({
          label: item.key,
          value: item.key,
          type: item.type,
          role: item.role,
        }))

        setDefaultOptions(options)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDrag = (e, data, index) => {
    setBoxes((prevBoxes) => {
      const newBoxes = [...prevBoxes]
      newBoxes[index] = {
        ...newBoxes[index],
        left: data.x,
        top: data.y,
        page: pageNumber,
        role: selectedRole,
      }
      return newBoxes
    })
  }

  const handleStop = (e, data, index) => {
    setBoxes((prevBoxes) => {
      const newBoxes = [...prevBoxes]
      newBoxes[index] = {
        ...newBoxes[index],
        left: data.x,
        top: data.y,
        page: pageNumber,
        role: selectedRole,
      }
      return newBoxes
    })
  }

  const handleAsyncSelectChange = (selectedOptions) => {
    setSelectedFields(selectedOptions)
  }

  useEffect(() => {
    const newFieldsPerPage = boxes.filter((box) => box.page === pageNumber)
    setFieldsPerPage(newFieldsPerPage)
  }, [pageNumber, boxes])

  useEffect(() => {
    setBoxes((prevBoxes) => {
      const newBoxes = [...prevBoxes]

      // Remove fields that are not in selectedFields
      newBoxes.forEach((box, index) => {
        const exists = selectedFields.some((field) => field.label === box.title)
        if (!exists) {
          newBoxes.splice(index, 1)
        }
      })

      // Add new fields from selectedFields
      selectedFields.forEach((field) => {
        const existingIndex = newBoxes.findIndex((box) => box.title === field.label)
        if (existingIndex === -1) {
          newBoxes.push({
            top: 0,
            left: 0,
            title: field.label,
            page: pageNumber,
          })
        }
      })

      return newBoxes
    })
  }, [selectedFields, pageNumber])

  useEffect(() => {
    fetchData()
    fetchSingleData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await useEffectFormData(`banks/show/${id}`, initialValues, isEditMode)
      console.log('Bank DATA============', data)
      if (isEditMode) {
        setInitialValues({ ...data })
        setBoxes(data.fields)
        setSelectedFields(data.selected_fields)
        setAdditionalFields(data.additional_keys)
      }
    } catch (error) {
      dispatch({ type: 'set', catcherror: error.data })
    }
  }

  const fetchSingleData = async () => {
    try {
      const response = await new BasicProvider(`banks/show/${id}`).getRequest()
      // console.log('DATA============', data)
      if (isEditMode) {
        setAdditionalFields(response.data.additional_keys)
      }
    } catch (error) {
      dispatch({ type: 'set', catcherror: error.data })
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setInitialValues({ ...initialValues, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return

      let response
      if (isEditMode) {
        response = await new BasicProvider(`banks/update/${id}`, dispatch).patchRequest(data)
      } else {
        response = await new BasicProvider(`banks/create`, dispatch).postRequest(data)
        navigate(`/bank/${response.data._id}/edit`)
      }
      setAlertTimeout(dispatch)
    } catch (error) {
      console.log(error)
      dispatch({ type: 'set', validations: [error.data] })
    }
  }

  const fileOnchangeHandler = async (e) => {
    const file = ImageHelper(e, 'previewImage')
    setInitialValues({ ...initialValues, featured_image: file[0] })
    const formData = new FormData()
    formData.append('featured_image', file[0])
  }

  const loadOptions = (inputValue, callback) => {
    const availableOptions = defaultOptions.filter(
      (option) =>
        !Object.values(boxes).find((box) => box.title === option.label && box.page === pageNumber),
    )

    setTimeout(() => {
      const filteredOptions = availableOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
      )
      callback(filteredOptions)
    }, 1000)
  }

  const loadOptionsFinanceName = async (inputValue, callback) => {
    try {
      const response = await new BasicProvider(
        `cms/categories/search-perent/finance_type?search=${inputValue}&count=20`,
      ).getRequest()
      const options = response.data.data.map((finance) => ({
        label: finance.name,
        value: finance._id,
      }))
      callback(options)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDefaultOptionsFinanceName()
  }, [])

  const fetchDefaultOptionsFinanceName = async () => {
    try {
      const response = await new BasicProvider(
        'cms/categories/get-first-parent/finance_type',
      ).getRequest()
      const options = response.data.data.map((finance) => ({
        label: finance.name,
        value: finance._id,
      }))

      setDefaultOptionsFinanceName(options)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <SubHeader subHeaderItems={subHeaderItems} />
      <CContainer fluid>
        <>
          <CRow className="form-input-block">
            <CCol>
              <CCard>
                <CCardHeader>Bank details</CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={6}>
                      <CFormLabel>
                        Finance Name<span className="text-danger">*</span>
                      </CFormLabel>
                      <CInputGroup className="has-validation">
                        <input
                          type="text"
                          name="name"
                          value={initialValues.name ?? ''}
                          className="form-control"
                          placeholder="Enter finance name "
                          onChange={handleOnChange}
                        />
                      </CInputGroup>
                    </CCol>

                    <CCol md={6}>
                      <div className="">
                        <CFormLabel>
                          Finance Type
                          <span className="text-danger">*</span>
                        </CFormLabel>
                        <AsyncSelect
                          name="finance_type"
                          loadOptions={(inputValue, callback) =>
                            loadOptionsFinanceName(inputValue, callback)
                          }
                          defaultOptions={defaultOptionsFinanceName}
                          value={
                            defaultOptionsFinanceName.find(
                              (option) =>
                                option.value ===
                                (initialValues?.finance_type?._id || initialValues.finance_type),
                            ) || null
                          }
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.value}
                          onChange={(selected) =>
                            setInitialValues({ ...initialValues, finance_type: selected.value })
                          }
                        />
                      </div>
                    </CCol>
                  </CRow>
                  <CRow>
                    {!isEditMode && (
                      <CCol md={4}>
                        <div>
                          <CFormLabel>Upload File</CFormLabel>
                          <CFormInput
                            id="image"
                            type="file"
                            accept="image/*, video/*, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            ref={fileInputRef}
                            onChange={fileOnchangeHandler}
                          />
                        </div>
                      </CCol>
                    )}
                    <CCol md={isEditMode ? 6 : 4}>
                      <CFormLabel>
                        Images Page Number<span className="text-danger">*</span>
                      </CFormLabel>
                      <CInputGroup className="has-validation">
                        <input
                          type="number"
                          name="images_page_no"
                          value={initialValues.images_page_no ?? ''}
                          className="form-control"
                          placeholder="Enter Images Page "
                          onChange={handleOnChange}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={isEditMode ? 6 : 4}>
                      <div>
                        <CFormLabel>Select Role</CFormLabel>
                        <CFormSelect
                          aria-label=""
                          options={[
                            'Select Role for Fields',
                            { label: 'COO', value: 'coo' },
                            { label: 'FE', value: 'fe' },
                            { label: 'DM', value: 'dm' },
                            { label: 'Additional Fieles', value: 'additional fields' },
                          ]}
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                        />
                      </div>
                    </CCol>
                  </CRow>
                  {(isEditMode ? isEditMode : !isEditMode && selectedRole) && (
                    <CRow className="mb-4 select_field_drpdwn">
                      <CFormLabel>Select Fields</CFormLabel>
                      <AsyncSelect
                        placeholder="Select Fields"
                        loadOptions={loadOptions}
                        defaultOptions={defaultOptions}
                        isMulti={true}
                        isClearable={false}
                        isSearchable
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        onChange={handleAsyncSelectChange}
                        value={selectedFields}
                      />
                    </CRow>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol md={12}>
              <CCard>
                <CCardHeader>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">Report Builder</div>
                    <p className="m-0">
                      {numPages > 0 && (
                        <div className="text-center ">
                          <button
                            className="btn btn-secondary me-2"
                            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                          >
                            Prev
                          </button>
                          <span>
                            {pageNumber} / {numPages}
                          </span>

                          <button
                            className="btn btn-secondary ms-2"
                            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </p>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={3} style={{ overflow: 'hidden', clear: 'both' }}></CCol>
                    <CCol md={12}>
                      <div
                        style={{
                          width: '100%',
                          height: 800,
                          border: '1px solid black',
                          position: 'relative',
                          overflow: 'auto',
                          zIndex: '999',
                        }}
                      >
                        {/* <div
                          style={{
                            position: 'relative',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: '999',
                          }}
                        > */}
                        {Object.keys(boxes)
                          .filter((key) => boxes[key].page === pageNumber)
                          .map((key) => {
                            const { left, top, title } = boxes[key]
                            return (
                              <Draggable
                                key={key}
                                defaultPosition={{ x: 0, y: 0 }}
                                position={{ x: left, y: top }}
                                onDrag={(e, data) => handleDrag(e, data, key)}
                                onStop={(e, data) => handleStop(e, data, key)}
                              >
                                <div
                                  style={{
                                    border: '1px dashed #fff',
                                    padding: 5,
                                    backgroundColor: '#0a1857',
                                    fontSize: '0.695rem',
                                    color: '#fff',
                                    width: 'max-content',
                                    zIndex: '999',
                                    maxWidth: '12%',
                                    position: 'absolute',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {title}
                                </div>
                              </Draggable>
                            )
                          })}
                        {/* </div> */}
                        <PdfPreview
                          numPages={numPages}
                          pageNumber={pageNumber}
                          setNumPages={setNumPages}
                        />
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol md={12}>
              <CCard>
                <CCardBody className="text-center">
                  {!isEditMode && (
                    <CButton
                      className="btn btn-primary me-2  submit_btn"
                      type="submit"
                      name="buttonClicked"
                      value="submit"
                      onClick={handleSubmit}
                    >
                      Submit
                    </CButton>
                  )}

                  {isEditMode && (
                    <CButton
                      className="btn btn-secondary me-2                      "
                      type="submit"
                      name="buttonClicked"
                      value="update"
                      onClick={handleSubmit}
                    >
                      Update
                    </CButton>
                  )}

                  <CButton
                    color="danger"
                    className="text-light"
                    onClick={() => {
                      setInitialValues({})
                      navigate('/rabranch/all')
                    }}
                  >
                    Cancel
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      </CContainer>
    </>
  )
}

export default Create
