import {
  cilCloudDownload,
  cilPen,
  cilPencil,
  cilPrint,
  cilSpreadsheet,
  cilTrash,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CSpinner,
} from '@coreui/react'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
// import SubHeader from 'src/components/custom/SubHeader'
import { RowsPerPage } from 'src/constants/variables'
import HelperFunction from '../../helpers/HelperFunctions'
import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
import { DeleteModal, handleConfirmDelete } from 'src/helpers/deleteModalHelper'
import BasicProvider from 'src/constants/BasicProvider'
import noImage from 'src/assets/images/noImage.png'
import { ShimmerTable, ShimmerTitle } from 'react-shimmer-effects'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import SingleSubHeader from 'src/components/custom/SingleSubHeader'
import Pdf from 'src/components/PdfPreview'
import { faDownload, faPencil, faPrint } from '@fortawesome/free-solid-svg-icons'
import { useEffectFormData } from 'src/helpers/formHelpers'
import commoncasedetails from 'src/components/custom/department/commoncasedetails'
import CommonCaseDetails from 'src/components/custom/department/commoncasedetails'
import { convertUtcToDate, convertUtcToDateWithTime, handleDownload } from 'src/constants/common'
import axios from 'axios'
import PdfPreview from 'src/components/PdfPreview'
import ShowPdfReview from 'src/components/showPdfReview'

