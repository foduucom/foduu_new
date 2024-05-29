import { cilPencil, cilSpreadsheet, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CContainer } from '@coreui/react'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import SubHeader from 'src/components/custom/SubHeader'
import { RowsPerPage } from 'src/constants/variables'

import HelperFunction from '../../../helpers/HelperFunctions'
import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
import { DeleteModal, handleConfirmDelete } from 'src/helpers/deleteModalHelper'
import BasicProvider from 'src/constants/BasicProvider'


var subHeaderItems = [
  {
    name: 'All Vendors',
    link: '/vendor',
    icon: cilSpreadsheet,
  },
  {
    name: 'Create Vendor',
    link: '/vendor/create',
    icon: cilPencil,
  },
  {
    name: 'Trash Vendor',
    link: '/vendor/trash',
    icon: cilTrash,
  },
]


export default function Blogs() {
  const navigate = useNavigate()
  const [rowPerPage, setRowPerPage] = useState(null)
  const location = useLocation()

  const [userId, setuserId] = useState([])

  const [visible, setVisible] = useState(false)
  const [searchcurrentPage, setSearchCurrentPage] = useState(null)
  const query = new URLSearchParams(location.search)
  var count = query.get('count') || rowPerPage
  var currentPage = parseInt(query.get('page') || 1)
  var search = query.get('search') || ''
  let [defaultPage, setDefaultPage] = useState(currentPage)
  const dispatch = useDispatch()
  const data = useSelector((state) => state.data?.vendors)
  const toggleCleared = useSelector((state) => state.toggleCleared)
  const totalCount = useSelector((state) => state.totalCount)

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
          `vendors/search?${HelperFunction.convertToQueryString(queryData)}`,
        ).getRequest()
        console.log(response)
      } else {
        response = await new BasicProvider(
          `vendors?page=${currentPage}&count=${count}`,
        ).getRequest()
        console.log(response)
      }
      dispatch({ type: 'set', data: { vendors: response.data.data } })
      dispatch({ type: 'set', totalCount: response.data.total })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const fetchSelectedRows = async () => {
      const savedSelectedRows = await handleSelectedRowChange('vendors')
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

  // const columns = [
  //   {
  //     name: 'Title',
  //     selector: (row) => (
  //       <div
  //         className="pointer_cursor data_Table_title"
  //         onClick={() => navigate(`/cms/blog/${row._id}/edit`)}
  //       >
  //         {row.name}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: 'Slug',
  //     selector: (row) => <div className="data_table_colum">{row.slug}</div>,
  //   },
  //   {
  //     name: 'Status',
  //     selector: (row) => (
  //       <div
  //         className="status-value"
  //         style={{ backgroundColor: row && row.status === 'published' ? '#3bb77e   ' : '#ffb822' }}
  //       >
  //         {row.status}
  //       </div>
  //     ),
  //   },
  //   {
  //     name: 'Created',
  //     selector: (row) => <div className="data_table_colum">{moment(row.created_at).fromNow()}</div>,
  //   },
  //   {
  //     name: 'Actions',
  //     cell: (row) => (
  //       <div className="action-btn">
  //         <div className="edit-btn">
  //           <CIcon
  //             className="pointer_cursor"
  //             icon={cilPencil}
  //             onClick={() => navigate(`/cms/blog/${row._id}/edit`)}
  //           />
  //         </div>

  //         <div className="delet-btn">
  //           <CIcon
  //             className="pointer_cursor"
  //             icon={cilTrash}
  //             onClick={() => {
  //               setVisible(true)
  //               setuserId([row._id])
  //             }}
  //           />
  //         </div>
  //       </div>
  //     ),
  //     ignoreRowClick: true,
  //     allowoverflow: true,
  //     button: 'true',
  //   },
  // ]

  const columns = [
    {
      name: 'Name',
      selector: (row) => (
        <div
          className="pointer_cursor data_Table_title"
          onClick={() => navigate(`/cms/vendor/${row._id}/edit`)}
        >
          {row.name}
        </div>
      ),
    },
    {
      name: 'Email',
      selector: (row) => <div className="data_table_colum">{row.email}</div>,
    },
    {
      name: 'Mobile',
      selector: (row) => <div className="data_table_colum">{row.mobile}</div>,
    },
    {
      name: 'Created',
      selector: (row) => <div className="data_table_colum">{moment(row.created_at).fromNow()}</div>,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-btn">
          <div className="edit-btn">
            <CIcon
              className="pointer_cursor"
              icon={cilPencil}
              onClick={() => navigate(`/cms/vendor/${row._id}/edit`)}
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
        moduleName="vendors"
        deletionType="trash"
      />

      <CContainer fluid >
        {rowPerPage && (
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
                setSelectedRowForModule('vendors', value)
              }}
              onSelectedRowsChange={(state) => handleRowChange(state)}
              clearSelectedRows={toggleCleared}
            />
          </div>
        )}
        <DeleteModal
          visible={visible}
          userId={userId}
          moduleName="vendors"
          currentPage={currentPage}
          rowPerPage={rowPerPage}
          setVisible={setVisible}
          deletionType="trash"
          handleClose={() => setVisible(false)}
        />
      </CContainer>
    </>
  )
}





































