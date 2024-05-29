import { useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CRow } from '@coreui/react'
import SuccessPage from './SuccessPage'
import DevelopmentAndScope from './DevelopmentAndScope'

import PersonalDetails from './Personal_info'
import Boundries from './Boundries'
import FloorsAndDimentions from './Floors_and_Dimentions'

import DistanceFrom from './DistanceFrom'
import RateAndLat_Long from './RateAndLat_Long'
import UploadFiles from './UploadFiles'
import { SdmShow2nd } from '../../roles/sdm/feShowFIles'
import AssignSdm from './assingtosdm'
import { useNavigate, useParams } from 'react-router-dom'
import TiedUp from 'src/components/custom/popup/tiedUp'
import Concern from 'src/components/custom/popup/concern'
import BasicProvider from 'src/constants/BasicProvider'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export default function CreateCustomer({
  initialValues,
  setInitialValues,
  additionalFields,
  setAdditionalFields,
  additionalJson,
  setAdditionalJson,
}) {
  var params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  var caseId = params.id
  // const isEditMode = !!id
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 8

  const [isTiedUp, setIsTiedUp] = useState(true)
  const [visibleTiedModel, setVisibleTiedModel] = useState(false)
  const [visibleConcernModel, setVisibleConcernModel] = useState(false)

  const token = Cookies.get(`${process.env.REACT_APP_COOKIE_PREFIX}_auth`)
  var decoded = jwtDecode(token)

  const handlePreviousStep = () => {
    setCurrentStep((current) => (current > 1 ? current - 1 : current))
  }

  const handleNextStep = async () => {
    setCurrentStep((current) => (current < totalSteps ? current + 1 : current))
  }

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  const steps = [
    'Personal Info.',
    '4 Boundries',
    'Floors and Dimentions',
    'Development and scope',
    'Distance from',
    'Rate And Lat Long',
    'Upload Files',
  ]

  useEffect(() => {
    fetchData(caseId)
  }, [])

  const fetchData = async (caseId) => {
    try {
      const response = await new BasicProvider(`cases/show/${caseId}`).getRequest()
      if (response) {
        response.data.status.includes('tied-up by fe') ? setIsTiedUp(true) : setIsTiedUp(false)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleTiedUp = async () => {
    try {
      let json = {
        case_id: caseId,
        user_id: decoded._id,
        type: 'fe call',
        role_id: decoded.role,
      }

      let response = await new BasicProvider(`cases/update/${caseId}`, dispatch).patchRequest({
        status: 'tied-up by fe',
      })
      if (response) {
        setIsTiedUp(true)
        navigate(`/case/all`)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <CRow className="py-2">
        <CCol>
          {!isTiedUp ? (
            <CCard className="mb-4 createfaq multi-step">
              <CRow className="mt-4">
                <CCardBody className="text-center">
                  <div
                    onClick={() => setVisibleTiedModel(!visibleTiedModel)}
                    className="btn btn-primary me-2  submit_btn"
                    name="buttonClicked"
                  >
                    Tied Up
                  </div>
                  <CButton
                    color="danger"
                    className="text-light"
                    onClick={() => setVisibleConcernModel(!visibleConcernModel)}
                  >
                    Concern
                  </CButton>
                </CCardBody>
              </CRow>
            </CCard>
          ) : (
            <CCard className="mb-4 createfaq multi-step">
              <div className="home-tit p-0 my-3 text-center">
                <h2>
                  <span>F.E. DETAILS</span>
                </h2>
                <p>Fill All Form Field To Go To The Next Step</p>
              </div>

              {/* progress */}
              <div class="progress mx-4">
                <div
                  class="progress-bar bg-danger progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${progressPercentage == 0 ? 16 : progressPercentage}%`,
                  }}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              <CCardBody className="px-1 p-md-3">
                {/* heading and steps  */}
                <div class="row p-3">
                  <div class="col">
                    <h5 className="fs-title">{steps[currentStep - 1]}</h5>
                  </div>
                </div>

                {/* steps1 start */}

                <CForm className="g-3 needs-validation">
                  {currentStep === 1 && (
                    <PersonalDetails
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                    />
                  )}
                </CForm>

                {/* steps 2 */}
                <CForm className="g-3 needs-validation">
                  {currentStep === 2 && (
                    <Boundries
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                    />
                  )}
                </CForm>

                {/* steps 3 */}
                <CForm className="g-3 needs-validation">
                  {currentStep === 3 && (
                    <FloorsAndDimentions
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                    />
                  )}
                </CForm>

                {/* steps 4 */}
                <CForm className="g-3 needs-validation">
                  {currentStep === 4 && (
                    <DevelopmentAndScope
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                    />
                  )}
                </CForm>

                {/* steps 5 */}
                <CForm className="g-3 needs-validation">
                  {currentStep === 5 && (
                    <DistanceFrom
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                    />
                  )}
                </CForm>

                {/* steps 6 */}
                <CForm className="g-3 needs-validation">
                  {currentStep === 6 && (
                    <RateAndLat_Long
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                    />
                  )}
                </CForm>

                {/* steps 7 */}
                <CForm className="g-3 needs-validation">
                  {currentStep === 7 && (
                    <UploadFiles
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      additionalFields={additionalFields}
                      setAdditionalFields={setAdditionalFields}
                      additionalJson={additionalJson}
                      setAdditionalJson={setAdditionalJson}
                    />
                  )}
                </CForm>

                {/* steps 8 */}
                {/* <CForm className="g-3 needs-validation">
                  {currentStep === 8 && (
                    <AssignSdm
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                    />
                  )}
                </CForm> */}

                {/* Final steps  */}
                {currentStep === totalSteps && (
                  <CRow>
                    <SuccessPage />
                  </CRow>
                )}
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>

      <TiedUp
        visible={visibleTiedModel}
        close={() => setVisibleTiedModel(!visibleTiedModel)}
        handleTiedUp={handleTiedUp}
      />
      <Concern
        visible={visibleConcernModel}
        close={() => setVisibleConcernModel(!visibleConcernModel)}
        caseId={caseId}
      />
    </>
  )
}
