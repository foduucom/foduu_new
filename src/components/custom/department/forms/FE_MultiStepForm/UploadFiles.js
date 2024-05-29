import {
  CButton,
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
import fileupload from '../../../../../assets/images/uploadIcon.png'
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
import AdditionalFieldsForm from './additionalFieldsForm'

const URL = process.env.REACT_APP_NODE_URL
const validationRules = {
  required_photos_check: {
    required: true,
  },
}

const UploadFiles = ({
  initialValues,
  setInitialValues,
  currentStep,
  setCurrentStep,
  additionalFields,
  setAdditionalFields,
  additionalJson,
  setAdditionalJson,
}) => {
  // console.log('FE additionalFields', additionalFields)

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

  const [errors, setErrors] = useState(null)
  const [isNext, setIsNext] = useState(true)

  const updatePageQueryParam = (paramName, page) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set(paramName, page)
    navigate({ search: searchParams.toString() })
  }

  const handleNextStep = async () => {
    setCurrentStep((current) => (current < totalSteps ? current + 1 : current))
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
  console.log('openlightbox', selectedFile)
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

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    setInitialValues({
      ...initialValues,
      required_photos_check: {
        ...initialValues?.required_photos_check,
        [name]: checked,
      },
    })
    setErrors('')
  }

  const handleSubmit = async (fileData) => {
    console.log('fileData', fileData)
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

      console.log('fileData', fileData)
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
        `cms/files/by/roles/${process.env.REACT_APP_FE}?paeg=${currentPage}&count=${count}&id=${id}`,
      ).getRequest()

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
      width: '15%',
    },
    {
      name: 'Name',
      selector: (row) => (
        <div className="pointer_cursor data_Table_title">
          {row.name ? row.name : <ShimmerTitle line={5} />}
        </div>
      ),
      width: '40%',
      center: true,
    },

    {
      name: 'Size',
      selector: (row) => <div className="data_table_colum">{row.size}</div>,
      // width: '25%',
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
      width: '25%',
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
      // width: '25%',
    },
  ]

  const isAllRequiredPhotosChecked = () => {
    const { required_photos_check } = initialValues
    return required_photos_check && Object.values(required_photos_check).every((checked) => checked)
  }

  const sendToSDM = async (e) => {
    e.preventDefault()

    initialValues.status = 'visit done'
    initialValues.additional_fields = additionalJson

    console.log('initialValues?.required_photos_check', initialValues?.required_photos_check)

    console.log('<<errors>>', errors)

    if (isAllRequiredPhotosChecked()) {
      setErrors('')
    } else {
      setErrors('Please check all required fields.')
      return
    }

    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) return

      let response = await new BasicProvider(`cases/update/${id}`, dispatch).patchRequest(data)

      setAlertTimeout(dispatch)
    } catch (error) {
      console.log(error)
      // dispatch({ type: 'set', catcherror: error.data })
      dispatch({ type: 'set', validations: [error.data] })
    }
  }

  // console.log('additionalFields=============', additionalFields)
  // console.log('additionalJson===============', additionalJson)

  return (
    <>
      <div>
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

          <CForm className="g-3 needs-validation mb-3 mb-4 coo-form " onSubmit={sendToSDM}>
            <hr />
            <div className="">
              <CFormLabel className="ms-1">Required Photo Check :- </CFormLabel>
              <CInputGroup className="has-validation mt-1 required-photo ">
                <CFormCheck
                  className="d-flex align-items-center ps-2"
                  inline
                  type="checkbox"
                  id="selfieCheckbox"
                  name="selfie"
                  label="Selfie With Property"
                  checked={initialValues?.required_photos_check?.selfie}
                  onChange={handleCheckboxChange}
                />
                <CFormCheck
                  className="d-flex align-items-center ps-2"
                  inline
                  type="checkbox"
                  id="selfieCheckbox"
                  name="applicant_selfie"
                  label="Selfie With Applicant"
                  checked={initialValues?.required_photos_check?.applicant_selfie}
                  onChange={handleCheckboxChange}
                />
                <CFormCheck
                  className="d-flex align-items-center ps-2"
                  inline
                  type="checkbox"
                  id="selfieCheckbox"
                  name="property_selfie"
                  label="2 Side Road Photo With Property"
                  checked={initialValues?.required_photos_check?.property_selfie}
                  onChange={handleCheckboxChange}
                />
                <CFormCheck
                  className="d-flex align-items-center ps-2"
                  inline
                  type="checkbox"
                  id="eBillCheckbox"
                  name="e_bill"
                  label="E-BILL"
                  checked={initialValues?.required_photos_check?.e_bill}
                  onChange={handleCheckboxChange}
                />
                <CFormCheck
                  className="d-flex align-items-center ps-2 "
                  inline
                  type="checkbox"
                  id="mapCheckbox"
                  name="map"
                  label="drow the property map"
                  checked={initialValues?.required_photos_check?.map}
                  onChange={handleCheckboxChange}
                />
              </CInputGroup>
            </div>
            <div className="mt-4">{errors && <small className="text-danger">{errors}</small>}</div>

            <AdditionalFieldsForm
              additionalFields={additionalFields}
              setAdditionalFields={setAdditionalFields}
              additionalJson={additionalJson}
              setAdditionalJson={setAdditionalJson}
            />
          </CForm>

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

          <div className="text-center mb-4">
            {currentStep > 1 && currentStep != totalSteps && (
              <CButton
                className="btn btn-success me-2 mt-2 mFt-2 next w-lg-17 w-sm-auto submit_btn"
                type="button"
                onClick={handlePreviousStep}
              >
                Prev
              </CButton>
            )}

            {currentStep === totalSteps - 1 && id != undefined && (
              <CButton
                className="btn btn-success text-white me-2 mt-2 mFt-2 next w-lg-17 w-sm-auto"
                type="submit"
                onClick={(e) => {
                  sendToSDM(e)

                  if (isNext && isAllRequiredPhotosChecked()) {
                    handleNextStep()
                  }
                }}
              >
                Submit
              </CButton>
            )}

            {currentStep < totalSteps - 1 && (
              <CButton
                className="btn-warning btn me-2 mx-3 w-lg-17 w-sm-auto"
                onClick={handleNextStep}
              >
                Next
              </CButton>
            )}
          </div>
        </CRow>
      </div>

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
          Video={
            {
              // controls,
              // playsInline,
              // autoPlay,
              // loop,
              // muted,
              // disablePictureInPicture,
              // disableRemotePlayback,
              // controlsList: controlsList.join(' '),
              // crossOrigin,
              // preload,
            }
          }
        />
      )}
    </>
  )
}

export default UploadFiles
