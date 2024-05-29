import { useEffect, useState, useRef } from 'react'
import {
  cilAudioSpectrum,
  cilFile,
  cilLifeRing,
  cilLocationPin,
  cilPencil,
  cilSend,
  cilShieldAlt,
  cilSpreadsheet,
  cilTrash,
  cilUser,
  cilUserX,
} from '@coreui/icons'

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react'

import { useDispatch, useSelector } from 'react-redux'
import MainDetailsCase from 'src/components/custom/department/roles/sdm/MainDetailsCase'
import PersonalInfoSDM from 'src/components/custom/department/roles/sdm/PersonalInfoSDM'
import Boundries4 from 'src/components/custom/department/roles/sdm/Boundries4'
import FloorDimensionDetails from 'src/components/custom/department/roles/sdm/FloorDimensionDetails'
import DevelScopeDetails from 'src/components/custom/department/roles/sdm/DevelScopeDetails'
import DistanceDetails from 'src/components/custom/department/roles/sdm/DistanceDetails'
import RateDimesionDetails from 'src/components/custom/department/roles/sdm/RateDimesionDetails'
import { FeSHowFiles } from 'src/components/custom/department/roles/sdm/feShowFIles'
import SDMUploadFiles from 'src/components/custom/department/roles/sdm/SDMUploadFiles'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import CommonMultistepForm from 'src/components/custom/department/forms/CommonMultistep/CommonMultistepForm'
import BasicProvider from 'src/constants/BasicProvider'
import { checkRole, handleDownload } from 'src/constants/common'
import { setAlertTimeout } from 'src/helpers/alertHelper'

import CooForm from 'src/components/custom/department/forms/CooForm'
import { useEffectFormData } from 'src/helpers/formHelpers'
import handleSubmitHelper from 'src/helpers/submitHelper'
import CommonCaseDetailsSDM from 'src/components/custom/department/showDetails/commonCaseDetailsSDM'
import DmForm from 'src/components/custom/department/forms/DmForm'
import ShowSdmFiles from 'src/components/custom/department/roles/dm/showSdmFiles'
import ShowDmDetails from 'src/components/custom/department/roles/rc/ShowDmDetails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faFileImage, faFilePdf, faXmark } from '@fortawesome/free-solid-svg-icons'
import CIcon from '@coreui/icons-react'
import AdditionalFields from 'src/components/custom/department/roles/sdm/additionalFields'
import AdditionalFieldsFormSDM from 'src/components/custom/department/roles/sdm/additionalFieldsFormSDM'
import Files from 'src/components/custom/department/roles/dm/Files'

let FE = process.env.REACT_APP_FE
let COO = process.env.REACT_APP_COO
let SDM = process.env.REACT_APP_SDM
let BM = process.env.REACT_APP_RA
let DM = process.env.REACT_APP_DM
let RC = process.env.REACT_APP_RC
let LCTO = process.env.REACT_APP_LCTO

const validationRules = {
  finance_name: {
    required: true,
  },
  applicant_name: {
    required: true,
  },
}

