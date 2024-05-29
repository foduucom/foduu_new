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

const validationRules = {

}

const Boundries = ({ currentStep, setCurrentStep, initialValues, setInitialValues }) => {
  let loggedinUserRole = useSelector((state) => state?.userRole)
  const dispatch = useDispatch()
  var params = useParams()
  const id = params.id
  const isEditMode = !!id
  const navigate = useNavigate()

  const [isCancle, setIsCancle] = useState(false)

  useEffect(() => {
    if (loggedinUserRole?.name == process.env.REACT_APP_SDM) setIsCancle(true)
  }, [loggedinUserRole])

  const totalSteps = 8
  const handlePreviousStep = () => {
    setCurrentStep((current) => (current > 1 ? current - 1 : current))
  }

  const handleNextStep = async () => {
    setCurrentStep((current) => (current < totalSteps ? current + 1 : current))
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setInitialValues({ ...initialValues, [name]: value })
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return data

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
        <CRow className="w-100 m-0 ">
          <CCol md={6}>

            <div className="py-2">
              <CFormLabel>
                Proximity<span className="text-danger ">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                name="proximity"
                value={initialValues.proximity}
                onChange={handleOnChange}
                placeholder="Well Connected to.."
                autoComplete="off"
              />
            </div>

            <div className="py-2">
              <CFormLabel>
                Reason(If Not Matching) <span className="text-danger ">*</span>
              </CFormLabel>
              <CFormTextarea
                type="text"
                name="not_match_reason"
                value={initialValues.not_match_reason}
                onChange={handleOnChange}
                placeholder="Enter Here.."
                rows={3}
                autoComplete="off"
              />
            </div>
          </CCol>
          <CCol md={6}>
            <CRow>
              <CCol md={6}>
                <div className="py-2">
                  <CFormLabel>
                    East Boundary<span className="text-danger ">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="east"
                    value={initialValues.east ?? ''}
                    onChange={handleOnChange}
                    placeholder="Enter here"
                    autoComplete="off"
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="py-2">
                  <CFormLabel>
                    West Boundary<span className="text-danger ">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="west"
                    value={initialValues.west ?? ''}
                    onChange={handleOnChange}
                    placeholder="Enter here"
                    autoComplete="off"
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="py-2">
                  <CFormLabel>
                    North Boundary<span className="text-danger ">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="north"
                    value={initialValues.north ?? ''}
                    onChange={handleOnChange}
                    placeholder="Enter here"
                    autoComplete="off"
                  />
                </div>
              </CCol>
              <CCol md={6}>
                <div className="py-2">
                  <CFormLabel>
                    South Boundary
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="south"
                    value={initialValues.south ?? ''}
                    onChange={handleOnChange}
                    placeholder="Enter here"
                    autoComplete="off"
                  />
                </div>
              </CCol>
            </CRow>
          </CCol>
                                                                                                                                                  

          <div className="text-center mt-4">
            {currentStep > 1 && currentStep != totalSteps && (
              <CButton
                className="btn btn-success me-2 next  w-lg-17 w-sm-auto submit_btn"
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
                className="text-white btn-danger me-2 w-lg-17 w-sm-auto previous mx-3  my-4 "
                type="button"
                onClick={() =>
                  navigate(`/case/${id}/update/boundries-show/by/${loggedinUserRole.name}`, {
                    state: { firstStepVisible: false, formStep: 1 },
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

export default Boundries