// import { cilPencil, cilSpreadsheet, cilTrash } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import { CContainer } from '@coreui/react'
// import moment from 'moment'
// import { useCallback, useEffect, useState } from 'react'
// import DataTable from 'react-data-table-component'
// import { useDispatch, useSelector } from 'react-redux'
// import { useLocation, useNavigate } from 'react-router-dom'
// import SubHeader from 'src/components/custom/SubHeader'
// import { RowsPerPage } from 'src/constants/variables'

// import HelperFunction from '../../../helpers/HelperFunctions'
// import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
// import { DeleteModal, handleConfirmDelete } from 'src/helpers/deleteModalHelper'
// import BasicProvider from 'src/constants/BasicProvider'

// var subHeaderItems = [
//   {
//     name: 'All Vendors',
//     link: '/vendor',
//     icon: cilSpreadsheet,
//   },
//   {
//     name: 'Create Vendor',
//     link: '/vendor/create',
//     icon: cilPencil,
//   },
//   {
//     name: 'Trash Vendor',
//     link: '/vendor/trash',
//     icon: cilTrash,
//   },
// ]
// export default function Pages() {
//   const navigate = useNavigate()
//   const [rowPerPage, setRowPerPage] = useState(null)
//   const location = useLocation()

//   const [userId, setuserId] = useState([])

//   const [selectedRow, setSelectedRow] = useState(null)
//   const [visible, setVisible] = useState(false)
//   const [searchcurrentPage, setSearchCurrentPage] = useState(null)
//   const query = new URLSearchParams(location.search)
//   var count = query.get('count') || rowPerPage
//   var currentPage = parseInt(query.get('page') || 1)
//   var search = query.get('search') || ''
//   let [defaultPage, setDefaultPage] = useState(currentPage)
//   const dispatch = useDispatch()
//   const data = useSelector((state) => state.data?.pages)
//   const selectableRows = useSelector((state) => state.selectedrows)
//   const toggleCleared = useSelector((state) => state.toggleCleared)
//   const totalCount = useSelector((state) => state.totalCount)
//   const selectedPage = selectableRows

//   const updatePageQueryParam = (paramName, page) => {
//     const searchParams = new URLSearchParams(location.search)
//     searchParams.set(paramName, page)
//     navigate({ search: searchParams.toString() })
//   }

//   useEffect(() => {
//     if (rowPerPage) {
//       fetchData()
//     }
//   }, [currentPage, rowPerPage, searchcurrentPage, search])

