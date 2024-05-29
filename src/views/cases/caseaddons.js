import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CRow,
  CSpinner,
} from '@coreui/react'
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
import fileupload from '../../assets/images/uploadIcon.png'
import { customSuccessMSG, setAlertTimeout } from 'src/helpers/alertHelper'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilTrash } from '@coreui/icons'

import videoIcon from 'src/assets/images/video-icon.png'
import pdfIcon from 'src/assets/images/pdfIcon.png'
import docIcon from 'src/assets/images/docc.png'

import Video from 'yet-another-react-lightbox/plugins/video'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import handleSubmitHelper from 'src/helpers/submitHelper'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import SubHeader from 'src/components/custom/SubHeader'
import SingleSubHeader from 'src/components/custom/SingleSubHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBackward, faFilePdf } from '@fortawesome/free-solid-svg-icons'

const URL = process.env.REACT_APP_NODE_URL

const validationRules = {}

const CaseAddons = () => {
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

  const [initialValues, setInitialValues] = useState({
    case_addons_remarks: '',
    case_addons_images: [],
  })

  const [finalJson, setfinalJson] = useState({
    case_addons: '',
  })

  let loggedinUserRole = useSelector((state) => state?.userRole)

  const [feImagesData, srtFeImagesData] = useState([])

  const updatePageQueryParam = (paramName, page) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set(paramName, page)
    navigate({ search: searchParams.toString() })
  }

  useEffect(() => {
    setInitialValues((prev) => ({ ...prev, case_addons_images: feImagesData }))
  }, [feImagesData])

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
      formData.append('case_addon', true)

      if (formData) {
        let response = await new BasicProvider(`cases/update/${id}`, dispatch).patchRequest(
          formData,
        )

        fetchData(currentPage, rowPerPage, searchcurrentPage, search, count)
        customSuccessMSG(dispatch, 'File Uploaded Successfully !!')
        setIsLoadingSpinner(false)
      }
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
        `cms/files/by/roles/${process.env.REACT_APP_DM}?page=${currentPage}&count=${count}&id=${id}&case_addon=true`,
      ).getRequest()

      console.log('response',response);

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

  useEffect(() => {
    fetchCaseData()
  }, [])

  const fetchCaseData = async () => {
    try {
      const response = await new BasicProvider(`cases/show/${id}`).getRequest()
      if (response.data.case_addons) {
        srtFeImagesData(response?.data?.case_addons?.case_addons_images || [])
        setInitialValues({ ...response.data.case_addons })
      }
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const handleDownload = async (fullUrl) => {
    try {
      // setIsLoadingSpinner(true)
      const response = await axios.get(fullUrl, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const filename = fullUrl.split('/').pop()
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      // setIsLoadingSpinner(false)
      // customSuccessMSG(dispatch, 'File Downloaded Successfully !!')
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const handleFeImagesChange = (e, row) => {
    if (e.target.name == 'check') {
      const selected = e.target.checked
      srtFeImagesData((prevState) => {
        const existingIndex = prevState.findIndex((item) => item.image_url === row.filepath)
        if (selected) {
          if (existingIndex !== -1) {
            const updatedState = [...prevState]
            updatedState[existingIndex].selected = selected
            return updatedState
          } else {
            return [...prevState, { image_url: row.filepath, position: '', selected }]
          }
        } else {
          if (existingIndex !== -1) {
            const updatedState = [...prevState]
            updatedState.splice(existingIndex, 1)
            return updatedState
          }
          return prevState
        }
      })
    } else if (e.target.name == 'position') {
      const position = Number(e.target.value)
      srtFeImagesData((prevState) => {
        const existingIndex = prevState.findIndex((item) => item.image_url === row.filepath)
        if (existingIndex !== -1) {
          const updatedState = [...prevState]
          updatedState[existingIndex].position = position
          return updatedState
        } else {
          return [...prevState, { image_url: row.filepath, position, selected: false }]
        }
      })
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
      name: 'Name',
      selector: (row) => (
        <div className="pointer_cursor data_Table_title">
          {row.name ? row.name : <ShimmerTitle line={5} />}
        </div>
      ),
      width: '10%',
      // center: true,
    },
    {
      name: 'Size',
      selector: (row) => <div className="data_table_colum">{row.size}</div>,
      // width: '10%',
    },
    {
      name: 'Uploaded By',
      selector: (row) => (
        <div className="">
          <div className="data_table_colum pointer_cursor data_Table_title">
            {row && row.admins && row.admins.name ? `${row.admins.name}` : '-'}
          </div>
          <small style={{ color: '#61a528' }}>
            {row && row.admins && row.admins?.role?.display_name}
          </small>
        </div>
      ),
      width: '15%',
      center: 'true',
    },

    {
      name: 'Image Selection',
      selector: (row) => {
        const isImage = row.mime_type?.startsWith('image/')
        if (isImage) {
          return (
            <CFormCheck
              className="fe_image_chack data_table_colum"
              type="checkbox"
              label="Select"
              name="check"
              checked={
                feImagesData?.find((item) => item.image_url === row.filepath)?.selected || false
              }
              onChange={(e) => handleFeImagesChange(e, row)}
            />
          )
        } else {
          return null
        }
      },
    },

    {
      name: 'Position',
      selector: (row) => {
        const isImage = row.mime_type?.startsWith('image/')
        let isVisible =
          feImagesData.find((item) => item.image_url === row.filepath)?.selected || false

        if (isImage && isVisible) {
          return (
            <CFormSelect
              size="sm"
              name="position" // Corrected typo here
              aria-label="Default select example"
              onChange={(e) => handleFeImagesChange(e, row)}
            >
              <option>Select Position</option>
              {[...Array(6)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </CFormSelect>
          )
        } else {
          return '-'
        }
      },
      center: true,
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
      width: '15%',
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
      // width: '10%',
    },
  ]

  const sendToSDM = async () => {
    initialValues.case_addons_images = feImagesData

    finalJson.case_addons = initialValues

    if (feImagesData.length > 6) {
      dispatch({ type: 'set', validations: ['You only selected 6 images '] })
      return
    }

    try {
      // const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      // if (data === false) return

      let response = await new BasicProvider(`cases/update/${id}`, dispatch).patchRequest(finalJson)
      console.log('update response', response)
      setAlertTimeout(dispatch)
    } catch (error) {
      console.log(error)
      // dispatch({ type: 'set', catcherror: error.data })
      dispatch({ type: 'set', validations: [error.data] })
    }
  }

  return (
    <>
      <SingleSubHeader moduleName="Case Addons" />
      <CContainer fluid>
        <CRow className="justify-content-end">
          {/* <CCol md={3} >
              <CCard className="py-2 pb-2 px-2 text-center submit_btn report_genrate_btn">
                <div className="mb-1"><FontAwesomeIcon icon={faFilePdf} /> Case Addons Pdf</div>
              </CCard>
          </CCol> */}
          <CCol md={3}>
            <CCard
              className="py-2 pb-2 px-2 text-center submit_btn report_genrate_btn"
              onClick={() => navigate(`/case/${id}/update/details/by/${loggedinUserRole.name}`)}
            >
              <div className="mb-1">
                <FontAwesomeIcon className="me-1" icon={faArrowLeft} />
                Back to report
              </div>
            </CCard>
          </CCol>
        </CRow>
        <CRow className="mt-2 mb-4">
          <CCol md={12}>
            <CCard>
              <CCardHeader>Custom Remarks</CCardHeader>
              <CCardBody>
                <CKEditor
                  type=""
                  name="content"
                  editor={ClassicEditor}
                  config={{
                    ckfinder: {
                      uploadUrl: '',
                    },
                  }}
                  data={initialValues.case_addons_remarks}
                  onChange={(e, editor) => {
                    const data = editor.getData()
                    setInitialValues((previewValue) => ({
                      ...previewValue,
                      case_addons_remarks: data,
                    }))
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CCard>
          <CCardHeader>Additional Images</CCardHeader>
          <CCardBody>
            <CRow>
              {isLoadingSpinner ? (
                <div className=" spinner_outerbox">
                  <div className="text-center">
                    {/* <CSpinner color="secondary" className="spinner" /> */}
                    <CSpinner size="lg" style={{ width: '3rem', height: '3rem' }} />
                  </div>
                </div>
              ) : (
                <CCol className="mb-4">
                  <div ref={wrapperRef} className="upload_files">
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
            {selectedFile && (
              <Lightbox
                open={lgihtboxopen}
                plugins={[Video]}
                close={() => setLightBoxOpen(false)}
                slides={[
                  {
                    type: selectedFile.mime_type?.startsWith('video/') ? 'video' : 'image',
                    sources: selectedFile.mime_type?.startsWith('video/')
                      ? [
                          {
                            src: `${URL}/${selectedFile.filepath}`,
                            type: 'video/mp4',
                          },
                        ]
                      : [],
                    src: `${URL}/${selectedFile.filepath}`,
                  },
                ]}
                Video={{
                  controls,
                  playsInline,
                  autoPlay,
                  loop,
                  muted,
                  disablePictureInPicture,
                  disableRemotePlayback,
                  controlsList: controlsList.join(' '),
                  crossOrigin,
                  preload,
                }}
              />
            )}
          </CCardBody>
        </CCard>
        <CCard className="mt-2">
          <CCardBody className="text-center">
            <CButton className="btn btn-primary me-2  submit_btn" onClick={() => sendToSDM()}>
              Submit
            </CButton>
          </CCardBody>
        </CCard>
      </CContainer>
    </>
  )
}

export default CaseAddons
