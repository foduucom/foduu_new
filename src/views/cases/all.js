import { cilPencil, cilSpreadsheet, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CContainer, CBadge, CCard, CCardHeader, CCardBody } from '@coreui/react'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import SubHeader from 'src/components/custom/SubHeader'
import { RowsPerPage } from 'src/constants/variables'
import HelperFunction from '../../helpers/HelperFunctions'
import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
import { DeleteModal, handleConfirmDelete } from 'src/helpers/deleteModalHelper'
import BasicProvider from 'src/constants/BasicProvider'
import noImage from 'src/assets/images/noImage.png'
import { ShimmerTable, ShimmerTitle } from 'react-shimmer-effects'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import CaseFilter from 'src/components/custom/CaseFilter'
import CooDataTable from 'src/components/custom/department/roles/coo/coodatatable'
import { checkRole } from 'src/constants/common'
import FeDataTable from 'src/components/custom/department/roles/fe/fedatatable'
import SdmDataTable from 'src/components/custom/department/roles/sdm/sdmdatatable'
import RA_DataTable from 'src/components/custom/department/roles/ra/RA_DataTable'
import DM_DataTable from 'src/components/custom/department/roles/dm/DM_DataTable'
import RC_DataTable from 'src/components/custom/department/roles/rc/RC_DataTable'

var subHeaderItems = [
  {
    name: 'All Cases',
    link: '/case/all',
    icon: cilSpreadsheet,
  },
  {
    name: 'Create Cases',
    link: '/case/create',
    icon: cilPencil,
  },
  {
    name: 'Trash Cases',
    link: '/case/trash',
    icon: cilTrash,
  },
]