const commonUpdate = () => {
  var dispatch = useDispatch()
  var { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const isEditMode = !!id

  let loggedinUserRole = useSelector((state) => state?.userRole)

  const fileInputRef = useRef(null)

  const [showCaseData, setShowCaseData] = useState({})

  const [formStep, setFormStep] = useState()
  const [activeTab, setActiveTab] = useState(1)

  const [additionalFields, setAdditionalFields] = useState([])
  const [additionalJson, setAdditionalJson] = useState({})

  const [beforSubmitError, setBeforSubmitError] = useState('')

  const [toggleForms, setToggleForms] = useState({
    cooForm: false,
    toggleFePersonalInfo: false,
    toogleFeBoundries: false,
    toogleFeFloorAndDim: false,
    toggleFeDevAndScope: false,
    toggleFedistanceFrom: false,
    toggleFeRateAndLatlong: false,
    toggleDMForm: false,
    toggleAdditionalFieldsForm: false,
  })

  useEffect(() => {
    if (state) {
      const toggleFormsUpdates = {
        cooForm: state.isCOOVisible,
        toggleFePersonalInfo: state.firstStepVisible,
        toogleFeBoundries: state.secondStepVisible,
        toogleFeFloorAndDim: state.thirdStepVisible,
        toggleFeDevAndScope: state.fourthStepVisible,
        toggleFedistanceFrom: state.fifthStepVisible,
        toggleFeRateAndLatlong: state.sixthStepVisible,
        toggleDMForm: state.toggleDMForm,
        toggleAdditionalFieldsForm: state.additionalFieldsFormVisible,
      }

      setToggleForms((prev) => ({ ...prev, ...toggleFormsUpdates }))
      setFormStep(state?.formStep)
    }
  }, [state])

  // console.log('<<<<toggleForms>>>', toggleForms)

  // console.log('finance', finance)
  // const updateFinanceWithShowCaseData = () => {
  //   showCaseData?.finance?.fields?.forEach((field) => {
  //     const matchedValue = showCaseData[field.title]
  //     console.log('matchedValue>>>>', matchedValue)

  //     if (matchedValue !== undefined) {
  //       finance[field.title] = matchedValue
  //     }
  //   })

  //   setFinance({ ...finance })
  // }

  const updatedFinance = showCaseData?.finance_name?.fields?.map((item) => {
    const matchedData = Object.entries(showCaseData).find(([key, value]) => item.title === key)
    if (matchedData) {
      item.value = matchedData[1]
    } else {
      item.value = ''
    }

    return item
  })

  // console.log('updatedFinance', updatedFinance)

  const [initialValues, setInitialValues] = useState({
    //-----------------------COO----------------------------//
    cin_number: '',
    serial_number: '',
    date_initiation_bank: new Date(),
    date_initiation_RA: new Date(),
    finance_name_perent: '',
    finance_name: '',
    applicant_name: '',
    los_number: '',
    contact_number_1: '',
    contact_number_2: '',
    contact_number_3: '',
    case_type: '',
    product_name: '',
    address: '',
    location: '',
    case_of_branch: '',
    ra_branch: '',
    latitude: '',
    longitude: '',
    remark: '',
    group: '',
    to_engineer: '0',
    engineers: [],
    status: '',

    //------------------------------FE----------------------//

    // STEP 1 Personal-Info
    person_meet_at_site_name: '',
    person_meet_at_site_relation: '',
    person_meet_at_site_mobile: '',

    type_of_property: '',

    current_use_property: '',
    address_verification: '',
    house_plot_no: '',
    ward_no: '',
    village_colony: '',
    city: '',
    teh: '',
    dist: '',
    pin: '',
    landmark: '',
    occupant: '',
    self_occupied: '',
    vacant_month: '',
    tenure: '',
    tenant_details: [],

    // tenant_name: '',
    // exp_rent: '',
    // tenant_relation: '',
    // tenant_date: '',

    // STEP 2 4_Boundries

    location_class: '',
    proximity: '',
    east: '',
    west: '',
    north: '',
    south: '',
    not_match_reason: '',

    // STEP 3 Floors and Dimentions

    location_type: '',
    sub_location_type: '',

    no_of_wing_or_building: 0,
    located_on_floor: 0,
    no_of_floors: 0,
    lift: '',
    no_of_lifts: 0,
    floor_wise_details: [],
    is_basement: '',
    no_of_basement: 0,
    basement_wise_details: [],
    is_stilt: '',
    is_mezzanine: '',
    stilt: '',
    mezzanine: '',
    construction_stage: '',
    construction_at_site: [],
    floors_and_dimentions_remarks: '',

    dimension: {
      length: '',
      width: '',
    },

    // buit_up: {
    //   length: '',
    //   width: '',
    // },

    land_area: '',
    bua: '',
    shape_type: '',
    land_rate: '',
    bua_rate: '',
    exteriors: [],

    // Multistory/building

    no_of_wing_or_building: 0,

    flat_situated_on_wing: 0,
    multistory_no_of_floors: 0,
    located_on_floor: 0,
    other_flats_on_visited_floor: 0,

    builup_with_dimention: {
      length: null,
      width: null,
      dimension: 0,
    },

    super_builup_with_dimention: {
      length: null,
      width: null,
      dimension: 0,
    },

    loding_in_percentage: '',
    flat_per_sqrt_rate_bua: '',
    flat_per_sqrt_rate_sbua: '',
    flat_multistory_building_unit_rate: '',
    details_of_flat: '',
    interior: [],

    // STEP 4 Development and scope

    positive_point: [],
    negative_point: [],
    additional_amenities_like: [],
    // interiors: [],

    road_type: '',
    community_dominated: '',
    community_dominated_details: '',

    age_of_property: '',
    life_of_property: '',
    development_of_area: '',
    habitation: '',
    property_mortaged: '',
    mortaged_month_year: '',
    mortaged_bank_name: '',

    // STEP 5 Distance from

    wall_to_wall_road_width: '',
    road_center_to_wall_width: '',
    highway_name_and_no_dist: '',
    bus_stand_km: '',
    city_centre_km: '',
    railway_station_km: '',
    hospital_km: '',
    any_govt_office: '',
    other: '',

    // STEP 6 rate and Lat long

    market_rate: '',
    rental_rate: '',
    verified_thru_name: '',
    verified_thru_contact: '',
    rate_and_lat_long_remarks: '',
    latitude_by_fe: '',
    longitude_by_fe: '',

    required_photos_check: {
      selfie: false,
      e_bill: false,
      map: false,
      applicant_selfie: false,
      property_selfie: false,
    },

    // FOr assigning to other department

    dm: '',
    rc: '',
    lcto: '',
    cto: '',

    // For DM Fields
    dm_fields: '',

    // for adding addtional fileds
    additional_fields: '',

    fe_images_data: [],
  })

  const [showMessage, setshowMessage] = useState(false)
  const [caseId, setCaseId] = useState(null)

  function DMvalidateAtLeastOneFilled(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== '') {
        return true
      }
    }
    return false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return

      console.log('BEFORE SUB:', showCaseData && showCaseData?.fe_images_data)

      if (showCaseData && showCaseData?.fe_images_data?.length < 1) {
        setBeforSubmitError('Cannot submit form before select images for FE')
        return
      }

      console.log('fe_images_data?.length', showCaseData?.dm_fields?.length)
      if (showCaseData && !DMvalidateAtLeastOneFilled(initialValues.dm_fields)) {
        setBeforSubmitError('Cannot submit form before fill DM fields')
        return
      }

      var response
      if (isEditMode) {
        response = await new BasicProvider(`cases/update/${id}`, dispatch).patchRequest(data)
      } else {
        response = await new BasicProvider(`cases/create`, dispatch).postRequest(data)
        navigate(`/case/${response.data._id}/edit`)
      }
      if (response) {
        setCaseId(response?.data?._id)
        setshowMessage(true)
      }

      setAlertTimeout(dispatch)
    } catch (error) {
      console.log(error)
      // dispatch({ type: 'set', catcherror: error.data })
      dispatch({ type: 'set', validations: [error.data] })
    }
  }

  useEffect(() => {
    setInitialValues({
      //-----------------------COO----------------------------//
      cin_number: '',
      serial_number: '',
      date_initiation_bank: new Date(),
      date_initiation_RA: new Date(),
      finance_name_perent: '',
      finance_name: '',
      applicant_name: '',
      los_number: '',
      contact_number_1: '',
      contact_number_2: '',
      contact_number_3: '',
      case_type: '',
      product_name: '',
      address: '',
      location: '',
      case_of_branch: '',
      ra_branch: '',
      latitude: '',
      longitude: '',
      remark: '',
      group: '',
      to_engineer: '0',
      engineers: [],
      status: '',

      //------------------------------FE----------------------//

      // STEP 1 Personal-Info
      person_meet_at_site_name: '',
      person_meet_at_site_relation: '',
      person_meet_at_site_mobile: '',

      type_of_property: '',

      current_use_property: '',
      address_verification: '',
      house_plot_no: '',
      ward_no: '',
      village_colony: '',
      city: '',
      teh: '',
      dist: '',
      pin: '',
      landmark: '',
      occupant: '',
      self_occupied: '',
      vacant_month: '',
      tenant_name: '',
      tenure: '',
      exp_rent: '',
      tenant_relation: '',
      tenant_date: '',
      tenant_details: [],

      // STEP 2 4_Boundries

      location_class: '',
      proximity: '',
      east: '',
      west: '',
      north: '',
      south: '',
      not_match_reason: '',

      // STEP 3 Floors and Dimentions

      location_type: '',
      sub_location_type: '',
      no_of_wing_or_building: 0,
      located_on_floor: 0,
      no_of_floors: 0,
      lift: '',
      no_of_lifts: 0,
      floor_wise_details: [],
      is_basement_or_other: '',
      com_basement_other: {
        built_up: '',
        violation: '',
        unit_rate: '',
      },
      is_basement: '',
      no_of_basement: 0,
      basement_wise_details: [],
      is_stilt: '',
      is_mezzanine: '',
      stilt: '',
      mezzanine: '',
      construction_stage: '',
      construction_at_site: [],
      floors_and_dimentions_remarks: '',
      dimension: {
        length: '',
        width: '',
      },
      buit_up: {
        length: '',
        width: '',
      },
      land_area: null,
      bua: null,
      shape_type: '',
      land_rate: '',
      bua_rate: '',
      exteriors: [],

      // Multistory/building

      no_of_wing_or_building: 0,
      flat_situated_on_wing: 0,
      multistory_no_of_floors: 0,
      located_on_floor: 0,
      other_flats_on_visited_floor: 0,

      builup_with_dimention: {
        length: null,
        width: null,
        dimension: 0,
      },

      super_builup_with_dimention: {
        length: null,
        width: null,
        dimension: 0,
      },

      loding_in_percentage: '',
      flat_per_sqrt_rate_bua: '',
      flat_per_sqrt_rate_sbua: '',
      flat_multistory_building_unit_rate: '',
      details_of_flat: '',
      interior: [],

      // STEP 4 Development and scope

      positive_point: [],
      negative_point: [],
      additional_amenities_like: [],
      // interiors: [],

      road_type: '',
      community_dominated: '',
      community_dominated_details: '',

      age_of_property: '',
      life_of_property: '',
      development_of_area: '',
      habitation: '',
      property_mortaged: '',
      mortaged_month_year: '',
      mortaged_bank_name: '',

      // STEP 5 Distance from

      wall_to_wall_road_width: '',
      highway_name_and_no_dist: '',
      bus_stand_km: '',
      city_centre_km: '',
      railway_station_km: '',
      hospital_km: '',
      any_govt_office: '',
      other: '',

      // STEP 6 rate and Lat long

      market_rate: '',
      rental_rate: '',
      verified_thru_name: '',
      verified_thru_contact: '',
      rate_and_lat_long_remarks: '',
      latitude_by_fe: '',
      longitude_by_fe: '',

      required_photos_check: {
        selfie: false,
        e_bill: false,
        map: false,
        applicant_selfie: false,
        property_selfie: false,
      },

      // FOr assigning to other department

      dm: '',
      rc: '',
      lcto: '',
      cto: '',

      // For DM Fields
      dm_fields: '',

      // for adding addtional fileds
      additional_fields: '',

      fe_images_data: [],
    })

    fetchData()
  }, [navigate, id, state])

  const fetchData = async () => {
    try {
      // console.log('SHOWCASE', showCaseData)

      const data = await useEffectFormData(`cases/show/${id}`, initialValues, isEditMode, 'coo')

      const engineersId = data.engineers.map((eng) => eng._id)

      if (isEditMode) {
        setInitialValues({
          ...data,
          ra_branch: data.ra_branch,
          finance_name: data.finance_name,
          group: data.group._id,
          engineers: engineersId,
          dm_fields: data.dm_fields,
        })
      }
    } catch (error) {
      dispatch({ type: 'set', catcherror: error.data })
    }
  }

  useEffect(() => {
    fetchSHowCaseData()
  }, [])

  let fetchSHowCaseData = async () => {
    try {
      const data = await new BasicProvider(`cases/show/${id}`).getRequest()
      setShowCaseData(data.data)
    } catch (error) {
      dispatch({ type: 'set', catcherror: error.data })
    }
  }

  const downloadPdf = async (pdfUrl) => {
    if (pdfUrl) {
      try {
        const response = await fetch(pdfUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'case-report.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (error) {
        console.error('Error downloading PDF:', error)
      }
    }
  }

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

      console.log('JSONNNNNN', json)

      try {
        let response = await new BasicProvider('cases/genrate/report').postRequest(json)
        if (response) {
          // console.log('LOLOLO', response.data.file_url)
          //192.168.1.117:8008/files/tmpnnntpclq.pdf
          downloadPdf(response.data.file_url)
        }
        console.log('AI response', response)
      } catch (error) {}
    }
  }

  useEffect(() => {
    if (initialValues.finance_name) {
      fetchFinanceData()
    }
  }, [initialValues.finance_name])

  const fetchFinanceData = async () => {
    console.log('=====================================')

    try {
      let response = await new BasicProvider(
        `banks/show/${initialValues.finance_name._id || initialValues.finance_name}`,
        dispatch,
      ).getRequest()

      console.log('Fii', response)

      if (response.data.additional_keys) {
        setAdditionalFields(response.data.additional_keys)
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchSingleCaseData()
  }, [id])

  const fetchSingleCaseData = async () => {
    try {
      const response = await new BasicProvider(`cases/show/${id}`).getRequest()
      if (response) {
        setAdditionalJson(response?.data?.additional_fields)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <CContainer fluid>
        {loggedinUserRole.name !== SDM && (
          <>
            <CRow className="align-items-center ">
              <CCol
                md={loggedinUserRole.name === RC ? 9 : loggedinUserRole.name === DM ? 7 : 12}
                className="pe-0"
              >
                <CCard className="mt-4 py-2 pb-2 px-2 dm_tabs_list">
                  <CNav variant="pills" role="tablist">
                    <CNavItem role="right-swipe">
                      <CNavLink
                        active={activeTab === 1}
                        component="button"
                        role="tab"
                        aria-controls="home-tab-pane"
                        aria-selected={activeTab === 1}
                        // className=""
                        onClick={() => {
                          setActiveTab(1)
                        }}
                        className={`${activeTab === 1 ? 'requested text-white' : ''}`}
                      >
                        <div className="d-flex white gold_heart align-items-center justify-content-center">
                          <h6 className="mb-0 like-text sizeW">
                            <CIcon icon={cilUser} /> COO
                          </h6>
                        </div>
                      </CNavLink>
                    </CNavItem>

                    <CNavItem role="left-swipe">
                      <CNavLink
                        active={activeTab === 2}
                        component="button"
                        role="tab"
                        aria-controls="profile-tab-pane"
                        aria-selected={activeTab === 2}
                        onClick={() => {
                          setActiveTab(2)
                        }}
                        className={`${activeTab === 2 ? 'received text-white' : ''}`}
                      >
                        <div className="d-flex white gold_heart align-items-center justify-content-center">
                          <h6 className="mb-0  like-text sizeW">
                            <CIcon icon={cilLocationPin} /> FE
                          </h6>
                        </div>
                      </CNavLink>
                    </CNavItem>
                    {/*                     
                    <CNavItem role="matches">
                      <CNavLink
                        active={activeTab === 3}
                        component="button"
                        role="tab"
                        aria-controls="profile-tab-pane"
                        aria-selected={activeTab === 3}
                        onClick={() => {
                          setActiveTab(3)
                        }}
                        className={`${activeTab === 3 ? 'accepted text-white' : ''}`}
                      >
                        <div className="d-flex white gold_heart align-items-center justify-content-center">
                          <h6 className="mb-0  like-text sizeW">
                            <CIcon icon={cilLifeRing} /> SDM
                          </h6>
                        </div>
                      </CNavLink>
                    </CNavItem> */}

                    <CNavItem role="matches">
                      <CNavLink
                        active={activeTab === 4}
                        component="button"
                        role="tab"
                        aria-controls="profile-tab-pane"
                        aria-selected={activeTab === 4}
                        onClick={() => {
                          setActiveTab(4)
                        }}
                        className={`${activeTab === 4 ? 'accepted text-white' : ''}`}
                      >
                        <div className="d-flex white gold_heart align-items-center justify-content-center">
                          <h6 className="mb-0  like-text sizeW">
                            <CIcon icon={cilShieldAlt} /> DM
                          </h6>
                        </div>
                      </CNavLink>
                    </CNavItem>
                    <CNavItem role="right-swipe">
                      <CNavLink
                        active={activeTab === 5}
                        component="button"
                        role="tab"
                        aria-controls="home-tab-pane"
                        aria-selected={activeTab === 5}
                        // className=""
                        onClick={() => {
                          setActiveTab(5)
                        }}
                        className={`${activeTab === 5 ? 'requested text-white' : ''}`}
                      >
                        <div className="d-flex white gold_heart align-items-center justify-content-center">
                          <h6 className="mb-0 like-text sizeW">
                            <CIcon icon={cilUser} />
                            Files
                          </h6>
                        </div>
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                </CCard>
              </CCol>

              {(loggedinUserRole.name == RC || loggedinUserRole.name == DM) && (
                <>
                  {showCaseData &&
                    Object.keys(showCaseData).length > 0 &&
                    typeof showCaseData.fe_images_data === 'object' &&
                    Object.keys(showCaseData.fe_images_data).length > 0 &&
                    typeof showCaseData.dm_fields === 'object' &&
                    Object.keys(showCaseData.dm_fields).length > 0 &&
                    showCaseData.dm_fields && (
                      <CCol md={3}>
                        <CCard
                          className="mt-4 py-2 pb-2 px-2 text-center submit_btn report_generate_btn" // corrected class name
                          onClick={generateReport}
                        >
                          <div className="mb-1">
                            <FontAwesomeIcon icon={faFilePdf} /> Generate Report
                          </div>
                        </CCard>
                      </CCol>
                    )}
                </>
              )}

              {loggedinUserRole.name === DM && (
                <CCol
                  md={
                    showCaseData &&
                    Object.keys(showCaseData).length > 0 &&
                    typeof showCaseData.fe_images_data === 'object' &&
                    Object.keys(showCaseData.fe_images_data).length > 0 &&
                    typeof showCaseData.dm_fields === 'object' &&
                    Object.keys(showCaseData.dm_fields).length > 0 &&
                    showCaseData.dm_fields
                      ? 2
                      : 5
                  }
                >
                  <Link to={`/case/${id}/case-addons`} style={{ textDecoration: 'none' }}>
                    <CCard className="mt-4 py-2 pb-2 px-2 text-center submit_btn report_genrate_btn">
                      <div className="mb-1">
                        <FontAwesomeIcon icon={faFileImage} /> Case Addons
                      </div>
                    </CCard>
                  </Link>
                </CCol>
              )}
            </CRow>
          </>
        )}

        {/* {JSON.stringify(showCaseData)} */}

        {(loggedinUserRole.name === DM || loggedinUserRole.name === RC) && (
          <CommonCaseDetailsSDM showCaseData={showCaseData} />
        )}

        <CTabContent className="mt-3">
          <CTabPane visible={activeTab === 1}>
            {/* <CRow>This is COO COntent</CRow> */}
            {DM === loggedinUserRole.name && (
              <>
                {toggleForms && toggleForms.cooForm ? (
                  <>
                    <div className="mt-4">
                      <CooForm
                        initialValues={initialValues}
                        setInitialValues={setInitialValues}
                        handleSubmit={handleSubmit}
                        additionalFields={additionalFields}
                        setAdditionalFields={setAdditionalFields}
                        additionalJson={additionalJson}
                        setAdditionalJson={setAdditionalJson}
                      />
                    </div>
                  </>
                ) : (
                  <MainDetailsCase showCaseData={showCaseData} />
                )}
              </>
            )}

            {RC === loggedinUserRole.name && (
              <>
                {toggleForms && toggleForms.cooForm ? (
                  <>
                    <div className="mt-4">
                      <CooForm
                        initialValues={initialValues}
                        setInitialValues={setInitialValues}
                        handleSubmit={handleSubmit}
                        additionalFields={additionalFields}
                        setAdditionalFields={setAdditionalFields}
                        additionalJson={additionalJson}
                        setAdditionalJson={setAdditionalJson}
                      />
                    </div>
                  </>
                ) : (
                  <MainDetailsCase showCaseData={showCaseData} />
                )}
              </>
            )}
          </CTabPane>
          <CTabPane visible={activeTab === 2}>
            {DM === loggedinUserRole.name && (
              <>
                {toggleForms && toggleForms.toggleFePersonalInfo && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <PersonalInfoSDM showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toogleFeBoundries && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <Boundries4 showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toogleFeFloorAndDim && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <FloorDimensionDetails showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toggleFeDevAndScope && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <DevelScopeDetails showCaseData={showCaseData} />
                )}
                {toggleForms && toggleForms.toggleFedistanceFrom && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <DistanceDetails showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toggleFeRateAndLatlong && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <RateDimesionDetails showCaseData={showCaseData} />
                )}
              </>
            )}

            {RC === loggedinUserRole.name && (
              <>
                {toggleForms && toggleForms.toggleFePersonalInfo && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <PersonalInfoSDM showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toogleFeBoundries && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <Boundries4 showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toogleFeFloorAndDim && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <FloorDimensionDetails showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toggleFeDevAndScope && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <DevelScopeDetails showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toggleFedistanceFrom && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <DistanceDetails showCaseData={showCaseData} />
                )}

                {toggleForms && toggleForms.toggleFeRateAndLatlong && formStep ? (
                  <CommonMultistepForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    formStep={formStep}
                  />
                ) : (
                  <RateDimesionDetails showCaseData={showCaseData} />
                )}
              </>
            )}
          </CTabPane>
          <CTabPane visible={activeTab === 3}>
            {/* <CRow>For DM Content</CRow> */}
            {DM === loggedinUserRole.name && (
              <>
                <ShowSdmFiles />
              </>
            )}

            {RC === loggedinUserRole.name && (
              <>
                <ShowSdmFiles />
              </>
            )}
          </CTabPane>

          <CTabPane visible={activeTab === 4}>
            {/* <CRow>For DM Content</CRow> */}
            {DM === loggedinUserRole.name && (
              <>
                <DmForm
                  initialValues={initialValues}
                  setInitialValues={setInitialValues}
                  handleSubmit={handleSubmit}
                  additionalFields={additionalFields}
                  setAdditionalFields={setAdditionalFields}
                  additionalJson={additionalJson}
                  setAdditionalJson={setAdditionalJson}
                  beforSubmitError={beforSubmitError}
                  setBeforSubmitError={setBeforSubmitError}
                  showCaseData={showCaseData}
                  fetchData={fetchData}
                  fetchSHowCaseData={fetchSHowCaseData}
                />
              </>
            )}

            {RC === loggedinUserRole.name && (
              <>
                {toggleForms && toggleForms.toggleDMForm ? (
                  <>
                    <DmForm
                      initialValues={initialValues}
                      setInitialValues={setInitialValues}
                      handleSubmit={handleSubmit}
                      showCaseData={showCaseData}
                    />
                  </>
                ) : (
                  <>
                    <ShowDmDetails showCaseData={showCaseData} />
                  </>
                )}
              </>
            )}
          </CTabPane>

          <CTabPane visible={activeTab === 5}>
            {/* <CRow>For DM Content</CRow> */}
            {DM === loggedinUserRole.name && (
              <>
                <Files
                  initialValues={initialValues}
                  setInitialValues={setInitialValues}
                  handleSubmit={handleSubmit}
                  additionalFields={additionalFields}
                  setAdditionalFields={setAdditionalFields}
                  additionalJson={additionalJson}
                  setAdditionalJson={setAdditionalJson}
                  showCaseData={showCaseData}
                  activeTab={activeTab}
                  fetchData={fetchData}
                  fetchSHowCaseData={fetchSHowCaseData}
                />
              </>
            )}
          </CTabPane>
        </CTabContent>

        {SDM === loggedinUserRole.name && (
          <>
            <CommonCaseDetailsSDM showCaseData={showCaseData} />
            {toggleForms && toggleForms.cooForm ? (
              <>
                <div className="mt-4">
                  <CooForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    handleSubmit={handleSubmit}
                    additionalFields={additionalFields}
                    setAdditionalFields={setAdditionalFields}
                    additionalJson={additionalJson}
                    setAdditionalJson={setAdditionalJson}
                  />
                </div>
              </>
            ) : (
              <MainDetailsCase showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toggleFePersonalInfo && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <PersonalInfoSDM showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toogleFeBoundries && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <Boundries4 showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toogleFeFloorAndDim && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <FloorDimensionDetails showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toggleFeDevAndScope && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <DevelScopeDetails showCaseData={showCaseData} />
            )}
            {toggleForms && toggleForms.toggleFedistanceFrom && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <DistanceDetails showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toggleFeRateAndLatlong && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <RateDimesionDetails showCaseData={showCaseData} />
            )}

            {additionalJson.length > 0 &&
            additionalFields.length > 0 &&
            toggleForms &&
            toggleForms.toggleAdditionalFieldsForm ? (
              <AdditionalFieldsFormSDM
                additionalFields={additionalFields}
                setAdditionalFields={setAdditionalFields}
                additionalJson={additionalJson}
                setAdditionalJson={setAdditionalJson}
                initialValues={setInitialValues}
                setInitialValues={setInitialValues}
              />
            ) : (
              <AdditionalFields showCaseData={showCaseData} role="FE" />
            )}

            <SDMUploadFiles />
          </>
        )}

        {BM === loggedinUserRole.name && (
          <>
            <CommonCaseDetailsSDM caseData={showCaseData} />
            {toggleForms && toggleForms.cooForm ? (
              <>
                <div className="mt-4">
                  <CooForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </>
            ) : (
              <MainDetailsCase showCaseData={showCaseData} />
            )}
          </>
        )}

        {/* {RC === loggedinUserRole.name && (
          <>
            <CommonCaseDetailsSDM caseData={showCaseData} />
            {toggleForms && toggleForms.cooForm ? (
              <>
                <div className="mt-4">
                  <CooForm
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </>
            ) : (
              <MainDetailsCase showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toggleFePersonalInfo && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <PersonalInfoSDM showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toogleFeBoundries && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <Boundries4 showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toogleFeFloorAndDim && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <FloorDimensionDetails showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toggleFeDevAndScope && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <DevelScopeDetails showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toggleFedistanceFrom && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <DistanceDetails showCaseData={showCaseData} />
            )}

            {toggleForms && toggleForms.toggleFeRateAndLatlong && formStep ? (
              <CommonMultistepForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                formStep={formStep}
              />
            ) : (
              <RateDimesionDetails showCaseData={showCaseData} />
            )}

            <ShowSdmFiles />

            {toggleForms && toggleForms.toggleDMForm ? (
              <>
                <DmForm
                  initialValues={initialValues}
                  setInitialValues={setInitialValues}
                  handleSubmit={handleSubmit}
                  showCaseData={showCaseData}
                />
              </>
            ) : (
              <>
                <ShowDmDetails showCaseData={showCaseData} />
              </>
            )}
          </>
        )} */}
      </CContainer>
    </>
  )
}

export default commonUpdate
