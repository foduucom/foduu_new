import {
  cilCheck,
  cilCheckAlt,
  cilDelete,
  cilPencil,
  cilSpreadsheet,
  cilTrash,
  cilCheckCircle,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { RowsPerPage } from 'src/constants/variables'
import HelperFunction from '../../helpers/HelperFunctions'
import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
import { DeleteModal, handleConfirmDelete } from 'src/helpers/deleteModalHelper'
import BasicProvider from 'src/constants/BasicProvider'
import noImage from 'src/assets/images/noImage.png'
import { ShimmerTable, ShimmerTitle } from 'react-shimmer-effects'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import SingleSubHeader from 'src/components/custom/SingleSubHeader'

export default function PendingCase() {
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
  const data = useSelector((state) => state.data?.pendingcases)
  const toggleCleared = useSelector((state) => state.toggleCleared)
  const totalCount = useSelector((state) => state.totalCount)
  const [popVisible, setPopVisible] = useState(false)
  const [popRejectVisible, setPopRejectVisible] = useState(false)

  const loggedInUser = useSelector((state) => state.userData)
  let loggedInUserId = loggedInUser._id

  const updatePageQueryParam = (paramName, page) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set(paramName, page)
    navigate({ search: searchParams.toString() })
  }

  // console.log('data', data)

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
        response = await new BasicProvider(
          `cases/pending/cases?page=${currentPage}&count=${count}`,
        ).getRequest()
      }

      dispatch({ type: 'set', data: { pendingcases: response.data.data } })
      dispatch({ type: 'set', totalCount: response.data.total })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchSelectedRows = async () => {
      const savedSelectedRows = await handleSelectedRowChange('pendingcases')
      if (savedSelectedRows && !count) {
        setRowPerPage(savedSelectedRows)
      } else {
        setRowPerPage(count)
      }
    }
    fetchSelectedRows()
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
    setSearchCurrentPage(1)
    currentPage = 1
    setDefaultPage(1)
    navigate({ search: '' })
  }

  const handleAcceptCase = async (caseId) => {
    try {
      let response = await new BasicProvider(`cases/update/${caseId}`, dispatch).patchRequest({
        accepted_by: loggedInUserId,
        status: 'accepted by fe',
      })
      if (response) {
        setPopVisible(!popVisible)
        fetchData()
        setTimeout(() => {
          setPopVisible(false)
        }, [2000])
      }
    } catch (error) {}
  }

  
  const columns = [
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
    // {
    //   name: 'Contact Number',
    //   selector: (row) => <div className="data_table_colum">{row && row.contact_number_1 ? row.contact_number_1:'-'}</div>,
    // },
    {
      name: 'Finance Name',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row?.finance_name?.name ? row.finance_name.name : '-'}
        </div>
      ),
    },
    // {
    //   name: 'Product Name',
    //   selector: (row) => <div className="data_table_colum">{row.product_name}</div>,
    // },
    {
      name: 'RA Branch',
      selector: (row) => (
        <div className="data_table_colum">
          {row && row?.ra_branch?.name ? row?.ra_branch?.name : '-'}
        </div>
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
        <div>
          <CustomTooltip content="Accept">
            <button
              className="btn btn-success text-white me-2 fs-14"
              onClick={() => {
                handleAcceptCase(row._id)
              }}
            >
              <CIcon icon={cilCheckAlt} size="md" /> Accept
            </button>
          </CustomTooltip>

          <div className="d-flex align-items-center justify-content-center w-20"></div>
        </div>
      ),
      width: '25%',
      center: 'true',
    },
  ]

  return (
    <>
      <SingleSubHeader moduleName="My Pending Cases" />

      <CContainer fluid>
        <>
          {true && (
            <div className="datatable">
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
                  setSelectedRowForModule('pendingcases', value)
                }}
                onSelectedRowsChange={(state) => handleRowChange(state)}
                clearSelectedRows={toggleCleared}
              />
            </div>
          )}
        </>

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

        <CModal
          alignment="center"
          visible={popVisible}
          onClose={() => setPopVisible(false)}
          className="delete_item_box"
        >
          <CModalBody className="text-center mt-4">
            {/* <CModalHeader onClose={() => setPopVisible(false)}></CModalHeader> */}

            <div className="logo_check m-auto mb-5">✓</div>
            <h1 className="h4">Accepted Successfully</h1>
          </CModalBody>
          <CModalFooter className="model_footer justify-content-center mb-3 pt-0"></CModalFooter>
        </CModal>
        <CModal
          alignment="center"
          visible={popRejectVisible}
          onClose={() => setPopRejectVisible(false)}
          className="delete_item_box"
        >
          <CModalHeader onClose={() => setPopRejectVisible(false)}>
            <CModalTitle id="StaticBackdropExampleLabel">Reason For Reject</CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CFormTextarea
              placeholder="Leave a comment here"
              id="floatingTextarea2"
              style={{ height: '100px' }}
            ></CFormTextarea>
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" className="text-white">
              Submit
            </CButton>
          </CModalFooter>
        </CModal>
      </CContainer>
    </>
  )
}
