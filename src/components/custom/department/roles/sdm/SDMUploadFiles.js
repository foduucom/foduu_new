import {
  CButton,
  CCol,
  CFormLabel,
  CRow,
  CSpinner,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import Select from 'react-select'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { RowsPerPage } from 'src/constants/variables'

import { ShimmerTable, ShimmerTitle } from 'react-shimmer-effects'
import BasicProvider from 'src/constants/BasicProvider'
import { DeleteModal } from 'src/helpers/deleteModalHelper'
import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
import axios from 'axios'
import fileupload from '../../../../../assets/images/uploadIcon.png'
import { customSuccessMSG, setAlertTimeout } from 'src/helpers/alertHelper'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilTrash, cilChevronCircleUpAlt } from '@coreui/icons'
import videoIcon from 'src/assets/images/video-icon.png'
import pdfIcon from 'src/assets/images/pdfIcon.png'
import docIcon from 'src/assets/images/docc.png'

import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import AsyncSelect from 'react-select/async'

import { handleDownload } from 'src/constants/common'
import handleSubmitHelper from 'src/helpers/submitHelper'

const URL = process.env.REACT_APP_NODE_URL

const validationRules = {
  dm: {
    required: true,
  },
}

const SDMUploadFiles = ({ currentStep, setCurrentStep }) => {
  const totalSteps = 8
  const handlePreviousStep = () => {
    setCurrentStep((current) => (current > 1 ? current - 1 : current))
  }

  var params = useParams()
  const id = params.id
  const navigate = useNavigate()
  const isEditMode = !!id

  const wrapperRef = useRef(null)
  const fileInputRef = useRef(null)

  // FOR DATA TABLE
  const [selectedFile, setSelectedFile] = useState(null)
  const [lgihtboxopen, setLightBoxOpen] = React.useState(false)
  const [rowPerPage, setRowPerPage] = useState(null)
  const location = useLocation()

  const [userId, setuserId] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [visible, setVisible] = useState(false)
  const [searchcurrentPage, setSearchCurrentPage] = useState(null)

  const [isLoadingSpinner, setIsLoadingSpinner] = useState(false)

  const query = new URLSearchParams(location.search)
  var count = query.get('count') || rowPerPage || 20
  var currentPage = parseInt(query.get('page') || 1)
  var search = query.get('search') || ''
  let [defaultPage, setDefaultPage] = useState(currentPage)
  const dispatch = useDispatch()
  const data = useSelector((state) => state.data?.files)
  const toggleCleared = useSelector((state) => state.toggleCleared)
  const totalCount = useSelector((state) => state.totalCount)

  const updatePageQueryParam = (paramName, page) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set(paramName, page)
    navigate({ search: searchParams.toString() })
  }

  useEffect(() => {
    const fetchSelectedRows = async () => {
      const savedSelectedRows = await handleSelectedRowChange('files')
      if (savedSelectedRows && !count) {
        setRowPerPage(savedSelectedRows)
      } else {
        setRowPerPage(count)
      }
    }
    fetchSelectedRows()
  }, [count])

  useEffect(() => {
    setIsLoadingSpinner(false)
  }, [])

  const handleRowChange = useCallback((state) => {
    const rows = state.selectedRows
    const rowsId = rows.map((item) => item._id)
    dispatch({ type: 'set', selectedrows: rowsId })
  }, [])

  const onDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    handleFiles(files)
    wrapperRef.current.classList.remove('dragover')
  }

  const openLightbox = (file) => {
    setSelectedFile(file)
    setLightBoxOpen(true)
  }
  // console.log('openlightbox', selectedFile)
  const handleFiles = async (files) => {
    try {
      const fileData = Array.from(files)

      await handleSubmit(fileData)
    } catch (error) {
      console.error('Error handling files:', error)
    }
  }

  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onFileInputChange = (e) => {
    handleFiles(e.target.files)
  }

  useEffect(() => {
    const wrapper = wrapperRef.current

    const onDragEnter = (e) => {
      e.preventDefault()
      e.stopPropagation()
      wrapper.classList.add('dragover')
    }

    const onDragLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()
      wrapper.classList.remove('dragover')
    }

    if (wrapper) {
      wrapper.addEventListener('dragenter', onDragEnter)
      wrapper.addEventListener('dragover', onDragOver)
      wrapper.addEventListener('dragleave', onDragLeave)
      wrapper.addEventListener('drop', onDrop)
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener('dragenter', onDragEnter)
        wrapper.removeEventListener('dragover', onDragOver)
        wrapper.removeEventListener('dragleave', onDragLeave)
        wrapper.removeEventListener('drop', onDrop)
      }
    }
  }, [])

  const handleSubmit = async (fileData) => {
    setIsLoadingSpinner(true)
    try {
      const formData = new FormData()
      if (fileData.length > 0) {
        for (let i = 0; i < fileData.length; i++) {
          formData.append('gallery', fileData[i])
        }
      }

      if (formData) {
        let response = await new BasicProvider(`cases/update/${id}`, dispatch).patchRequest(
          formData,
        )

        fetchData(currentPage, rowPerPage, searchcurrentPage, search, count)
        customSuccessMSG(dispatch, 'File Uploaded Successfully !!')
        setIsLoadingSpinner(false)
      }

      // console.log('fileData', fileData)
    } catch (error) {
      console.error('Error uploading files:', error)
      setIsLoadingSpinner(false)
    }
  }

  useEffect(() => {
    if (rowPerPage) {
      fetchData(currentPage, rowPerPage, searchcurrentPage, search, count)
    }
  }, [currentPage, rowPerPage, searchcurrentPage, search, count])

  const fetchData = async (currentPage, rowPerPage, searchcurrentPage, search, count) => {
    try {
      var queryData = {}
      for (const [key, value] of query.entries()) {
        if (key !== 'page' && key !== 'count') {
          queryData[key] = value
        }
      }

      const response = await new BasicProvider(
        `cms/files?paeg=${currentPage}&count=${count}&id=${id}`,
      ).getRequest()

      // console.log('SDM Data', response)

      dispatch({ type: 'set', data: { files: response.data.data } })
      dispatch({ type: 'set', totalCount: response.data.total })
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setTimeout(() => {
        setIsLoading(false)
      }, [])
    }
  }

  const columns = [
    {
      name: 'File',
      selector: (row) => {
        const isImage = row.mime_type?.startsWith('image/')
        const isVideo = row.mime_type?.startsWith('video/')
        const isPDF = row.mime_type?.startsWith('application/pdf')
        const isDOc = row.mime_type?.startsWith(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        )
        if (isImage) {
          return (
            <div className="data_table_column" onClick={() => openLightbox(row)}>
              <img
                src={`${URL}/${row.filepath}`}
                alt={row.name}
                style={{ width: '45px', height: '45px', padding: '7px' }}
              />
            </div>
          )
        } else if (isVideo) {
          return (
            <div className="data_table_column" onClick={() => openLightbox(row)}>
              <img
                src={videoIcon}
                alt={row.name}
                style={{ width: '45px', height: '45px', padding: '7px' }}
              />
            </div>
          )
        } else if (isPDF) {
          return (
            <div className="data_table_column" onClick={() => openLightbox(row)}>
              <img
                src={pdfIcon}
                alt={row.name}
                style={{ width: '45px', height: '45px', padding: '7px' }}
              />
            </div>
          )
        } else if (isDOc) {
          return (
            <div className="data_table_column" onClick={() => openLightbox(row)}>
              <img
                src={docIcon}
                alt={row.name}
                style={{ width: '45px', height: '45px', padding: '7px' }}
              />
            </div>
          )
        }
      },
      width: '10%',
    },
    {
      name: 'File Name',
      selector: (row) => (
        <div className="pointer_cursor data_Table_title">
          {row.name ? row.name : <ShimmerTitle line={5} />}
        </div>
      ),
      width: '30%',
      // center: true,
    },
    {
      name: 'Uploaded By',
      selector: (row) => (
        <div className="">
          {/* {console.log('ROWWW',row)} */}
          <div className="data_table_colum pointer_cursor data_Table_title">
            {row && row.admin && row.admin.name ? `${row.admin.name}` : '-'}
          </div>
          <small>{row && row.admin && row.admin.role[0].display_name}</small>
        </div>
      ),
      width: '20%',
      center: 'true',
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
      width: '20%',
      center: 'true',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-btn">
          <div className="download-btn edit-btn">
            <CIcon
              className="pointer_cursor"
              icon={cilCloudDownload}
              onClick={() => handleDownload(`${URL}/${row.filepath}`)}
            />
          </div>
          <div className="download-btn ms-2 delet-btn">
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
      width: '10%',
      ignoreRowClick: true,
      allowoverflow: true,
      button: 'true',
    },
  ]


  // -------------------------------- ASSIGN DM Data Handler -------------------------------- //

  const [defaultOptionDM, setDefaultOptionDM] = useState([])

  const [initialValues, setInitialValues] = useState({
    status: 'pending for draft',
    dm: '',
    ids: [],
  })

  const sendToDM = async () => {
    // console.log('INIT=====DM',initialValues);
    // return

    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return

      let response = await new BasicProvider(`cases/assign/dm`, dispatch).patchRequest(data)
      if (response.status === 'success') {
        customSuccessMSG(dispatch, 'Assigned Successfuly')
        navigate('/case/all')
      }
    } catch (error) {
      console.log(error)
      // dispatch({ type: 'set', catcherror: error.data })
      dispatch({ type: 'set', validations: [error.data] })
    }
  }

  useEffect(() => {
    fetchDefaultOptionForDM()
    setInitialValues((prev) => ({ ...prev, ids: [id] }))
  }, [id])

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

  return (
    <>
      <div>
        <CRow className="mt-4">
          <CCol md={12}>
            <CCard className="applicant-details">
              <CCardHeader className="d-flex justify-content-between align-items-center c-card-headerSdm rounded">
                Upload Files
                <CIcon icon={cilChevronCircleUpAlt} size="xl" />
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CRow className="mb-4 mt-4">
                    {isLoadingSpinner ? (
                      <div className=" spinner_outerbox">
                        <div className="text-center">
                          {/* <CSpinner color="secondary" className="spinner" /> */}
                          <CSpinner size="lg" style={{ width: '3rem', height: '3rem' }} />
                        </div>
                      </div>
                    ) : (
                      <CCol>
                        <div ref={wrapperRef} className="upload_files ms-4">
                          <div className="file_upload">
                            <img src={fileupload} alt="" width={50} />
                            <p>Drag & Drop your files here</p>
                          </div>

                          <input
                            name="gallery"
                            type="file"
                            accept="image/*, video/*, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            ref={fileInputRef}
                            style={{ display: 'block' }}
                            multiple
                            onChange={onFileInputChange}
                          />
                        </div>
                      </CCol>
                    )}
                  </CRow>

                  <div className="datatable">
                    {isLoading ? (
                      <ShimmerTable row={totalCount} />
                    ) : (
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
                        // selectableRows
                        selectableRowsHighlight
                        highlightOnHover
                        paginationRowsPerPageOptions={RowsPerPage}
                        paginationPerPage={rowPerPage}
                        onChangeRowsPerPage={(value) => {
                          count = value
                          setRowPerPage(value)
                          updatePageQueryParam('count', value)
                          setSelectedRowForModule('files', value)
                        }}
                        onSelectedRowsChange={(state) => handleRowChange(state)}
                        clearSelectedRows={toggleCleared}
                      />
                    )}
                  </div>

                  <DeleteModal
                    visible={visible}
                    userId={userId}
                    moduleName="cms/files"
                    currentPage={currentPage}
                    rowPerPage={rowPerPage}
                    setVisible={setVisible}
                    deletionType="delete"
                    handleClose={() => setVisible(false)}
                    isDirectDelete={true}
                    isFileWithPatams={true}
                    isCaseDelete={true}
                    selectedCaseId={id}
                  />
                </CRow>
                <CRow md={9} className="d-flex align-items-center">
                  <CCol xs="4" className="align-items-center mb-0">
                    <CFormLabel>Assign to DM</CFormLabel>
                    <AsyncSelect
                      name="dm"
                      loadOptions={(inputValue, callback) => loadOptionsForDM(inputValue, callback)}
                      defaultOptions={defaultOptionDM}
                      value={
                        defaultOptionDM.find(
                          (option) =>
                            option.value === (initialValues?.dm?._id || initialValues?.dm),
                        ) || null
                      }
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      onChange={(selected) =>
                        setInitialValues({ ...initialValues, dm: selected.value })
                      }
                    />
                  </CCol>
                  <CCol className="mt-4">
                    <CButton onClick={sendToDM} className="btn btn-success text-white">
                      Assign Case
                    </CButton>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {selectedFile && (
        <Lightbox
          open={lgihtboxopen}
          close={() => setLightBoxOpen(false)}
          slides={[{ src: `${URL}/${selectedFile.filepath}` }]}
        />
      )}
    </>
  )
}

export default SDMUploadFiles
