import { cilPencil, cilSpreadsheet, cilTrash } from '@coreui/icons'
import { parseISO } from 'date-fns'

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
  CRow,
} from '@coreui/react'

import Cookies from 'js-cookie'
import AsyncSelect from 'react-select/async'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ImagePreview from 'src/components/custom/ImagePreview'
import SubHeader from 'src/components/custom/SubHeader'
import BasicProvider from 'src/constants/BasicProvider'
import { setAlertTimeout } from 'src/helpers/alertHelper'
import { useEffectFormData } from 'src/helpers/formHelpers'
import { ImageHelper } from 'src/helpers/imageHelper'
import handleSubmitHelper from 'src/helpers/submitHelper'
import { ISO_8601 } from 'moment'
import CooForm from 'src/components/custom/department/forms/CooForm'
import FeShowDeatils from 'src/components/custom/department/forms/FE/Feshowdetails'
import { MessageShow } from 'src/components/custom/popup/viewMessageModel'
import CreateMultiStep from 'src/components/custom/department/forms/FE_MultiStepForm/CreateMultiStep'
import { checkRole } from 'src/constants/common'
import { SubmitDetailsSDM } from 'src/components/custom/department/roles/sdm/feShowFIles'
import PersonalInfoSDM from 'src/components/custom/department/roles/sdm/PersonalInfoSDM'
import Boundries4 from 'src/components/custom/department/roles/sdm/Boundries4'
import FloorDimensionDetails from 'src/components/custom/department/roles/sdm/FloorDimensionDetails'
import DevelScopeDetails from 'src/components/custom/department/roles/sdm/DevelScopeDetails'
import DistanceDetails from 'src/components/custom/department/roles/sdm/DistanceDetails'
import RateDimesionDetails from 'src/components/custom/department/roles/sdm/RateDimesionDetails'
import MainDetailsCase from 'src/components/custom/department/roles/sdm/MainDetailsCase'
import SDMUploadFiles from 'src/components/custom/department/roles/sdm/SDMUploadFiles'
import AdditionalFields from 'src/components/custom/department/roles/sdm/additionalFields'

var subHeaderItems = [
  {
    name: 'All Cases',
    link: '/case/all',
    icon: cilSpreadsheet,
  },
  {
    name: 'Create Case',
    link: '/case/create',
    icon: cilPencil,
  },
  {
    name: 'Trash Cases',
    link: '/case/trash',
    icon: cilTrash,
  },
]

const validationRules = {
  finance_name: {
    required: true,
  },
  applicant_name: {
    required: true,
  },
}

