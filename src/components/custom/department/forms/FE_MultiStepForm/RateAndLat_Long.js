import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import BasicProvider from 'src/constants/BasicProvider'
import { setAlertTimeout } from 'src/helpers/alertHelper'
import { useEffectFormData } from 'src/helpers/formHelpers'
import handleSubmitHelper from 'src/helpers/submitHelper'

const validationRules = {
  // person_meet_at_site_name: {
  //   required: true,
  // },
}

const RateAndLatLong = ({ currentStep, setCurrentStep, initialValues, setInitialValues }) => {
  const totalSteps = 8

  let loggedinUserRole = useSelector((state) => state?.userRole)

  const [isCancle, setIsCancle] = useState(false)

  useEffect(() => {
    if (loggedinUserRole?.name == process.env.REACT_APP_SDM) setIsCancle(true)
  }, [loggedinUserRole])

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

  const handleOnChange = (e) => {
    const { name, value } = e.target
    if (name === 'market_rate' || name === 'rental_rate') {
      const numericValue = parseInt(value)

      setInitialValues({
        ...initialValues,
        [name]: numericValue,
      })
    } else {
      setInitialValues({
        ...initialValues,
        [name]: value,
      })
    }
  }

  const handleContactNumberChange = (value, contactNumberField) => {
    const sanitizedValue = value.replace(/\D/g, '')
    setInitialValues({ ...initialValues, [contactNumberField]: sanitizedValue })
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    setInitialValues({
      ...initialValues,
      required_photos_check: {
        ...initialValues.required_photos_check,
        [name]: checked,
      },
    })
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
          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Verified Market Rate (In Sqft)</CFormLabel>
              <CFormInput
                type="number"
                name="market_rate"
                value={initialValues.market_rate ?? ''}
                onChange={handleOnChange}
                placeholder="Enter Here"
                autoComplete="off"
              />
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>
                Old Rented Amount
              </CFormLabel>
              <CFormInput
                type="number"
                name="rental_rate"
                value={initialValues.rental_rate ?? ''}
                onChange={handleOnChange}
                placeholder="Enter Here"
                autoComplete="off"
              />
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>
                Person Name Verified Thru<span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                name="verified_thru_name"
                value={initialValues.verified_thru_name ?? ''}
                onChange={handleOnChange}
                placeholder="Enter Here"
                autoComplete="off"
              />
            </div>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>
                Contact Verified thru<span className="text-danger">*</span>
              </CFormLabel>

              <CFormInput
                type="number"
                name="verified_thru_contact"
                value={initialValues.verified_thru_contact}
                onChange={(e) => {
                  const input = e.target.value
                  const regex = /^[0-9\b]+$/
                  if (input === '' || regex.test(input)) {
                    handleContactNumberChange(input.slice(0, 10), 'verified_thru_contact')
                  }
                }}
                maxLength={10}
                placeholder="Enter mobile number"
                autoComplete="off"
              />
            </div>
          </CCol>

          <CCol md={4}>
            <CRow className="py-2">
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Latitude</CFormLabel>
                  <CInputGroup className="has-validation">
                    <input
                      type="text"
                      name="latitude_by_fe"
                      value={initialValues.latitude_by_fe ?? ''}
                      className="form-control"
                      placeholder="Enter latitude"
                      onChange={handleOnChange}
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
                      name="longitude_by_fe"
                      value={initialValues.longitude_by_fe ?? ''}
                      className="form-control"
                      placeholder="Enter longitude"
                      onChange={handleOnChange}
                    />
                  </CInputGroup>
                </div>
              </CCol>
            </CRow>
          </CCol>

          <CCol md={4}>
            <div className="py-2">
              <CFormLabel>Remark</CFormLabel>
              <CFormTextarea
                type="text"
                name="rate_and_lat_long_remarks"
                value={initialValues?.rate_and_lat_long_remarks ?? ''}
                onChange={handleOnChange}
                placeholder="Enter Remarks Here"
                rows={0}
                autoComplete="off"
              />
            </div>
          </CCol>

          {/* <CCol>
            <div className="mb-3">
              <CFormLabel>Required Photo Check</CFormLabel>
              <CInputGroup className="has-validation mt-1 required-photo ">
                <CFormCheck
                  className="d-flex align-items-center ps-0"
                  inline
                  type="checkbox"
                  id="selfieCheckbox"
                  name="selfie"
                  label="Selfie With Property"
                  checked={initialValues?.required_photos_check?.selfie}
                  onChange={handleCheckboxChange}
                />
                <CFormCheck
                  className="d-flex align-items-center ps-2"
                  inline
                  type="checkbox"
                  id="selfieCheckbox"
                  name="applicant_selfie"
                  label="Selfie With Applicant"
                  checked={initialValues?.required_photos_check?.applicant_selfie}
                  onChange={handleCheckboxChange}
                />
                <CFormCheck
                  className="d-flex align-items-center ps-2"
                  inline
                  type="checkbox"
                  id="selfieCheckbox"
                  name="property_selfie"
                  label="2 Side Road Photo With Property"
                  checked={initialValues?.required_photos_check?.property_selfie}
                  onChange={handleCheckboxChange}
                />
                <CFormCheck
                  className="d-flex align-items-center ps-2"
                  inline
                  type="checkbox"
                  id="eBillCheckbox"
                  name="e_bill"
                  label="E-BILL"
                  checked={initialValues?.required_photos_check?.e_bill}
                  onChange={handleCheckboxChange}
                />
                <CFormCheck
                  className="d-flex align-items-center ps-0 pt-2"
                  inline
                  type="checkbox"
                  id="eBillCheckbox"
                  name="drow"
                  label="drow the property map"
                  checked={initialValues?.required_photos_check?.drow}
                  onChange={handleCheckboxChange}
                />
              </CInputGroup>
            </div>
          </CCol> */}

          <div className="text-center mt-4">
            {currentStep > 1 && currentStep != totalSteps && (
              <CButton
                className="btn btn-success me-2  mFt-2 next w-lg-17 w-sm-auto submit_btn"
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
              className="btn text-white btn-success me-2  previous mx-3 w-lg-17 w-sm-auto my-4 "
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
                  navigate(`/case/${id}/update/rate-latlong-show/by/${loggedinUserRole.name}`, {
                    state: { sixthStepVisible: false, formStep: 6 },
                  })
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

export default RateAndLatLong
