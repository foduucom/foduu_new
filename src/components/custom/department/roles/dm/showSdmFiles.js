import React, { useState, useEffect } from 'react'
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'

import {
  cilChevronCircleDownAlt,
  cilChevronCircleUpAlt,
  cilCloudDownload,
  cilPencil,
} from '@coreui/icons'
import CustomTooltip from 'src/components/custom/CustomTooltip'
import moment from 'moment'
import { ShimmerTable, ShimmerTitle } from 'react-shimmer-effects'
import BasicProvider from 'src/constants/BasicProvider'
import { useParams } from 'react-router-dom'

import videoIcon from 'src/assets/images/video-icon.png'
import pdfIcon from 'src/assets/images/pdfIcon.png'
import docIcon from 'src/assets/images/docc.png'
import Video from 'yet-another-react-lightbox/plugins/video'
// import FsLightbox from 'fslightbox-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

const URL = process.env.REACT_APP_NODE_URL

const ShowSdmFiles = () => {
  const query = new URLSearchParams(location.search)
  const [show, setShow] = useState(false)
  const [rowPerPage, setRowPerPage] = useState(null)
  let [defaultPage, setDefaultPage] = useState(currentPage)
  var currentPage = parseInt(query.get('page') || 1)
  var count = query.get('count') || rowPerPage || 20
  const data = useSelector((state) => state.data?.files)
  const [selectedFile, setSelectedFile] = useState(null)
  const [lgihtboxopen, setLightBoxOpen] = React.useState(false)

  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    fetchData()
  }, [])


  const openLightbox = (file) => {
    setSelectedFile(file)
    setLightBoxOpen(true)
  }

  
  const fetchData = async () => {
    try {
      const response = await new BasicProvider(
        `cms/files/by/roles/${process.env.REACT_APP_SDM}?paeg=${1}&count=${10}&id=${id}`,
      ).getRequest()

      dispatch({ type: 'set', data: { files: response.data.data } })
      dispatch({ type: 'set', totalCount: response.data.total })
    } catch (error) {
      console.error('Error' + error)
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
      width: '20%',
    },
    {
      name: 'Name',
      selector: (row) => (
        <div className="pointer_cursor data_Table_title">
          {row.name ? row.name : <ShimmerTitle line={5} />}
        </div>
      ),
      width: '40%',
      // center: true,
    },
    {
      name: 'Size',
      selector: (row) => <div className="data_table_colum">{row.size}</div>,
      width: '20%',
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
        </div>
      ),
      width: '10%',
      ignoreRowClick: true,
      allowoverflow: true,
      button: 'true',
    },
  ]

  return (
    <>
      <CRow className="mt-4">
        <CCol md={12}>
          <CCard className="applicant-details">
            <CCardHeader className="d-flex justify-content-between align-items-center c-card-headerSdm  rounded">
              Files Uploded By SDM
              <div className="action-btn">
                <div className="edit-btn">
                  <CIcon icon={cilPencil} />
                </div>
                {show ? (
                  <CIcon icon={cilChevronCircleUpAlt} size="xl" onClick={() => setShow(!show)} />
                ) : (
                  <CIcon icon={cilChevronCircleDownAlt} size="xl" onClick={() => setShow(!show)} />
                )}
              </div>
            </CCardHeader>
            {show && (
              <DataTable
                data={data}
                columns={columns}
                responsive="true"
                paginationServer
                pagination
                selectableRowsHighlight
                highlightOnHover
              />
            )}
          </CCard>
        </CCol>
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

export default ShowSdmFiles