//   const fetchData = async () => {
//     try {
//       // setDefaultPage(currentPage)
//       let performSearch = false
//       var queryData = {}
//       for (const [key, value] of query.entries()) {
//         if (key !== 'page' && key !== 'count') {
//           queryData[key] = value
//           if (value !== '' && value !== null) {
//             performSearch = true
//           }
//         }
//       }

      
//       var response
//       if (performSearch) {
//         queryData['page'] = currentPage
//         queryData['count'] = count
//         response = await new BasicProvider(
//           `vendors/search?${HelperFunction.convertToQueryString(queryData)}`,
//         ).getRequest()
//       } else {
//         response = await new BasicProvider(`vendors?page=${currentPage}&count=${count}`).getRequest()
//       }
//       dispatch({ type: 'set', data: { pages: response.data.data } });
//       dispatch({ type: 'set', totalCount: response.data.total })
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   useEffect(() => {
//     const fetchSelectedRows = async () => {
//       const savedSelectedRows = await handleSelectedRowChange('vendor')
//       if (savedSelectedRows && !count) {
//         setRowPerPage(savedSelectedRows)
//       } else {
//         setRowPerPage(count)
//       }
//     }
//     fetchSelectedRows()
//   }, [count])

//   const handleRowChange = useCallback((state) => {
//     dispatch({ type: 'set', selectedrows: state.selectedRows })
//   }, [])

//   const handleFilter = async (search) => {
//     try {
//       const searchParams = new URLSearchParams(location.search)
//       if (search) searchParams.set('search', search)
//       navigate({ search: searchParams.toString() })

//     } catch (error) {
//       console.error('Error fetching data:', error)
//     }
//   }

//   const handleFilterReset = async () => {
//     setSearchCurrentPage(1)
//     currentPage = 1
//     setDefaultPage(1)
//     navigate({ search: '' })
//   }


//   const columns = [
//     {
//       name: 'Name',
//       selector: (row) => (
//         <div
//           className="pointer_cursor data_Table_title"
//           onClick={() => navigate(`/cms/vendor/${row._id}/edit`)}
//         >
//           {row.name}
//         </div>
//       ),
//     },
//     {
//       name: 'Email',
//       selector: (row) => <div className="data_table_colum">{row.email}</div>,
//     },
//     {
//       name: 'Mobile',
//       selector: (row) => <div className="data_table_colum">{row.mobile}</div>,
//     },
//     {
//       name: 'Created',
//       selector: (row) => <div className="data_table_colum">{moment(row.created_at).fromNow()}</div>,
//     },
//     {
//       name: 'Actions',
//       cell: (row) => (
//         <div className="action-btn">
//           <div className="edit-btn">
//             <CIcon
//               className="pointer_cursor"
//               icon={cilPencil}
//               onClick={() => navigate(`/cms/vendor/${row._id}/edit`)}
//             />
//           </div>

//           <div className="delet-btn">
//             <CIcon
//               className="pointer_cursor"
//               icon={cilTrash}
//               onClick={() => {
//                 setSelectedRow(row)
//                 setVisible(true)
//                 setuserId(row)
//               }}
//             />
//           </div>
//         </div>
//       ),
//       ignoreRowClick: true,
//       allowoverflow: true,
//       button: 'true',
//     },
//   ]


//   return (
//     <>
//       <div>
//         <SubHeader
//           handleFilter={async (search) => {
//             handleFilter(search)
//           }}
//           setSearchCurrentPage={setSearchCurrentPage}
//           onReset={() => {
//             handleFilterReset()
//           }}
//           searchInput={search}
//           rowPerPage={rowPerPage}
//           selectedRow={selectedPage}
//           subHeaderItems={subHeaderItems}
//           moduleName="All Vendors"
//           deletionType="trash"
//         />
//       </div>
//       <CContainer fluid >
//         {rowPerPage && (
//           <div className="datatable">
//             <DataTable
//               responsive="true"
//               columns={columns}
//               data={data}
//               paginationServer
//               paginationTotalRows={totalCount}
//               paginationDefaultPage={defaultPage}
//               onChangePage={(page) => {
//                 currentPage = page
//                 setDefaultPage(parseInt(page))
//                 updatePageQueryParam('page', currentPage)
//               }}
//               pagination
//               selectableRows
//               selectableRowsHighlight
//               highlightOnHover
//               paginationRowsPerPageOptions={RowsPerPage}
//               paginationPerPage={rowPerPage}
//               onChangeRowsPerPage={(value) => {
//                 count = value
//                 setRowPerPage(value)
//                 updatePageQueryParam('count', value)
//                 setSelectedRowForModule('vendor', value)
//               }}
//               onSelectedRowsChange={(state) => handleRowChange(state)}
//               clearSelectedRows={toggleCleared}
//             />
//           </div>
//         )}
//         <DeleteModal
//           visible={visible}
//           selectedRow={selectedRow}
//           handleConfirmDelete={async () => {
//             const success = await handleConfirmDelete('vendors', 'trash', [userId])
//             dispatch({ type: 'set', toggleCleared: !toggleCleared })
//             dispatch({ type: 'set', selectedrows: [] })

//             if (success) {
//               setVisible(false)
//               const response = await HelperFunction.getData(`vendors`, currentPage, rowPerPage)
//               dispatch({ type: 'set', data: { pages: response.data.data } });
//               dispatch({ type: 'set', totalCount: response.data.total })
//             }
//           }}
//           handleClose={() => setVisible(false)}
//         />
//       </CContainer>
//     </>
//   )
// }


































