import React, { useEffect, useState } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CFormLabel,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsF,
} from '@coreui/react'
import { CChart, CChartDoughnut, CChartLine, CChartPie } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilSettings,
  cilMoon,
  cilBell,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
import DataTable from 'react-data-table-component'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import BasicProvider from 'src/constants/BasicProvider'
import WidgetSideBox from '../widgets/WidgetSidebox'
import PieChart from '../charts/PieChart'
import DonutChart from '../charts/DonutChart'
const data = [
  {
    id: 9,
    title: 'ProductE',
    category: 'Toys',
    totalSell: 85000,
  },
  {
    id: 10,
    title: 'Inception',
    year: '2010',
    category: 'Sci-Fi',
    totalSell: 100000,
  },
  // Add more products as needed
  // ...
]

const data2 = [
  {
    id: 1,
    title: 'Beetlejuice',
    year: '1988',
    category: 'Comedy',
    featured_image: 'https://variety.com/wp-content/uploads/2016/09/beetlejuice_new.jpg',
    totalSell: 50000,
  },
  {
    id: 2,
    title: 'Ghostbusters',
    year: '1984',
    category: 'Sci-Fi',
    featured_image:
      'https://imageio.forbes.com/specials-images/imageserve/5d2f37934c687b0008a58090/Ghostbusters--Halloween-Horror-Nights--Hollywood--Orlando--HHN--tickets--sequel--SDCC/960x0.jpg?format=jpg&width=960',
    totalSell: 75000,
  },
]
const Dashboard = () => {
  const [startDateTime, setstartDateTime] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  )
  const [dashboardCounts, setDashboardCounts] = useState({})

  const [endDate, setEndDate] = useState(new Date())
  const currentDate = new Date()
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const columns = [
    {
      name: 'Product Name',
      selector: (row) => (
        <div className="pointer_cursor data_Table_title d-flex py-1">
          {row.featured_image ? ( // Check if featured_image is available
            <img
              src={row.featured_image}
              alt="Featured_image"
              className="product_img me-2"
              width={35}
              height={35}
            />
          ) : (
            // Display dummy image if featured_image is not available
            <img
              src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
              alt="Dummy_image"
              className="product_img me-2"
              width={35}
              height={35}
            />
          )}

          <div className="product_name">{row.title}</div>
        </div>
      ),
      width: '40%',
    },
    ,
    {
      name: 'Category',
      selector: (row) => row.category,
    },
    {
      name: 'Total Sell',
      selector: (row) => row.totalSell,
    },
  ]

  const colums2 = [
    {
      name: 'Product Name',
      selector: (row) => (
        <div className="pointer_cursor data_Table_title d-flex py-1">
          {row.featured_image ? ( // Check if featured_image is available
            <img
              src={row.featured_image}
              alt="Featured_image"
              className="product_img me-2"
              width={35}
              height={35}
            />
          ) : (
            // Display dummy image if featured_image is not available
            <img
              src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
              alt="Dummy_image"
              className="product_img me-2"
              width={35}
              height={35}
            />
          )}

          <div className="product_name">{row.title}</div>
        </div>
      ),
      width: '40%',
    },
    {
      name: 'Category',
      selector: (row) => row.category,
    },
    {
      name: 'Total Sell',
      selector: (row) => row.totalSell,
    },
  ]
  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  const handleSearch = () => {
    const start = startDateTime
    const end = endDate
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await new BasicProvider(`cms/dashboard/counts`).getRequest()
      // console.log("responce", response);
      setDashboardCounts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const [categoryReport, setCategoryReport] = useState([])

  const employees = [
    { name: 'Bob', department: 'Sales', yearsOfExperience: 2 },
    { name: 'Alice', department: 'Marketing', yearsOfExperience: 5 },
    { name: 'Charlie', department: 'Engineering', yearsOfExperience: 11 },
    { name: 'David', department: 'HR', yearsOfExperience: 1 },
    { name: 'Eve', department: 'Sales', yearsOfExperience: 4 },
    { name: 'Frank', department: 'Marketing', yearsOfExperience: 3 },
    { name: 'Grace', department: 'Engineering', yearsOfExperience: 7 },
    { name: 'Miller', department: 'Designer', yearsOfExperience: 8 },
  ]

  const pieData = {
    labels: [],
    datasets: [
      {
        data: [120, 50, 100, 40, 60],
        backgroundColor: ['#f7365c', '#3399FF', '#F9B115', '#92C7CF', '#CCD3CA'],
        hoverOffset: 4,
      },
    ],
  }

  
  return (
    <>
      <CContainer fluid>
        {/* <WidgetsDropdown  /> */}
        {/* <WidgetsDropdown counts={dashboardCounts} /> */}

        {/* <CRow>
          <CCol md={6}>
            <CCard>
              <CCardHeader>Top Selling Products</CCardHeader>
              <CCardBody>
                <DataTable columns={columns} data={data} />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard>
              <CCardHeader>Top Review Products</CCardHeader>
              <CCardBody>
                <DataTable columns={colums2} data={data2} />
              </CCardBody>``
            </CCard>
          </CCol>
        </CRow> */}
        <CRow className="my-3  ">
          <CCol sm={6} md={4}>
            <CCard>
              <CCardHeader>Graphical Representation</CCardHeader>
              <CCardBody className="d-flex justify-content-center align-items-center">
                <PieChart data={pieData} />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={6} md={4}>
            <CCard className="mt-4 mt-sm-0 mt-md-0">
              <CCardHeader>Graphical Representation</CCardHeader>
              <CCardBody className="d-flex justify-content-center align-items-center">
                <PieChart data={pieData} />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={6} md={4}>
            <CCard className="mt-4 mt-md-0">
              <CCardHeader>Graphical Representation</CCardHeader>
              <CCardBody className="d-flex justify-content-center align-items-center">
                <DonutChart data={pieData} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow className="my-4">
          <CCol md={8} lg={9}>
            <CCard>
              <CCardHeader>Filter Files by Dates</CCardHeader>
              <CCardBody>
                <CRow className="align-items-center mb-4">
                  <CCol xs={6} sm={5} md={4} lg={5} className="pe-md-0">
                    <CFormLabel htmlFor="publishDate">
                      Start Date<span className="text-danger"></span>
                    </CFormLabel>
                    <DatePicker
                      selected={startDateTime}
                      onChange={(date) => {
                        const formattedDate = `${date.getFullYear()}-${String(
                          date.getMonth() + 1,
                        ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                        // //console.log(formattedDate)
                        setstartDateTime(date)
                        setFormatted_Start_Date(formattedDate)
                      }}
                      dateFormat="yyyy-MM-dd"
                      className="form-control full py-2"
                      size="sm"
                      aria-label="Small select example"
                      maxDate={currentDate}
                      placeholderText="Select end date"
                    />
                  </CCol>
                  <CCol xs={6} sm={5} md={4} lg={5} className="pe-md-0">
                    <CFormLabel htmlFor="publishDate">
                      End Date<span className="text-danger"></span>
                    </CFormLabel>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        const formattedDate = `${date.getFullYear()}-${String(
                          date.getMonth() + 1,
                        ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                        // //console.log(formattedDate)
                        setFormatted_End_Date(formattedDate)
                        setEndDate(date)
                      }}
                      dateFormat="yyyy-MM-dd"
                      className="form-control full py-2"
                      size="sm"
                      aria-label="Small select example"
                      placeholderText="Select start date"
                      maxDate={currentDate}
                    />
                    {/* {valid && <div className="text-danger mt-1">{valid}</div>} */}
                  </CCol>
                  <CCol xs={12} sm={2} md={4} lg={2} className="">
                    <CFormLabel></CFormLabel>
                    <div className="text-center text-md-end">
                      <CButton className="submit_btn" onClick={handleSearch}>
                        Search
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CChart
                      type="bar"
                      data={{
                        labels: ['Indore', 'Bhopal', 'Mumbai', 'Jaipur', 'delhi', 'Pune', 'Noida'],
                        datasets: [
                          {
                            label: 'GitHub Commits',

                            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                            backgroundColor: [
                              '#f7365c',
                              '#ffbb77',
                              '#ffdb84',
                              '#83ffff',
                              '#80caff',
                              '#ad80ff',
                              '#e46651',
                            ],
                            borderColor: [
                              '#000',
                              'rgb(255, 159, 64)',
                              'rgb(255, 205, 86)',
                              'rgb(75, 192, 192)',
                              'rgb(54, 162, 235)',
                              'rgb(153, 102, 255)',
                              'rgb(201, 203, 207)',
                            ],
                          },
                        ],
                      }}
                      labels="months"
                      options={{
                        plugins: {
                          legend: {
                            labels: {
                              color: getStyle('--cui-body-color'),
                            },
                          },
                        },
                        scales: {
                          x: {
                            grid: {
                              color: getStyle('--cui-border-color-translucent'),
                            },
                            ticks: {
                              color: getStyle('--cui-body-color'),
                            },
                          },
                          y: {
                            grid: {
                              color: getStyle('--cui-border-color-translucent'),
                            },
                            ticks: {
                              color: getStyle('--cui-body-color'),
                            },
                          },
                        },
                      }}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4} lg={3}>
            <WidgetSideBox />
          </CCol>
          {/* <CCol md={6}>
            <CCard>
              <CCardHeader>Best Orders Values</CCardHeader>
              <CCardBody>
                <DataTable columns={colums2} data={data2} />
              </CCardBody>
            </CCard>
          </CCol> */}
        </CRow>

        {/* <CRow className="my-4">
          <CCol md={6}>
            <CCard>
              <CCardHeader>Group Wise Files</CCardHeader>
              <CCardBody>
                <CChartPie
                  style={{ width: '75%', height: '48vh', margin: 'auto' }}
                  data={{
                    labels: ['Red', 'Green', 'Yellow'],
                    datasets: [
                      {
                        data: [300, 50, 100],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                      },
                    ],
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard>
              <CCardHeader>Top City Wise Files</CCardHeader>
              <CCardBody>
                <CChart
                  style={{ width: '100%', height: '48vh' }}
                  type="bar"
                  data={{
                    labels: ['Indore', 'Bhopal', 'Mumbai', 'Jaipur', 'delhi', 'Pune', 'Noida'],
                    datasets: [
                      {
                        label: 'GitHub Commits',

                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                        backgroundColor: [
                          '#f7365c',
                          '#ffbb77',
                          '#ffdb84',
                          '#83ffff',
                          '#80caff',
                          '#ad80ff',
                          '#e46651',
                        ],
                        borderColor: [
                          '#000',
                          'rgb(255, 159, 64)',
                          'rgb(255, 205, 86)',
                          'rgb(75, 192, 192)',
                          'rgb(54, 162, 235)',
                          'rgb(153, 102, 255)',
                          'rgb(201, 203, 207)',
                        ],
                      },
                    ],
                  }}
                  labels="months"
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: getStyle('--cui-body-color'),
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: getStyle('--cui-border-color-translucent'),
                        },
                        ticks: {
                          color: getStyle('--cui-body-color'),
                        },
                      },
                      y: {
                        grid: {
                          color: getStyle('--cui-border-color-translucent'),
                        },
                        ticks: {
                          color: getStyle('--cui-body-color'),
                        },
                      },
                    },
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow> */}

        {/* <CRow className="my-4">
          <CCol md={6}>
            <CCard>
              <CCardHeader>Recent Customers</CCardHeader>
              <CCardBody>
                <DataTable columns={columns} data={data} />
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard>
              <CCardHeader>Recent Orders</CCardHeader>
              <CCardBody>
                <DataTable columns={colums2} data={data2} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow> */}
      </CContainer>
    </>
  )
}

export default Dashboard