export default function CreateUser() {
  var params = useParams()
  var dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const id = params.id
  const isEditMode = !!id

  const [showCaseData, setShowCaseData] = useState(null)

  const admin = useSelector((state) => state.userData)

  const [toggleDetails, setToggleDetails] = useState({
    togglePersonal: false,
    toogleBoundries: false,
    toogleFloorDime: false,
    toggleScope: false,
    toggleDimension: false,
    toggleSubmit: false,
  })

  const [showSdmCondition, setShowSdmCondition] = useState(false)

  // const stateShow= location.state.showState;

  const handleOnChange = (e) => {
    const { name, value } = e.target
    if (name === 'self_occupied') {
      setInitialValues({ ...initialValues, [name]: value })
      setInitialValues({ ...initialValues, [name]: value, tenure: '' })
    } else {
      setInitialValues({ ...initialValues, [name]: value })
    }
  }

  let isFE = checkRole(process.env.REACT_APP_FE, admin)
  let isCOO = checkRole(process.env.REACT_APP_COO, admin)
  let isSDM = checkRole(process.env.REACT_APP_SDM, admin)

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

    // tenant_name: '',
    // exp_rent: '',
    // tenant_relation: '',
    // tenant_date: '',

    tenant_details: [],

    same_address: '',
    full_common_address: '',
    house_builing_name: '',
    wing_block_name: '',
    street_name: '',
    state: '',

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
    is_property_under_construction: '',
    stilt: '',
    mezzanine: '',
    is_under_renovation: '',
    construction_stage: '',
    construction_at_site: [],
    under_construction_at_site: [],
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

    flat_situated_on_wing: [],
    multistory_no_of_floors: [],
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

    multistory_land_rate: '',

    loding_in_percentage: '',
    flat_per_sqrt_rate_bua: '',
    flat_per_sqrt_rate_sbua: '',
    flat_multistory_building_unit_rate: '',
    details_of_flat: '',
    interior: [],

    number_of_wings_available: '',
    name_of_wing: '',
    carpet_rate: '',

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
  const [caseValue, setCaseValue] = useState(null)
  const [additionalFields, setAdditionalFields] = useState([])
  const [additionalJson, setAdditionalJson] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()


    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return

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
    fetchSingleCaseData(caseId)
  }, [caseId])

  const fetchSingleCaseData = async () => {
    try {
      const response = await new BasicProvider(`cases/show/${id}`).getRequest()
      if (response) {
        setCaseValue(response.data)
        setAdditionalJson(response?.data?.additional_fields)
      }
    } catch (error) {
      console.log('error', error)
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
      flat_situated_on_wing: [],
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

      additional_fields: '',

      fe_images_data: [],
    })

    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      const data = await useEffectFormData(`cases/show/${id}`, initialValues, isEditMode, 'coo')
      const engineersId = data?.engineers.map((eng) => eng._id)
      const exteriorsId = data?.exteriors.map((ext) => ext._id)
      const positivePoinsId = data?.positive_point.map((ps) => ps._id)
      const negativePointsId = data?.negative_point.map((ng) => ng._id)
      const additionalAmenities = data?.additional_amenities_like.map((ad) => ad._id)

      console.log('data==========?????', negativePointsId)

      if (isEditMode) {
        setInitialValues({
          ...data,
          finance_name: data.finance_name,
          group: data.group._id,
          engineers: engineersId,
          exteriors: exteriorsId,
          positive_point: positivePoinsId,
          negative_point: negativePointsId,
          additional_amenities_like: additionalAmenities,
          tenant_details: data.tenant_details,
        })

        // setInitialValues({ ...data })
      }
    } catch (error) {
      dispatch({ type: 'set', catcherror: error.data })
    }
  }

  const handleButtonClick = () => {
    setShowSdmCondition(!showSdmCondition)
  }

  useEffect(() => {
    if (initialValues.finance_name) {
      fetchFinanceData()
    }
  }, [])

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
    ;(async () => {
      try {
        const data = await new BasicProvider(`cases/show/${id}`).getRequest()
        if (data.data) {
          setShowCaseData(data.data)
        }
      } catch (error) {
        dispatch({ type: 'set', catcherror: error.data })
      }
    })()
  }, [])

  return (
    <>
      <SubHeader subHeaderItems={subHeaderItems} />
      <CContainer fluid>
        {params.type === 'show-case-details' ? (
          <>
            {isFE && (
              <>
                {params.type !== 'show-case-details' && (
                  <FeShowDeatils initialValues={showCaseData} />
                )}

                <PersonalInfoSDM showCaseData={showCaseData} />
                <Boundries4 showCaseData={showCaseData} />
                <FloorDimensionDetails showCaseData={showCaseData} />
                <DevelScopeDetails showCaseData={showCaseData} />
                <DistanceDetails showCaseData={showCaseData} />
                <RateDimesionDetails showCaseData={showCaseData} />

                {showCaseData &&
                  showCaseData?.additional_fields &&
                  showCaseData?.additional_fields.filter((item) => item.role === 'FE').length >
                    0 && <AdditionalFields showCaseData={showCaseData} role="FE" />}
              </>
            )}
          </>
        ) : (
          <>
            {isCOO && (
              <CooForm
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                handleSubmit={handleSubmit}
                additionalFields={additionalFields}
                setAdditionalFields={setAdditionalFields}
                additionalJson={additionalJson}
                setAdditionalJson={setAdditionalJson}
              />
            )}

            {isFE && <FeShowDeatils showCaseData={showCaseData} />}

            {isFE && (
              <CreateMultiStep
                initialValues={initialValues}
                setInitialValues={setInitialValues}
                additionalFields={additionalFields}
                setAdditionalFields={setAdditionalFields}
                additionalJson={additionalJson}
                setAdditionalJson={setAdditionalJson}
              />
            )}
          </>
        )}

        <MessageShow
          visible={showMessage}
          setshowMessage={setshowMessage}
          handleCloseShowMessage={() => !showMessage}
          caseValue={caseValue}
        />
      </CContainer>
    </>
  )
}
