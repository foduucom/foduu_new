import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import BasicProvider from 'src/constants/BasicProvider'
import { setAlertTimeout } from 'src/helpers/alertHelper'
import { useEffectFormData } from 'src/helpers/formHelpers'
import handleSubmitHelper from 'src/helpers/submitHelper'
import AsyncSelect from 'react-select/async'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const validationRules = {
  // person_meet_at_site_name: {
  //   required: true,
  // },
}

const DevelopmentAndScope = ({ currentStep, setCurrentStep, initialValues, setInitialValues }) => {
  const totalSteps = 8
  const handlePreviousStep = () => {
    setCurrentStep((current) => (current > 1 ? current - 1 : current))
  }
  const handleNextStep = async () => {
    setCurrentStep((current) => (current < totalSteps ? current + 1 : current))
  }

  var params = useParams()
  const id = params.id
  const navigate = useNavigate()
  var dispatch = useDispatch()
  const isEditMode = !!id

  let loggedinUserRole = useSelector((state) => state?.userRole)

  const [positivePoints, setPositivePoints] = useState([])
  const [negativePoints, setNegativePoints] = useState([])
  const [additionalAmenities, setAdditionalAmenities] = useState([])
  const [interiors, setInteriors] = useState([])
  const [exteriors, setExteriors] = useState([])

  const [isCancle, setIsCancle] = useState(false)

  useEffect(() => {
    if (loggedinUserRole?.name == process.env.REACT_APP_SDM) setIsCancle(true)
  }, [loggedinUserRole])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    if (name === 'age_of_property') {
      const numericValue = Number(value)
      setInitialValues({
        ...initialValues,
        [name]: numericValue,
        life_of_property: 60 - numericValue,
      })
    } else if (name === 'property_mortaged' && value === 'no') {
      // Clear mortaged_month_year and mortaged_bank_name when property_mortaged is 'no'
      setInitialValues({
        ...initialValues,
        property_mortaged: value,
        mortaged_month_year: null,
        mortaged_bank_name: '',
      })
    } else {
      setInitialValues({
        ...initialValues,
        [name]: value,
      })
    }
  }

  const transformData = (sourceArray, labelKey) =>
    sourceArray.map((elem) => ({
      value: elem._id,
      label: elem.item ? elem.item.name : elem.variant || elem[labelKey],
    }))

  const positivePointsData = positivePoints ? transformData(positivePoints, 'name') : []
  const negativePointsData = negativePoints ? transformData(negativePoints, 'name') : []
  const additionalAmenitiesData = additionalAmenities
    ? transformData(additionalAmenities, 'name')
    : []
  const interiorsData = interiors ? transformData(interiors, 'name') : []
  const exteriorsData = exteriors ? transformData(exteriors, 'name') : []

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const positive = await new BasicProvider(
        'cms/categories/get-first-parent/positive',
        dispatch,
      ).getRequest()
      setPositivePoints(positive.data.data)

      const negative = await new BasicProvider(
        'cms/categories/get-first-parent/negative',
        dispatch,
      ).getRequest()
      setNegativePoints(negative.data.data)

      const additional_amenities = await new BasicProvider(
        'cms/categories/get-first-parent/additional_amenities',
        dispatch,
      ).getRequest()
      setAdditionalAmenities(additional_amenities.data.data)

      const interiors = await new BasicProvider(
        'cms/categories/get-first-parent/interiors',
        dispatch,
      ).getRequest()
      setInteriors(interiors.data.data)

      const exteriors = await new BasicProvider(
        'cms/categories/get-first-parent/exteriors',
        dispatch,
      ).getRequest()
      setExteriors(interiors.data.data)
    } catch (e) {
      console.log('Error while Fetching the data ', e)
    }
  }

  const loadOptions = async (name, inputValue, callback) => {
    try {
      const selectData = await new BasicProvider(
        `${name}?search=${inputValue}&page=1&count=10`,
      ).getRequest()
      console.log(selectData)
      const options = selectData.data.data.map((item) => ({
        value: item._id,
        label: item.name,
      }))
      callback(options)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    // e.preventDefault()
    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return

      let response = await new BasicProvider(`cases/update/${id}`, dispatch).patchRequest(data)

      setAlertTimeout(dispatch)
    } catch (error) {
      console.log(error)
      // dispatch({ type: 'set', catcherror: error.data })
      dispatch({ type: 'set', validations: [error.data] })
    }
  }

  return (
    <div>
      <CForm className="g-3 needs-validation">
        <CRow className="w-100 m-0">
          {JSON.stringify()}

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Property Positive Points</CFormLabel>
              <AsyncSelect
                loadOptions={(inputValue, callback) =>
                  loadOptions('cms/categories/search-perent/positive', inputValue, callback)
                }
                defaultOptions={positivePointsData}
                placeholder="Select"
                name="positive_point"
                value={
                  Array.isArray(initialValues.positive_point)
                    ? initialValues.positive_point.map((productId) =>
                        positivePointsData.find((option) => option.value === productId),
                      )
                    : []
                }
                onChange={(selectedOptions) => {
                  const selectedProductIds = selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : []
                  setInitialValues((prevValues) => ({
                    ...prevValues,
                    positive_point: selectedProductIds,
                  }))
                }}
                isClearable
                isMulti
              />
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Property Negative Points</CFormLabel>
              <AsyncSelect
                loadOptions={(inputValue, callback) =>
                  loadOptions('cms/categories/search-perent/negative', inputValue, callback)
                }
                defaultOptions={negativePointsData}
                placeholder="Select"
                name="negative_point"
                value={
                  Array.isArray(initialValues.negative_point)
                    ? initialValues.negative_point.map((productId) =>
                        negativePointsData.find(
                          (option) => option.value === productId
                        ),
                      )
                    : []
                }
                onChange={(selectedOptions) => {
                  const selectedProductIds = selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : []
                  setInitialValues((prevValues) => ({
                    ...prevValues,
                    negative_point: selectedProductIds,
                  }))
                }}
                isClearable
                isMulti
              />
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Additional Amenities </CFormLabel>
              <AsyncSelect
                loadOptions={(inputValue, callback) =>
                  loadOptions(
                    'cms/categories/search-perent/additional_amenities',
                    inputValue,
                    callback,
                  )
                }
                defaultOptions={additionalAmenitiesData}
                placeholder="Select"
                name="additional_amenities_like"
                value={
                  Array.isArray(initialValues.additional_amenities_like)
                    ? initialValues.additional_amenities_like.map((productId) =>
                        additionalAmenitiesData.find((option) => option.value === productId),
                      )
                    : []
                }
                onChange={(selectedOptions) => {
                  const selectedProductIds = selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : []
                  setInitialValues((prevValues) => ({
                    ...prevValues,
                    additional_amenities_like: selectedProductIds,
                  }))
                }}
                isClearable
                isMulti
              />
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Community Dominated</CFormLabel>
              <CFormSelect
                custom
                name="community_dominated"
                value={initialValues.community_dominated}
                placeholder="Select"
                onChange={handleOnChange}
              >
                <option>Select Type</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CFormSelect>
            </div>
          </CCol>

          {initialValues.community_dominated === 'yes' && (
            <CCol md={4}>
              <div className="py-2">
                <CFormLabel>Detail Of Community Dominated</CFormLabel>

                <CFormInput
                  type="text"
                  name="community_dominated_details"
                  value={initialValues.community_dominated_details}
                  onChange={handleOnChange}
                  placeholder="Enter your details "
                  autoComplete="off"
                />
              </div>
            </CCol>
          )}

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Age of the property(In Years)</CFormLabel>

              <CFormSelect
                custom
                type="number"
                name="age_of_property"
                value={initialValues.age_of_property}
                onChange={handleOnChange}
              >
                {[...Array(60).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </CFormSelect>
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Life Of The Property(In Years)</CFormLabel>
              <CFormInput
                type="number"
                id="life_of_property"
                placeholder="Life"
                value={initialValues.life_of_property}
                readOnly
                autoComplete="off"
              />
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Development of Area</CFormLabel>
              <CFormSelect
                custom
                name="development_of_area"
                value={initialValues.development_of_area}
                placeholder="Select"
                onChange={handleOnChange}
              >
                <option>Select</option>
                <option value="0">0</option>
                <option value="0-5%">0-5%</option>
                <option value="10%">10%</option>
                <option value="20%">20%</option>
                <option value="30%">30%</option>
                <option value="40%">40%</option>
                <option value="50%">50%</option>
                <option value="60%">60%</option>
                <option value="70%">70%</option>
                <option value="80%">80%</option>
                <option value="90%">90%</option>
                <option value="100%">100%</option>
              </CFormSelect>
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Habitation</CFormLabel>
              <CFormSelect
                custom
                name="habitation"
                value={initialValues.habitation}
                placeholder="Select"
                onChange={handleOnChange}
              >
                <option>Select</option>
                <option value="0%">0%</option>
                <option value="0-5%">0-5%</option>
                <option value="10%">10%</option>
                <option value="20%">20%</option>
                <option value="30%">30%</option>
                <option value="40%">40%</option>
                <option value="50%">50%</option>
                <option value="60%">60%</option>
                <option value="70%">70%</option>
                <option value="80%">80%</option>
                <option value="90%">90%</option>
                <option value="100%">100%</option>
              </CFormSelect>
            </div>
          </CCol>
          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>If Property Mortgaged</CFormLabel>
              <CFormSelect
                custom
                name="property_mortaged"
                value={initialValues.property_mortaged}
                onChange={handleOnChange}
              >
                <option>Select If Property Mortgaged</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </CFormSelect>
            </div>
          </CCol>

          {initialValues.property_mortaged === 'yes' && (
            <>
              <CCol md={4}>
                <div className="py-2">
                  <CFormLabel>( if Yes) IN Year/Month</CFormLabel>

                  <DatePicker
                    showMonthDropdown
                    showYearDropdown
                    selected={
                      initialValues?.mortaged_month_year
                        ? new Date(initialValues?.mortaged_month_year)
                        : new Date()
                    }
                    name="mortaged_month_year"
                    onChange={(date) =>
                      setInitialValues({ ...initialValues, mortaged_month_year: date })
                    }
                    dateFormat="MMM-yyyy"
                    className="form-control full mb-3"
                  />
                </div>
              </CCol>
              <CCol md={4}>
                <div className="py-2">
                  <CFormLabel>Mortgaged With Bank </CFormLabel>
                  <CFormInput
                    type="text"
                    name="mortaged_bank_name"
                    value={initialValues.mortaged_bank_name ?? ''}
                    onChange={handleOnChange}
                    placeholder="Enter Bank Name"
                    autoComplete="off"
                  />
                </div>
              </CCol>
            </>
          )}

          <div className="text-center mt-4">
            {currentStep > 1 && currentStep != totalSteps && (
              <CButton
                className="btn btn-success me-2 next w-lg-17 w-sm-auto submit_btn"
                type="button"
                onClick={handlePreviousStep}
              >
                Prev
              </CButton>
            )}

            {currentStep < totalSteps - 1 && (
              <CButton
                className="btn-warning btn me-2 mx-3 w-lg-17 w-sm-auto"
                type="submit"
                onClick={handleNextStep}
              >
                Next
              </CButton>
            )}
            <CButton
              className="btn text-white btn-success me-2 w-lg-17 w-sm-auto previous mx-3  my-4 "
              type="button"
              onClick={handleSubmit}
            >
              Save
            </CButton>
            {isCancle && (
              <CButton
                className="text-white btn-danger me-2  previous mx-3 w-lg-17 w-sm-auto my-4 "
                type="button"
                onClick={() =>
                  navigate(
                    `/case/${id}/update/development-scope-show/by/${loggedinUserRole.name}`,
                    { state: { thirdStepVisible: false, formStep: 4 } },
                  )
                }
              >
                Cancel
              </CButton>
            )}
          </div>
        </CRow>
      </CForm>
    </div>
  )
}

export default DevelopmentAndScope
