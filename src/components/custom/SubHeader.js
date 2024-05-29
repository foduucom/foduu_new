import { cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
} from '@coreui/react'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { DeleteModal } from 'src/helpers/deleteModalHelper'

function SubHeader(props) {
  const location = useLocation()

  const {
    searchInput,
    onReset,
    handleFilter,
    moduleName,
    deletionType,
    subHeaderItems,
    setSearchCurrentPage,
    rowPerPage,
    defaultPage,
    isHideAddButton,
    isDirectDelete,
  } = props

  const [activeLink, setActiveLink] = useState('')

  const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState(searchInput || '')
  const selectedRow = useSelector((state) => state.selectedrows)

  const dispatch = useDispatch()
  const toggleCleared = useSelector((state) => state.toggleCleared)
  const navigate = useNavigate()
  //// active current page when page render

  useEffect(() => {
    if (subHeaderItems != null && subHeaderItems.length > 0) {
      dispatch({ type: 'set', selectedrows: [] })
      const currentLink = location.pathname
      const activeItem = props.subHeaderItems.find((item) => item.link === currentLink)
      setActiveLink(activeItem ? activeItem.name : props.subHeaderItems[0].name)
    }
    setSearch(searchInput)
  }, [location])

  const indexofCreate = subHeaderItems?.find((item) => item.link.includes('create'))
  const handleItemClick = (item, index) => {
    navigate(item.link)
  }

  const handleAddNew = () => {
    if (indexofCreate != undefined) {
      navigate(indexofCreate.link)
    }
  }

  return (
    <>
      <div className="subheader-custom py-3 mb-4">
        <CRow xs={{ cols: 1, gutter: 2 }} lg={{ cols: 2, gutter: 3 }} className="px-3 w-100">
          <CCol>
            <div className="create-blog-button d-flex align-items-center">
              {props.subHeaderItems && (
                <div>
                  <CDropdown>
                    <CDropdownToggle
                      id="cdropdown-toggle"
                      className="dropdownmenu subheader_button_leftside"
                    >
                      {activeLink}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {props.subHeaderItems.map((item, index) => (
                        <CDropdownItem
                          key={index}
                          className="dropmenu_item_btn "
                          onClick={() => {
                            handleItemClick(item, index)
                          }}
                        >
                          <CIcon icon={item.icon} className="mx-2" />
                          {item.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>
                  <span className="border-left"></span>
                </div>
              )}

              {Array.isArray(selectedRow) && selectedRow.length > 0 ? (
                <>
                  <span className="selected_row">{selectedRow.length} selected:</span>
                  {/* {console.log('SELECTEDS ROW',selectedRow)} */}

                  <CButton
                    className="delete_btn ml-3"
                    onClick={() => {
                      setVisible(true)
                    }}
                  >
                    Delete Selected
                  </CButton>
                </>
              ) : (
                <>
                  {!isHideAddButton ? (
                    <CButton className="add_new" onClick={handleAddNew}>
                      Add New
                    </CButton>
                  ) : (
                    ''
                  )}
                </>
              )}
            </div>
          </CCol>
          {handleFilter && (
            <CCol className="d-flex justify-content-end flex-column flex-sm-row align-items-center">
              <div className="text-end search_bar position-relative">
                <CIcon icon={cilSearch} className="search_icon" />
                <input
                  className="search_bar_box"
                  placeholder="Search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="mx-2 mt-2 mt-lg-0">
                <CButton
                  className="add_new"
                  onClick={() => {
                    setSearchCurrentPage(search)
                    handleFilter(search)
                  }}
                >
                  Search
                </CButton>
                <CButton
                  className="add_new ms-2"
                  onClick={() => {
                    onReset()
                    setSearch('')
                  }}
                >
                  Reset
                </CButton>
              </div>
            </CCol>
          )}
        </CRow>

        <DeleteModal
          visible={visible}
          setVisible={setVisible}
          userId={selectedRow}
          deletionType={deletionType}
          handleClose={() => setVisible(false)}
          moduleName={moduleName}
          currentPage={defaultPage}
          rowPerPage={rowPerPage}
          isDirectDelete={isDirectDelete}
        />
      </div>
    </>
  )
}
export default SubHeader