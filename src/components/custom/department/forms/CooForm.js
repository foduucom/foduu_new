import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import AsyncSelect from 'react-select/async'

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

const CooForm = ({
  initialValues,
  setInitialValues,
  handleSubmit,
  additionalFields,
  setAdditionalFields,
  additionalJson,
  setAdditionalJson,
}) => {
  var params = useParams()
  var dispatch = useDispatch()
  const navigate = useNavigate()
  const id = params.id
  const isEditMode = !!id

  const [defaultOptionsFinanceName, setDefaultOptionsFinanceName] = useState([])
  const [defaultOptionsFinanceNameChild, setDefaultOptionsFinanceNameChild] = useState([])

  const [defaultOptionsRaBranch, setDefaultOptionsRaBranch] = useState([])
  const [defaultOptionsCaseType, setefaultOptionsCaseType] = useState([])

  const [defaultOptionsGroup, setDefaultOptionsGroup] = useState([])

  const [defaultOptionsEngList, setDefaultOptionsEngList] = useState([])

  const [perentFinanceId, setPerentFinanceId] = useState(null)

  const [isEngineerList, setIsEngineerList] = useState(false)

  const [allButtonNavigation, setAllButtonNavigation] = useState('0')

  let loggedinUserRole = useSelector((state) => state?.userRole)

  useEffect(() => {
    if (process.env.REACT_APP_COO == loggedinUserRole.name) {
      setAllButtonNavigation('0')
    } else if (process.env.REACT_APP_SDM) {
      setAllButtonNavigation('1')
    }
  }, [loggedinUserRole, id])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setInitialValues({ ...initialValues, [name]: value })
  }

  const handleContactNumberChange = (value, contactNumberField) => {
    const sanitizedValue = value.replace(/\D/g, '')
    setInitialValues({ ...initialValues, [contactNumberField]: sanitizedValue })
  }

  const loadOptionsFinanceName = async (inputValue, callback) => {
    try {
      const response = await new BasicProvider(
        `cms/categories/search-perent/finance_type?search=${inputValue}&count=20`,
      ).getRequest()
      const options = response.data.data.map((role) => ({
        label: role.name,
        value: role._id,
      }))
      callback(options)
    } catch (error) {
      console.error(error)
    }
  }

  const loadOptionsFinanceNameChild = async (inputValue, callback) => {
    try {
      const response = await new BasicProvider(
        `banks/getby-type/${perentFinanceId}?search=${inputValue}&&count=20`,
      ).getRequest()
      const options = response.data.data.map((role) => ({
        label: role.name,
        value: role._id,
      }))
      callback(options)
    } catch (error) {
      console.error(error)
    }
  }

  const loadOptionsRaBranch = async (inputValue, callback) => {
    try {
      const response = await new BasicProvider(
        `cms/categories/search-perent/ra_branch?search=${inputValue}&count=20`,
      ).getRequest()
      const options = response.data.data.map((branch) => ({
        label: branch.name,
        value: branch._id,
      }))
      callback(options)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDefaultOptionsFinanceName()
    fetchDefaultOptionsRabranch()
    fetchDefaultOptionsCaseType()
    if (perentFinanceId || initialValues.finance_name_perent) {
      fetchDefaultOptionsFinanceNameChild()
    }
  }, [navigate, perentFinanceId, initialValues.finance_name_perent])

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

  const fetchDefaultOptionsFinanceNameChild = async () => {
    try {
      const response = await new BasicProvider(
        `banks/getby-type/${
          initialValues.finance_name_perent._id || initialValues.finance_name_perent
        }`,
      ).getRequest()
      const options = response.data.data.map((finance) => ({
        label: finance.name,
        value: finance._id,
      }))

      setDefaultOptionsFinanceNameChild(options)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDefaultOptionsRabranch = async () => {
    try {
      const response = await new BasicProvider('ra_branch').getRequest()
      const options = response.data.data.map((branch) => ({
        label: branch.name,
        value: branch._id,
      }))

      setDefaultOptionsRaBranch(options)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDefaultOptionsCaseType = async () => {
    try {
      const response = await new BasicProvider('cms/categories/tree/case types').getRequest()
      const options = response.data.data.map((type) => ({
        label: type.name,
        value: type._id,
      }))

      setefaultOptionsCaseType(options)
    } catch (error) {
      console.error(error)
    }
  }

  const loadOptionsGroup = async (inputValue, callback) => {
    try {
      const response = await new BasicProvider(
        `cms/categories/search?page=1&count=10&search=${inputValue}`,
      ).getRequest()

      const options = response.data.data.map((group) => ({
        label: group.display_name,
        value: group._id,
      }))
      callback(options)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleDefaultOptionsGroup()
  }, [])

  const handleDefaultOptionsGroup = async () => {
    try {
      const response = await new BasicProvider('cms/categories/tree/group').getRequest()
      const options = response.data.data.map((group) => ({
        label: group.name,
        value: group._id,
      }))
      setDefaultOptionsGroup(options)
    } catch (error) {
      console.error(error)
    }
  }

  const loadOptionsEngList = async (inputValue, callback) => {
    try {
      const response = await new BasicProvider(
        `admins/get-by-roll/${process.env.REACT_APP_FE}?page=1&count=12&search=${inputValue}`,
      ).getRequest()

      const options = response.data.data.map((group) => ({
        label: group.display_name,
        value: group._id,
      }))
      callback(options)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleDefaultOptionsEngList()
  }, [])

  const handleDefaultOptionsEngList = async () => {
    try {
      const response = await new BasicProvider(
        `admins/get-by-roll/${process.env.REACT_APP_FE}`,
      ).getRequest()
      const options = response.data.data.map((eng) => ({
        label: eng.name,
        value: eng._id,
      }))
      setDefaultOptionsEngList(options)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEngineerListChange = (selectedOptions) => {
    const engineerList = selectedOptions.map((option) => option.value)
    setInitialValues((prevState) => ({
      ...prevState,
      engineers: engineerList,
      group: '',
    }))
  }

  // const renderField = (field) => {
  //   const fieldName = field.key
  //   const fieldValue = additionalJson && additionalJson ? additionalJson[fieldName] : ''
  //   const role = field?.role

  //   switch (field.type) {
  //     case 'text':
  //       return (
  //         <CFormInput
  //           type="text"
  //           name={fieldName}
  //           autoComplete="off"
  //           value={fieldValue}
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
  //           onChange={(e) => {
  //             const key = field?.key
  //             const value = e.target.value
  //             setAdditionalJson((prevFormData) => ({
  //               ...prevFormData,
  //               [key]: value,
  //             }))
  //           }}
  //         >
  //           {field?.options.map((option) => (
  //             <option key={option} value={option}>
  //               {option}
  //             </option>
  //           ))}
  //         </CFormSelect>
  //       )
  //     default:
  //       return null
  //   }
  // }

  // console.log('additionalFields=============', additionalFields)
  // console.log('additionalJson===============', additionalJson)

  // const renderField = (field) => {
  //   const fieldName = field?.key
  //   const role = field?.role

  //   // Find the index of the object in the array with the matching role
  //   const objectIndex = additionalJson?.findIndex((obj) => obj.role === role)
  //   const fieldValue = objectIndex >= 0 ? additionalJson[objectIndex][fieldName] : ''

  //   const updateFieldValue = (key, value) => {
  //     setAdditionalJson((prevFormData) => {
  //       const newFormData = [...prevFormData]

  //       if (objectIndex >= 0) {
  //         // Update existing object
  //         newFormData[objectIndex] = {
  //           ...newFormData[objectIndex],
  //           [key]: value,
  //         }
  //       } else {
  //         // Add new object if not found
  //         newFormData.push({
  //           role: role, // Make sure to preserve the role in the new object
  //           [key]: value,
  //         })
  //       }

  //       return newFormData
  //     })
  //   }

  //   switch (field.type) {
  //     case 'text':
  //       return (
  //         <CFormInput
  //           type="text"
  //           name={fieldName}
  //           autoComplete="off"
  //           value={fieldValue}
  //           onChange={(e) => updateFieldValue(fieldName, e.target.value)}
  //         />
  //       )
  //     case 'select':
  //       return (
  //         <CFormSelect
  //           name={fieldName}
  //           value={fieldValue}
  //           onChange={(e) => updateFieldValue(fieldName, e.target.value)}
  //         >
  //           {field?.options.map((option) => (
  //             <option key={option} value={option}>
  //               {option}
  //             </option>
  //           ))}
  //         </CFormSelect>
  //       )
  //     default:
  //       return null
  //   }
  // }

  const renderField = (field) => {
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

  return (
    <>
      <CForm className="g-3 needs-validation mb-3 coo-form" onSubmit={handleSubmit}>
        <CRow className="form-input-block">
          <CCol>
            <CCard>
              <CCardHeader>
                Main Details Of Case:-{' '}
                <span className="card-header-details ">
                  ( CIN Number: {initialValues.cin_number}) ( Serial Number:
                  {initialValues.serial_number})
                </span>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={3}>
                    <div className="">
                      <CFormLabel>
                        Date Of Initiation By Bank<span className="text-danger">*</span>
                      </CFormLabel>

                      <DatePicker
                        showMonthDropdown
                        showYearDropdown
                        selected={
                          initialValues?.date_initiation_bank
                            ? new Date(initialValues?.date_initiation_bank)
                            : new Date()
                        }
                        name="date_initiation_bank"
                        onChange={(date) =>
                          setInitialValues({ ...initialValues, date_initiation_bank: date })
                        }
                        // dateFormat="d-MM-yyyy"
                        dateFormat="dd-MMM-yyyy"
                        className="form-control full mb-3"
                      />
                    </div>
                  </CCol>

                  <CCol md={3}>
                    <div className="">
                      <CFormLabel>
                        Date Of Initiation By Real Apple<span className="text-danger">*</span>
                      </CFormLabel>
                      <DatePicker
                        // id="publishDate"
                        showMonthDropdown
                        showYearDropdownv
                        selected={
                          initialValues?.date_initiation_RA
                            ? new Date(initialValues?.date_initiation_RA)
                            : new Date()
                        }
                        name="date_initiation_bank"
                        onChange={(date) =>
                          setInitialValues({ ...initialValues, date_initiation_RA: date })
                        }
                        // dateFormat="d-MM-yyyy"
                        dateFormat="dd-MMM-yyyy"
                        minDate={new Date(initialValues.date_initiation_bank)}
                        className="form-control full mb-3"
                      />
                    </div>
                  </CCol>

                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>
                        Finance Name (Parent)<span className="text-danger">*</span>
                      </CFormLabel>

                      <AsyncSelect
                        name="finance_name_perent"
                        loadOptions={(inputValue, callback) =>
                          loadOptionsFinanceName(inputValue, callback)
                        }
                        defaultOptions={defaultOptionsFinanceName}
                        value={
                          defaultOptionsFinanceName.find(
                            (option) =>
                              option.value ===
                              (initialValues?.finance_name_perent?._id ||
                                initialValues.finance_name_perent),
                          ) || null
                        }
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        onChange={(selected) => {
                          setInitialValues({
                            ...initialValues,
                            finance_name_perent: selected.value,
                          })
                          setPerentFinanceId(selected.value)
                        }}
                      />
                    </div>
                  </CCol>

                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>
                        Finance Name<span className="text-danger">*</span>
                      </CFormLabel>

                      <AsyncSelect
                        name="finance_name"
                        loadOptions={(inputValue, callback) =>
                          loadOptionsFinanceNameChild(inputValue, callback)
                        }
                        defaultOptions={defaultOptionsFinanceNameChild}
                        value={
                          defaultOptionsFinanceNameChild.find(
                            (option) =>
                              option.value ===
                              (initialValues?.finance_name?._id || initialValues.finance_name),
                          ) || null
                        }
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        onChange={(selected) =>
                          setInitialValues({ ...initialValues, finance_name: selected.value })
                        }
                      />
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={3}>
                    <CFormLabel>
                      Applicant Name<span className="text-danger">*</span>
                    </CFormLabel>
                    <CInputGroup className="has-validation">
                      <input
                        type="text"
                        name="applicant_name"
                        value={initialValues.applicant_name ?? ''}
                        className="form-control"
                        placeholder="Enter applicant name "
                        onChange={handleOnChange}
                        autoComplete="off"
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>
                        LOS NO.<span className="text-danger">*</span>
                      </CFormLabel>
                      <input
                        type="text"
                        name="los_number"
                        value={initialValues.los_number ?? ''}
                        className="form-control"
                        placeholder="Enter LOS NO."
                        onChange={handleOnChange}
                        autoComplete="off"
                      />
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>
                        Contact Number 1<span className="text-danger">*</span>
                      </CFormLabel>
                      <input
                        type="number"
                        name="contact_number_1"
                        value={initialValues.contact_number_1 ?? ''}
                        className="form-control"
                        placeholder="Enter contact here"
                        onChange={(e) => {
                          const input = e.target.value
                          const regex = /^[0-9\b]+$/
                          if (input === '' || regex.test(input)) {
                            handleContactNumberChange(input.slice(0, 10), 'contact_number_1')
                          }
                        }}
                        maxLength={10}
                        autoComplete="off"
                      />
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>Contact Number 2</CFormLabel>
                      <input
                        type="number"
                        name="contact_number_2"
                        value={initialValues.contact_number_2 ?? ''}
                        className="form-control"
                        placeholder="Enter contact here"
                        onChange={(e) => {
                          const input = e.target.value
                          const regex = /^[0-9\b]+$/ // Regex to allow only numbers
                          if (input === '' || regex.test(input)) {
                            handleContactNumberChange(input.slice(0, 10), 'contact_number_2')
                          }
                        }}
                        maxLength={10}
                        autoComplete="off"
                      />
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>Contact Number 3</CFormLabel>
                      <input
                        type="number"
                        name="contact_number_3"
                        value={initialValues.contact_number_3 ?? ''}
                        className="form-control"
                        placeholder="Enter contact here 3"
                        onChange={(e) => {
                          const input = e.target.value
                          const regex = /^[0-9\b]+$/
                          if (input === '' || regex.test(input)) {
                            handleContactNumberChange(input.slice(0, 10), 'contact_number_3')
                          }
                        }}
                        maxLength={10}
                        autoComplete="off"
                      />
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>
                        Visit Address<span className="text-danger">*</span>
                      </CFormLabel>
                      <input
                        type="text"
                        name="address"
                        value={initialValues.address ?? ''}
                        className="form-control"
                        placeholder="Enter address here"
                        onChange={handleOnChange}
                        autoComplete="off"
                      />
                    </div>
                  </CCol>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>
                        City Or Village Name(Nero Location)<span className="text-danger">*</span>
                      </CFormLabel>
                      <input
                        type="text"
                        name="location"
                        value={initialValues.location ?? ''}
                        className="form-control"
                        placeholder="Enter location here"
                        onChange={handleOnChange}
                        rows={2}
                        autoComplete="off"
                      />
                    </div>
                  </CCol>

                  <CCol md={3}>
                    <div className="">
                      <CFormLabel>
                        Product Name<span className="text-danger">*</span>
                      </CFormLabel>
                      <CInputGroup className="has-validation">
                        <input
                          type="text"
                          name="product_name"
                          value={initialValues.product_name ?? ''}
                          className="form-control"
                          placeholder="Enter product Name"
                          onChange={handleOnChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                    </div>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>
                        Case Type <span className="text-danger">*</span>
                      </CFormLabel>
                      <CFormSelect
                        aria-label="Case Type"
                        name="case_type"
                        options={[
                          'Case Type',
                          { label: 'Fresh', value: 'fresh' },
                          { label: 'Subsequent', value: 'subsequent' },
                        ]}
                        value={initialValues.case_type ?? ''}
                        className="form-control"
                        onChange={handleOnChange}
                      />
                    </div>
                  </CCol>

                  <CCol md={3}>
                    <div className="mb-3">
                      <CFormLabel>
                        RA Branch <span className="text-danger">*</span>
                      </CFormLabel>

                      {console.log(initialValues)}

                      <AsyncSelect
                        name="ra_branch"
                        loadOptions={(inputValue, callback) =>
                          loadOptionsRaBranch(inputValue, callback)
                        }
                        defaultOptions={defaultOptionsRaBranch}
                        value={
                          defaultOptionsRaBranch.find(
                            (option) =>
                              option.value ===
                              (initialValues?.ra_branch?._id || initialValues?.ra_branch),
                          ) || null
                        }
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        onChange={(selected) =>
                          setInitialValues({ ...initialValues, ra_branch: selected.value })
                        }
                      />
                    </div>
                  </CCol>

                  <CCol md={3}>
                    <div className="mb-1">
                      <CFormLabel>
                        Case Of Branch<span className="text-danger">*</span>
                      </CFormLabel>
                      <CInputGroup className="has-validation">
                        <input
                          type="text"
                          name="case_of_branch"
                          value={initialValues.case_of_branch ?? ''}
                          className="form-control"
                          placeholder="Enter case of branch"
                          autoComplete="off"
                          onChange={handleOnChange}
                        />
                      </CInputGroup>
                    </div>
                  </CCol>

                  <CCol md={3}>
                    <CRow>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel>Latitude</CFormLabel>
                          <CInputGroup className="has-validation">
                            <input
                              type="text"
                              name="latitude"
                              value={initialValues.latitude ?? ''}
                              className="form-control"
                              placeholder="Enter latitude"
                              onChange={handleOnChange}
                              autoComplete="off"
                            />
                          </CInputGroup>
                        </div>
                      </CCol>
                      <CCol md={6}>
                        <div className="mb-3">
                          <CFormLabel>Longitude</CFormLabel>
                          <CInputGroup className="has-validation">
                            <input
                              type="text"
                              name="longitude"
                              value={initialValues.longitude ?? ''}
                              className="form-control"
                              placeholder="Enter longitude"
                              onChange={handleOnChange}
                              autoComplete="off"
                            />
                          </CInputGroup>
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>

                {additionalFields &&
                  additionalFields.filter((item) => item.role === 'COO').length > 0 && (
                    <>
                      <hr />
                      <CRow>
                        <CCol>
                          <h5 className="mt-3">Additional Fields</h5>

                          <CRow className="mt-4">
                            {additionalFields &&
                              additionalFields
                                .filter((item) => item.role === 'COO')
                                .map((field, index) => (
                                  <CCol md={3} key={index}>
                                    <div className="mb-3">
                                      <CFormLabel>{field.key}</CFormLabel>
                                      {renderField(field, index)}
                                    </div>
                                  </CCol>
                                ))}
                          </CRow>
                        </CCol>
                      </CRow>
                    </>
                  )}

                {loggedinUserRole.name === process.env.REACT_APP_COO && (
                  <CRow>
                    <hr />
                    <CCol md={6}>
                      <CFormCheck
                        type="checkbox"
                        label={'Want To Assign A Specific Engineer ? '}
                        name="to_engineer"
                        className="credit ps-0 pe-3 py-3 mt-3 justify-content-end"
                        checked={initialValues.to_engineer === '1'}
                        onChange={() => {
                          setInitialValues({
                            ...initialValues,
                            to_engineer: initialValues.to_engineer === '1' ? '0' : '1',
                          })
                        }}
                        defaultChecked
                      />
                    </CCol>

                    <CCol md={6}>
                      {initialValues.to_engineer === '1' ? (
                        <div className="mb-3">
                          <CFormLabel>
                            Engineers List <span className="text-danger">*</span>
                          </CFormLabel>
                          <AsyncSelect
                            name="engineers"
                            loadOptions={(inputValue, callback) =>
                              loadOptionsEngList(inputValue, callback)
                            }
                            defaultOptions={defaultOptionsEngList}
                            value={
                              Array.isArray(initialValues.engineers)
                                ? initialValues.engineers.map((productId) =>
                                    defaultOptionsEngList.find(
                                      (option) => option.value === productId,
                                    ),
                                  )
                                : []
                            }
                            isMulti
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            onChange={handleEngineerListChange}
                          />
                        </div>
                      ) : (
                        <div className="mb-3">
                          <CFormLabel>
                            Select Group<span className="text-danger">*</span>
                          </CFormLabel>

                          <AsyncSelect
                            name="group"
                            loadOptions={(inputValue, callback) =>
                              loadOptionsGroup(inputValue, callback)
                            }
                            defaultOptions={defaultOptionsGroup}
                            value={
                              defaultOptionsGroup.find(
                                (option) => option.value === initialValues.group,
                              ) || null
                            }
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            onChange={(selected) => {
                              setInitialValues({ ...initialValues, group: selected.value })
                              setInitialValues((prev) => ({ ...prev, engineers: [] }))
                            }}
                          />
                        </div>
                      )}
                    </CCol>
                  </CRow>
                )}
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
                    onClick={() =>
                      setInitialValues({
                        ...initialValues,
                        additional_fields: additionalJson,
                        status: 'pending for visit',
                      })
                    }
                  >
                    Submit
                  </CButton>
                )}

                {isEditMode && (
                  <CButton
                    className="btn btn-secondary me-2 "
                    type="submit"
                    name="buttonClicked"
                    value="update"
                    onClick={() =>
                      setInitialValues({
                        ...initialValues,
                        additional_fields: additionalJson,
                      })
                    }
                  >
                    Update
                  </CButton>
                )}

                <CButton
                  color="danger"
                  className="text-light"
                  onClick={() => {
                    setInitialValues({})

                    if (allButtonNavigation == '0') {
                      navigate('/case/all')
                    } else if (allButtonNavigation == '1' && isEditMode) {
                      navigate(`/case/${id}/update/ceo-details-show/by/${loggedinUserRole.name}`, {
                        state: { isCOOVisible: false },
                      })
                    }
                  }}
                >
                  Cancel
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default CooForm