export default function Casedetail() {
  var params = useParams()
  const id = params.id
  const navigate = useNavigate()
  const [rowPerPage, setRowPerPage] = useState(null)
  const location = useLocation()

  const [userId, setuserId] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  //const [currentStep, setCurrentStep] = useState(1)
  //const totalSteps = 8

  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  const [visible, setVisible] = useState(false)
  const [searchcurrentPage, setSearchCurrentPage] = useState(null)
  const query = new URLSearchParams(location.search)
  var count = query.get('count') || rowPerPage
  var currentPage = parseInt(query.get('page') || 1)
  var search = query.get('search') || ''
  let [defaultPage, setDefaultPage] = useState(currentPage)

  const [feAttachments, setFeAttachments] = useState([])
  const [sdmAttachments, setSdmAttachments] = useState([])
  const [caseUpdateLog, setcaseUpdateLog] = useState([])

  const feRole = process.env.REACT_APP_FE
  const sdmRole = process.env.REACT_APP_SDM
  const URL = process.env.REACT_APP_NODE_URL

  const dispatch = useDispatch()

  const [initialValues, setInitialValues] = useState('')

  const [pdfURL, setPdfURL] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await new BasicProvider(`cases/show/${id}`).getRequest()
      const response = data.data
      setInitialValues(response)

      const feFileResponse = await new BasicProvider(
        `cms/files/by/roles/${feRole}?paeg=${1}&count=${10}&id=${id}`,
      ).getRequest()

      const feFiles = feFileResponse.data.data

      setFeAttachments(feFiles && feFiles.reverse())

      const sdmFileResponse = await new BasicProvider(
        `cms/files/by/roles/${sdmRole}?paeg=${1}&count=${10}&id=${id}`,
      ).getRequest()

      const sdmFiles = sdmFileResponse.data.data
      setSdmAttachments(sdmFiles)

      const caseUpdateLogRes = await new BasicProvider(
        `case-update-logs?paeg=${1}&count=${5}&id=${id}`,
      ).getRequest()

      setcaseUpdateLog(caseUpdateLogRes?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  const updatedFinance = initialValues?.finance_name?.fields?.map((item) => {
    const matchedData = Object.entries(initialValues).find(([key, value]) => item.title === key)
    if (matchedData) {
      item.value = matchedData[1]
    } else {
      item.value = ''
    }

    return item
  })

  useEffect(() => {
    generateReport()
  }, [initialValues])

  const generateReport = async () => {
    console.log('==================================LOLOLO====')
    console.log('IIIININII', initialValues)
    if (initialValues && initialValues?.finance_name) {
      setIsLoading(true)

      console.log('in if ================')
      let fullUrl = `${process.env.REACT_APP_NODE_URL}/${initialValues?.finance_name?.featured_image?.filepath}`
      let json = {
        pdf_url: fullUrl,
        data: updatedFinance,
        images: initialValues.fe_images_data,
        images_2: initialValues.dm_images_data,
        page: initialValues?.finance_name?.images_page_no,
        addon_data: initialValues.case_addons,
      }

      console.log('JSONNNNNN', json)

      try {
        let response = await new BasicProvider('cases/genrate/report').postRequest(json)
        if (response) {
          setPdfURL(response.data.file_url)
          setIsLoading(false)
          console.log('LOLOLO', response.data.file_url)
        }
        console.log('AI response', response)
      } catch (error) {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol md={12}>
            <CommonCaseDetails initialValues={initialValues} />
          </CCol>
        </CRow>

        <CRow className="mt-4">
          <CCol md={12}>
            <CCard>
              <CCardHeader>
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">Report Builder</div>
                  <p className="m-0">
                    {numPages > 0 && (
                      <div className="text-center ">
                        <button
                          className="btn btn-secondary me-2"
                          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                        >
                          Prev
                        </button>
                        <span>
                          {pageNumber} / {numPages}
                        </span>

                        <button
                          className="btn btn-secondary ms-2"
                          onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </p>
                </div>
              </CCardHeader>
              
              {isLoading && isLoading ? (
                <div className=" spinner_outerbox">
                  <div className="text-center">
                    {/* <CSpinner color="secondary" className="spinner" /> */}
                    <CSpinner size="lg" style={{ width: '3rem', height: '3rem' }} />
                  </div>
                </div>
              ) : (
                <CCardBody>
                  <CRow>
                    {pdfURL && (
                      <CCol md={12}>
                        <ShowPdfReview
                          numPages={numPages}
                          pageNumber={pageNumber}
                          setNumPages={setNumPages}
                          url={pdfURL}
                        />
                      </CCol>
                    )}
                  </CRow>
                </CCardBody>
              )}
            </CCard>
          </CCol>
        </CRow>

        {/* 
        <CRow className="my-4">
          <CCol md={9}>
            <CCard>
              <CCardHeader>Final Report</CCardHeader>
              <CCardBody className="view-pdf">
                <Pdf numPages={numPages} pageNumber={pageNumber} setNumPages={setNumPages} />
              </CCardBody>
            </CCard>
            <div className="d-flex justify-content-center align-items-center mt-4 ">
              <button className="btn btn-success text-white me-2 ">
                <CIcon icon={cilPrint} className="me-1" />
                Print Accept
              </button>
              <button className="btn btn-success text-white me-2 ">
                <CIcon icon={cilCloudDownload} /> Download
              </button>
              <button className="btn btn-success text-white me-2 ">
                <CIcon icon={cilPen} /> Edit
              </button>
            </div>
          </CCol>

          <CCol md={3}>
            <CCard className="">
              <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Activity Logs{' '}
                  <Link to={`#`} className="custm_link btn-hover py-1 fs-14">
                    View all
                  </Link>
                </div>
              </CCardHeader>
              <CCardBody>
                <section class="py-3 px-3">
                  {caseUpdateLog.length > 0 ? (
                    <ul class="timeline">
                      {caseUpdateLog.map((item, index) => (
                        <li key={index} class="timeline-item mb-3">
                          <p class="fw-bold mb-0">{item?.message}</p>
                          <p className="mb-0">By {item?.user_id?.name}</p>
                          <small>{convertUtcToDateWithTime(item.created_at)}</small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <h6 class="fw-bold">No Logs Available</h6>
                  )}
                </section>
              </CCardBody>
            </CCard>

            <CCard className="mt-4">
              <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  FE Attachment
                  <Link to={`/case/fe/${id}/all-files`} className="custm_link btn-hover py-1 fs-14">
                    View all
                  </Link>
                </div>
              </CCardHeader>
              <CCardBody>
                <section class="py-3 px-3">
                  {feAttachments.length > 0 ? (
                    <ul class="timeline">
                      {feAttachments.map((attachment, index) => (
                        <li key={index} class="timeline-item mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <p class="fw-bold mb-0">{attachment.name}</p>
                              <p class="text-muted mb-2">
                                {convertUtcToDate(attachment.created_at)}
                              </p>
                            </div>

                            <div className="download-btn edit-btn">
                              <CIcon
                                className="pointer_cursor"
                                icon={cilCloudDownload}
                                onClick={() => handleDownload(`${URL}/${attachment.filepath}`)}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <h6 class="fw-bold">No Files available</h6>
                  )}
                </section>
              </CCardBody>
            </CCard>

            <CCard className="mt-4">
              <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  SDM Attachment
                  <Link
                    to={`/case/sdm/${id}/all-files`}
                    className="custm_link btn-hover py-1 fs-14"
                  >
                    View all
                  </Link>
                </div>
              </CCardHeader>
              <CCardBody>
                <section class="py-3 px-3">
                  {sdmAttachments.length > 0 ? (
                    <ul class="timeline">
                      {sdmAttachments.map((attachment, index) => (
                        <li key={index} class="timeline-item mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <p class="fw-bold mb-0">{attachment.name}</p>
                              <p class="text-muted mb-2">
                                {convertUtcToDate(attachment.created_at)}
                              </p>
                            </div>
                            <div className="download-btn edit-btn">
                              <CIcon
                                className="pointer_cursor"
                                icon={cilCloudDownload}
                                onClick={() => handleDownload(`${URL}/${attachment.filepath}`)}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="list-style-none">
                      <h6>No files available</h6>
                    </div>
                  )}
                </section>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow> */}
      </CContainer>
    </>
  )
}

{
  /* <CCard className="mt-4">
              <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  Activity Logs{' '}
                  <Link to="/case/activity" className="custm_link btn-hover py-1 fs-14">
                    View all
                  </Link>
                </div>
              </CCardHeader>
              <CCardBody>
                <section class="py-3 px-3">
                  <ul class="timeline">
                    <li class="timeline-item mb-3">
                      <h6 class="fw-bold">Coo fill case details</h6>
                      <p class="text-muted mb-2">11 March 2020</p>
                    </li>

                    <li class="timeline-item mb-3">
                      <h6 class="fw-bold">FE fill all his fields</h6>
                      <p class="text-muted mb-2">19 March 2020</p>
                    </li>

                    <li class="timeline-item mb-3">
                      <h6 class="fw-bold">Sended to Draft Manager(DM)</h6>
                      <p class="text-muted mb-2">24 June 2020</p>
                    </li>

                    <li class="timeline-item mb-3">
                      <h6 class="fw-bold">Case completed sent to Bank Manager(RM)</h6>
                      <p class="text-muted mb-2">15 October 2020</p>
                    </li>
                  </ul>
                </section>
              </CCardBody>
            </CCard> */
}
