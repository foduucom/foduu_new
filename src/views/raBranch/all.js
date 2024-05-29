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
import HelperFunction from '../../helpers/HelperFunctions'
import { handleSelectedRowChange, setSelectedRowForModule } from 'src/helpers/paginationCookie'
import { DeleteModal } from 'src/helpers/deleteModalHelper'
import BasicProvider from 'src/constants/BasicProvider'
import CustomTooltip from 'src/components/custom/CustomTooltip'

var subHeaderItems = [
    {
        name: 'All RA Branch',
        link: '/rabranch/all',
        icon: cilSpreadsheet,
    },
    {
        name: 'Create RA Branch',
        link: '/rabranch/create',
        icon: cilPencil,
    },
    {
        name: 'Trash RA Branch',
        link: '/rabranch/trash',
        icon: cilTrash,
    },
]
const all = () => {
    const navigate = useNavigate()
    const [rowPerPage, setRowPerPage] = useState(20)
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
    const data = useSelector((state) => state.data?.ra_branch)
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
            if (performSearch) {
                queryData['page'] = currentPage
                queryData['count'] = count
                response = await new BasicProvider(
                    `ra_branch/search?${HelperFunction.convertToQueryString(queryData)}`,
                ).getRequest()
            } else {
                response = await new BasicProvider(`ra_branch?page=${currentPage}&count=${count}`).getRequest()
            }

            dispatch({ type: 'set', data: { ra_branch: response.data.data } })
            dispatch({ type: 'set', totalCount: response.data.total })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const fetchSelectedRows = async () => {
            const savedSelectedRows = await handleSelectedRowChange('ra_branch')
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
        setSearchCurrentPage(1)
        currentPage = 1
        setDefaultPage(1)
        navigate({ search: '' })
    }

    const columns = [
        {
            name: 'Name',
            selector: (row) => (
                <div className="data_table_colum">
                    {row && row.name ? row.name : '-'}
                </div>
            ),
        },
        {
            name: 'Email',
            selector: (row) => (
                <div className="data_table_colum">
                    {row && row.email ? row.email : '-'}
                </div>
            ),
        },
        {
            name: 'Mobile',
            selector: (row) => (
                <div className="data_table_colum">
                    {row && row.mobile ? row.mobile : '-'}
                </div>
            ),
        },
        {
            name: 'Landline',
            selector: (row) => (
                <div className="data_table_colum">
                    {row && row?.landline ? row.landline : '-'}
                </div>
            ),
        },
        {
            name: 'Adress ',
            selector: (row) => (
                <div className="data_table_colum">
                    {row && row?.address ? row?.address : '-'}
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
                <div className="action-btn">
                    <div className="edit-btn">
                        <CIcon
                            className="pointer_cursor"
                            icon={cilPencil}
                            onClick={() => navigate(`/rabranch/${row._id}/edit`, { state: { id: row._id } })}
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
                moduleName="ra_branch"
                deletionType="trash"
            />

            <CContainer fluid>
                <>
                    {true && (
                        <div className="datatable mb-4">
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
                                    setSelectedRowForModule('ra_branch', value)
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
                    moduleName="ra_branch"
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

export default all
