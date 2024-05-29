import { cilInfo, cilPencil, cilSpreadsheet, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CContainer,
  CBadge,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CFormLabel,
} from '@coreui/react'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import SubHeader from 'src/components/custom/SubHeader'
import { RowsPerPage } from 'src/constants/variables'
// import HelperFunction from '../../helpers/HelperFunctions'
import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
import { DeleteModal, handleConfirmDelete } from 'src/helpers/deleteModalHelper'
import BasicProvider from 'src/constants/BasicProvider'
import noImage from 'src/assets/images/noImage.png'
import { ShimmerTable, ShimmerTitle } from 'react-shimmer-effects'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import HelperFunction from 'src/helpers/HelperFunctions'

import AsyncSelect from 'react-select/async'
import handleSubmitHelper from 'src/helpers/submitHelper'
import { customSuccessMSG } from 'src/helpers/alertHelper'

const validationRules = {
  dm: {
    required: true,
  },
}

export default function SdmDataTable() {
  const navigate = useNavigate()
  const [rowPerPage, setRowPerPage] = useState(20)
  const location = useLocation()

  const [userId, setuserId] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [visible, setVisible] = useState(false)
  const [searchcurrentPage, setSearchCurrentPage] = useState(null)
  const query = new URLSearchParams(location.search)
  var count = query.get('count') || rowPerPage
  var currentPage = parseInt(query.get('page') || 1)
  var search = query.get('search') || ''
  let [defaultPage, setDefaultPage] = useState(currentPage)
  const dispatch = useDispatch()
  const data = useSelector((state) => state.data?.cases)
  const toggleCleared = useSelector((state) => state.toggleCleared)
  const totalCount = useSelector((state) => state.totalCount)

  let loggedinUserRole = useSelector((state) => state?.userRole)

  const updatePageQueryParam = (paramName, page) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set(paramName, page)
    navigate({ search: searchParams.toString() })
  }

  useEffect(() => {
    if (rowPerPage) {
      fetchData()
    }
  }, [currentPage, rowPerPage, searchcurrentPage, search])

  const fetchData = async () => {
    try {
      // setDefaultPage(currentPage)
      let performSearch = false
      var queryData = {}
      for (const [key, value] of query.entries()) {
        if (key !== 'page' && key !== 'count') {
          queryData[key] = value
          if (value !== '' && value !== null) {
            performSearch = true
          }
        }
      }

      var response
      // console.log(performSearch);
      if (performSearch) {
        queryData['page'] = currentPage
        queryData['count'] = count
        response = await new BasicProvider(
          `cases/search?${HelperFunction.convertToQueryString(queryData)}`,
        ).getRequest()
        // console.log(response)
      } else {
        response = await new BasicProvider(`cases?page=${currentPage}&count=${count}`).getRequest()
        // console.log( 'LOLOLOLs',response)
      }

      dispatch({ type: 'set', data: { cases: response.data.data } })
      dispatch({ type: 'set', totalCount: response.data.total })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)

      console.error(error)
    }
  }

  const handleRowChange = useCallback((state) => {
    const rows = state.selectedRows
    const rowsId = rows.map((item) => item._id)
    dispatch({ type: 'set', selectedrows: rowsId })
  }, [])

  const columns = [
    {
      name: 'Applicant Name',
      selector: (row) => (
        <div  className="data_table_colum">
          {row && row.applicant_name ? row.applicant_name : '-'}
        </div>
      ),
    },
    {
      name: 'Case Of Branch',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row.case_of_branch ? row.case_of_branch : '-'}
        </div>
      ),
    },
    {
      name: 'Contact Number',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row.contact_number_1 ? row.contact_number_1 : '-'}
        </div>
      ),
    },
    {
      name: 'Finance Name',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row?.finance_name?.name ? row.finance_name.name : '-'}
        </div>
      ),
    },

    {
      name: 'Status',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row?.status ? (
            <p className="rounded-pill mb-0 text-capitalize">
              <CBadge
                style={{
                  background:
                    row?.status === 'pending for visit'
                      ? '#3399FF'
                      : row?.status === 'pending from draft'
                      ? '#3399FF'
                      : row?.status === 'pending for rc'
                      ? '#F9B115'
                      : row?.status === 'case under query'
                      ? '#081632'
                      : row?.status === 'tied-up by fe'
                      ? '#d3412a'
                      : row?.status === 'visit done'
                      ? '#73b43c'
                      : ' ',
                }}
              >
                {
                  row.status
                    .toLowerCase() // Convert status to lowercase
                    .replace(/\b(fe|rc)\b/g, (match) => match.toUpperCase()) // Convert short forms to uppercase
                }
              </CBadge>
            </p>
          ) : (
            '-'
          )}
        </div>
      ),
    },

    {
      name: 'RA Branch',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row?.ra_branch?.name ? row?.ra_branch?.name : '-'}
        </div>
      ),
    },
    {
      name: 'CEO',
      selector: (row) => (
        <div className="data_table_colum">{row && row?.admin?.name ? row?.admin?.name : '-'}</div>
      ),
    },
    {
      name: 'Created',
      cell: (row) => (
        <CustomTooltip content={moment(row.created_at).format('DD MMM YYYY HH:mm:ss')}>
          <div style={{ padding: '5px 10px' }}>
            <div className="data_table_colum">{moment(row.created_at).fromNow()}</div>
          </div>
        </CustomTooltip>
      ),
    },

    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-btn me-3">
          <div className="edit-btn">
            <CIcon
              className="pointer_cursor"
              icon={cilPencil}
              onClick={() =>
                navigate(`/case/${row._id}/update/${'sdm-form'}/by/${loggedinUserRole.name}`)
              }
            />
          </div>
        </div>
      ),

      ignoreRowClick: true,
      allowoverflow: true,
      button: 'true',
    },
  ]

  // -------------------------------- ASSIGN DM Data Handler -------------------------------- //

  const selectedRow = useSelector((state) => state.selectedrows)

  const [defaultOptionDM, setDefaultOptionDM] = useState([])

  const [initialValues, setInitialValues] = useState({
    status: 'pending for draft',
    dm: '',
    ids: [],
  })

  useEffect(() => {
    fetchDefaultOptionForDM()
    setInitialValues((prev) => ({ ...prev, ids: selectedRow }))
  }, [selectedRow])

  const fetchDefaultOptionForDM = async () => {
    try {
      const response = await new BasicProvider(
        `admins/get-by-roll/${process.env.REACT_APP_DM}`,
      ).getRequest()
      const options = response.data.data.map((item) => ({
        label: item.name,
        value: item._id,
      }))

      setDefaultOptionDM(options)
    } catch (error) {
      console.error(error)
    }
  }

  const loadOptionsForDM = async (inputValue, callback) => {
    try {
      const response = await new BasicProvider(
        `admins/get-by-roll/${process.env.REACT_APP_DM}?page=1&count=12&search=${inputValue}`,
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

  const sendToDM = async () => {
    // console.log('INIT=====DM',initialValues);
    // return

    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return

      let response = await new BasicProvider(`cases/assign/dm`, dispatch).patchRequest(data)
      if (response.status === 'success') {
        customSuccessMSG(dispatch, 'Assigned Successfuly')
      }
    } catch (error) {
      console.log(error)
      // dispatch({ type: 'set', catcherror: error.data })
      dispatch({ type: 'set', validations: [error.data] })
    }
  }

  return (
    <>
      {Array.isArray(selectedRow) && selectedRow.length > 0 && (
        <CCard className="mb-4 mt-4">
          <CCardBody>
            <CRow>
              <CCol md={6}>
                {/* <CFormLabel>Select DM</CFormLabel> */}
                <AsyncSelect
                  name="dm"
                  placeholder="Select DM"
                  loadOptions={(inputValue, callback) => loadOptionsForDM(inputValue, callback)}
                  defaultOptions={defaultOptionDM}
                  value={
                    defaultOptionDM.find(
                      (option) => option.value === (initialValues?.dm?._id || initialValues?.dm),
                    ) || null
                  }
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  onChange={(selected) =>
                    setInitialValues({ ...initialValues, dm: selected.value })
                  }
                />
              </CCol>
              <CCol md={6} className="d-flex align-iten-center justify-content-end">
                <div>
                  <span className="selected_row">{selectedRow?.length} selected</span>

                  <CButton className="add_new" onClick={sendToDM}>
                    Assign
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      <div className="datatable mt-4">
        <DataTable
          responsive="true"
          columns={columns}
          data={data}
          paginationServer
          paginationTotalRows={totalCount}
          paginationDefaultPage={defaultPage}
          onChangePage={(page) => {
            currentPage = page
            setDefaultPage(parseInt(page))
            updatePageQueryParam('page', currentPage)
          }}
          pagination
          selectableRows
          selectableRowsHighlight
          highlightOnHover
          paginationRowsPerPageOptions={RowsPerPage}
          paginationPerPage={rowPerPage}
          onChangeRowsPerPage={(value) => {
            count = value
            setRowPerPage(value)
            updatePageQueryParam('count', value)
            setSelectedRowForModule('cases', value)
          }}
          onSelectedRowsChange={(state) => handleRowChange(state)}
          clearSelectedRows={toggleCleared}
        />
      </div>

      <DeleteModal
        visible={visible}
        userId={userId}
        moduleName="cases"
        currentPage={currentPage}
        rowPerPage={rowPerPage}
        setVisible={setVisible}
        deletionType="trash"
        handleClose={() => setVisible(false)}
      />
    </>
  )
}
