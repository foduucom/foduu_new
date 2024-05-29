import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { cilPencil, cilSpreadsheet, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
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
  CFormTextarea,
  CInputGroup,
  CRow,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import SingleSubHeader from 'src/components/custom/SingleSubHeader'
import BasicProvider from 'src/constants/BasicProvider'

import { RowsPerPage } from 'src/constants/variables'
import { DeleteModal } from 'src/helpers/deleteModalHelper'
import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
import { useEffectFormData } from 'src/helpers/formHelpers'
import handleSubmitHelper from 'src/helpers/submitHelper'
import { setAlertTimeout } from 'src/helpers/alertHelper'
import { ShimmerTable } from 'react-shimmer-effects'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import moment from 'moment'

const validationRules = {
  subject: {
    required: true,
    minLength: 3,
  },

  message: {
    required: true,
  },
}

var subHeaderItems = [
  {
    name: 'Create',
    link: '/master/templates',
    icon: cilSpreadsheet,
  },
]
export default function Createtemplates() {
  var params = useParams()
  const [otherSelected, setOtherSelected] = useState(false)
  const [userId, setuserId] = useState([])
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const id = params.id
  const isEditMode = !!id
  const [selectedType, setSelectedType] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)
  const data = useSelector((state) => state.data?.templates) || []
  const [rowPerPage, setRowPerPage] = useState(null)
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  const [searchcurrentPage, setSearchCurrentPage] = useState(null)
  const query = new URLSearchParams(location.search)
  var count = query.get('count') || rowPerPage
  var currentPage = parseInt(query.get('page') || 1)
  var search = query.get('search') || ''
  let [defaultPage, setDefaultPage] = useState(currentPage)
  const totalCount = useSelector((state) => state.totalCount)
  const dispatch = useDispatch()
  const toggleCleared = useSelector((state) => state.toggleCleared)
  const [typeValues, setTypeValues] = useState([])

  const updatePageQueryParam = (paramName, page) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set(paramName, page)
    navigate({ search: searchParams.toString() })
  }

  //   useEffect(() => {
  //     const fetchSelectedRows = async () => {
  //       const savedSelectedRows = await handleSelectedRowChange('templates')
  //       if (savedSelectedRows) {
  //         setRowPerPage(savedSelectedRows)
  //       }
  //     }
  //     fetchSelectedRows()
  //   }, [])

  const [initialValues, setInitialValues] = useState({
    subject: '',
    message: '',
  })

  useEffect(() => {
    setInitialValues({
      subject: '',
      message: '',
    })
  }, [navigate])

  useEffect(() => {
    if (rowPerPage) fetchAllData(page, rowPerPage)
  }, [page, rowPerPage])

  useEffect(() => {
    dispatch({ type: 'set', validations: [] })
    fetchSingleData()
  }, [navigate])

  const fetchSingleData = async () => {
    try {
      if (isEditMode) {
        const response = await new BasicProvider(`templates/show/${id}`).getRequest()
        setInitialValues({ ...response.data })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAllData = async (page, perPage) => {
    try {
      const response = await new BasicProvider(
        `templates?page=${page}&count=${perPage}`,
      ).getRequest()
      dispatch({ type: 'set', data: { templates: response.data.data } })
      dispatch({ type: 'set', totalCount: response.data.total })
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchSelectedRows = async () => {
      const savedSelectedRows = await handleSelectedRowChange('templates')
      if (savedSelectedRows) {
        setRowPerPage(savedSelectedRows)
      }
    }
    fetchSelectedRows()
  }, [])

  const handleRowChange = useCallback((state) => {
    dispatch({ type: 'set', selectedrows: state.selectedRows })
  }, [])

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInitialValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return
      var response
      if (isEditMode) {
        response = await new BasicProvider(`templates/update/${id}`, dispatch).patchRequest(data)
        fetchAllData(page, rowPerPage)
      } else {
        response = await new BasicProvider(`templates/create`, dispatch).postRequest(data)
        setInitialValues({
          subject: '',
          message: '',
        })
        fetchAllData(page, rowPerPage)
      }
      setAlertTimeout(dispatch)
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    {
      name: 'Subject',
      selector: (row) => (
        <div onClick={() => navigate(`/case/show`)} className="data_table_colum">
          {row && row.subject ? row.subject : '-'}
        </div>
      ),
    },

    {
      name: 'Message',
      selector: (row) => (
        <div className="data_table_colum">{row && row.message ? row.message : '-'}</div>
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
        <div className="action-btn">
          <div className="MailLogdelet-btn" color="info">
            <CIcon
              className="pointer_cursor"
              icon={cilPencil}
              onClick={() => navigate(`/master/template/${row._id}/edit`)}
            />
          </div>

          <div className="delet-btn">
            <CIcon
              className="pointer_cursor"
              icon={cilTrash}
              onClick={() => {
                setSelectedRowForModule(row)
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
      <SingleSubHeader moduleName="templates" subHeaderItems={subHeaderItems} />
      <CContainer fluid className="px-4">
        <CForm className="g-3 needs-validation" onSubmit={handleSubmit}>
          <CRow>
            <CCol md={4}>
              <CCard>
                <CCardHeader>Create Template</CCardHeader>
                <CCardBody>
                  <div className="mb-3">
                    <CFormLabel>
                      Subject<span className="text-danger">*</span>
                    </CFormLabel>
                    <CInputGroup className="has-validation">
                      <input
                        type="text"
                        name="subject"
                        value={initialValues.subject ?? ''}
                        className="form-control"
                        placeholder="Subject"
                        onChange={handleOnChange}
                      />
                    </CInputGroup>
                  </div>
                  <div className="mb-3">
                    <CFormLabel>
                      Message<span className="text-danger">*</span>
                    </CFormLabel>
                    <CInputGroup className="has-validation">
                      <textarea
                        type="text"
                        name="message"
                        value={initialValues.message ?? ''}
                        className="form-control"
                        placeholder="Message"
                        onChange={handleOnChange}
                      />
                    </CInputGroup>
                  </div>

                  {!isEditMode && (
                    <CButton
                      className="btn btn-primary me-2 mt-2 submit_btn"
                      type="submit"
                      name="buttonClicked"
                      value="submit"
                    >
                      Submit
                    </CButton>
                  )}

                  {isEditMode && (
                    <CButton
                      className="btn btn-secondary me-2 mt-2"
                      type="submit"
                      name="buttonClicked"
                      value="update"
                    >
                      Update
                    </CButton>
                  )}
                  <CButton
                    color="danger"
                    className="mt-2 text-light"
                    onClick={() => {
                      navigate('/master/templates')
                      setInitialValues({ initialValues })
                    }}
                  >
                    Cancel
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={8}>
              <div className="datatable">
                {isLoading || data.length <= 0 ? (
                  <div className="custom-table-shimmer">
                    <ShimmerTable row={10} />
                  </div>
                ) : (
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
                      selectableRowsHighlight
                      highlightOnHover
                      paginationRowsPerPageOptions={RowsPerPage}
                      paginationPerPage={rowPerPage}
                      onChangeRowsPerPage={(value) => {
                        count = value
                        setRowPerPage(value)
                        updatePageQueryParam('count', value)
                        setSelectedRowForModule('templates', value)
                      }}
                      onSelectedRowsChange={(state) => handleRowChange(state)}
                      clearSelectedRows={toggleCleared}
                    />
                  </div>
                )}
              </div>

              <DeleteModal
                visible={visible}
                userId={userId}
                moduleName="templates"
                currentPage={currentPage}
                rowPerPage={rowPerPage}
                setVisible={setVisible}
                deletionType="delete"
                handleClose={() => setVisible(false)}
                isDirectDelete={true}
              />
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
    </>
  )
}