export default function Blogs() {
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
  const [filteredData, setFilteredData] = useState([])
  const [rabranchData, setRAbranchData] = useState()
  const [financenameData, setFinancenameData] = useState()
  const updatePageQueryParam = (paramName, page) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set(paramName, page)
    navigate({ search: searchParams.toString() })
  }
  const admin = useSelector((state) => state.userData)
  let isCOO = checkRole(process.env.REACT_APP_COO, admin)
  let isFE = checkRole(process.env.REACT_APP_FE, admin)
  let isSDM = checkRole(process.env.REACT_APP_SDM, admin)
  let isRA = checkRole(process.env.REACT_APP_RA, admin)
  let isDM = checkRole(process.env.REACT_APP_DM, admin)
  let isRC = checkRole(process.env.REACT_APP_RC, admin)

  useEffect(() => {
    for (const [key, value] of query.entries()) {
      if (key !== 'page' && key !== 'count') {
        setFilteredData((prev) => ({
          ...prev,
          [key]: value,
        }))
      }
    }
  }, [])

  useEffect(() => {
    if (rowPerPage) {
      fetchData()
    }
  }, [currentPage, rowPerPage, filteredData, search])

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
          `cases/filter?${HelperFunction.convertToQueryString(queryData)}`,
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

  useEffect(() => {
    const fetchSelectedRows = async () => {
      const savedSelectedRows = await handleSelectedRowChange('cases')
      if (savedSelectedRows && !count) {
        setRowPerPage(savedSelectedRows)
      } else {
        setRowPerPage(count)
      }
    }
    // fetchSelectedRows()
  }, [count])

  const handleRowChange = useCallback((state) => {
    const rows = state.selectedRows
    const rowsId = rows.map((item) => item._id)
    dispatch({ type: 'set', selectedrows: rowsId })
  }, [])

  const handleFilter = async (search) => {
    try {
      const searchParams = new URLSearchParams(location.search)
      if (search) searchParams.set('search', search)
      navigate({ search: searchParams.toString() })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleFilterReset = async () => {
    setFilteredData({
      cin_number: '',
      applicant_name: '',
      case_of_branch: '',
      ra_branch: '',
      finance_name: '',
    })
    setRAbranchData('')
    setFinancenameData('')
    setSearchCurrentPage(1)
    currentPage = 1
    setDefaultPage(1)
    navigate({ search: '' })
  }

  const columns = [
    {
      name: 'CIN Number',
      selector: (row) => (
        <div onClick={() => navigate(`/case/show`)} className="data_table_colum">
          {row && row.cin_number ? row.cin_number : '-'}
        </div>
      ),
    },
    {
      name: 'Applicant Name',
      selector: (row) => (
        <div onClick={() => navigate(`/case/show`)} className="data_table_colum">
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
    // {
    //   name: 'Financec Name',
    //   selector: (row) => (
    //     <div className="data_table_colum">
    //       {row && row?.finance_name?.name ? row.finance_name.name : '-'}
    //     </div>
    //   ),
    // },
    {
      name: 'Status',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row?.status ? (
            <p className="rounded-pill mb-0 text-capitalize">
              {console.log('hjsdjhafkjsdf', row?.status)}
              <CBadge
                style={{
                  background:
                    row.status === 'pending for visit'
                      ? '#f7365c'
                      : row.status === 'pending from draft'
                      ? '#3399FF'
                      : row.status === 'pending for rc'
                      ? '#F9B115'
                      : row.status === 'case under query'
                      ? '#081632'
                      : row.status === 'accepted by fe'
                      ? '#79b745'
                      : '',
                }}
              >
                {row.status}
              </CBadge>
            </p>
          ) : (
            '-'
          )}
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
      name: 'RA Branch',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row?.ra_branch?.name ? row?.ra_branch?.name : '-'}
        </div>
      ),
    },
    // {
    //   name: 'admin',
    //   selector: (row) => (
    //     <div className="data_table_colum">{row && row?.admin?.name ? row?.admin?.name : '-'}</div>
    //   ),
    // },

    // {
    //   name: 'Status',
    //   selector: (row) => (
    //     <div
    //       className="status-value"
    //       style={{ backgroundColor: row && row.status === 'published' ? '#3bb77e   ' : '#ffb822' }}
    //     >
    //       {row.status}
    //     </div>
    //   ),
    // },

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
        <div className="action-btn">
          <div className="edit-btn">
            <CIcon
              className="pointer_cursor"
              icon={cilPencil}
              onClick={() => navigate(`/case/${row._id}/edit`, { state: { id: row._id } })}
            />
          </div>

          <div className="delet-btn">
            <CIcon
              className="pointer_cursor"
              icon={cilTrash}
              onClick={() => {
                setVisible(true)
                setuserId([row._id])
              }}
            />
          </div>
        </div>
      ),

      ignoreRowClick: true,
      allowoverflow: true,
      button: 'true',
    },
  ]

  return (
    <>
      <SubHeader
        subHeaderItems={subHeaderItems}
        handleFilter={(search) => handleFilter(search)}
        setSearchCurrentPage={setSearchCurrentPage}
        onReset={() => handleFilterReset()}
        searchInput={search}
        rowPerPage={rowPerPage}
        defaultPage={defaultPage}
        moduleName="cases"
        deletionType="trash"
      />

      <CContainer fluid>
        <CCard className="mb-2">
          <CCardHeader>Filter</CCardHeader>
          <CCardBody>
            <CaseFilter
              rowPerPage={rowPerPage}
              filterData={filteredData}
              setFilterData={setFilteredData}
              rabranchData
              setRAbranchData
              financenameData
              setFinancenameData
              onReset={() => {
                handleFilterReset()
              }}
              onFilter={(filterParams) => {
                const searchParams = new URLSearchParams(location.search)
                for (const key in filterParams) {
                  if (filterParams.hasOwnProperty(key)) {
                    const value = filterParams[key]
                    if (value != '') searchParams.set(key, value)
                  }
                }
                navigate({ search: searchParams.toString() })
              }}
            />
          </CCardBody>
        </CCard>

        {isCOO && <CooDataTable />}
        {isFE && <FeDataTable />}
        {isSDM && <SdmDataTable />}
        {isRA && <RA_DataTable />}
        {isDM && <DM_DataTable />}
        {isRC && <RC_DataTable />}
      </CContainer>
    </>
  )
}
