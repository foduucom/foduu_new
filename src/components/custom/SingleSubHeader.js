import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CButton, CCol, CContainer, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { cilSearch, cilSpreadsheet, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { DeleteModal, handleConfirmDelete } from 'src/helpers/deleteModalHelper'
import HelperFunction from 'src/helpers/HelperFunctions'
import { useDispatch, useSelector } from 'react-redux'

function SingleSubHeader(props) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const toggleCleared = useSelector((state) => state.toggleCleared)
  const { handleFilter, selectedRow, moduleName, deletionType,subHeaderItems } = props
  const handleAddNew = () => {
    const indexofCreate = subHeaderItems?.find((item) => item.name.includes('Create'))
    if (indexofCreate != undefined) {
      navigate(indexofCreate.link)
    }
  }
  return (
    <div>
      <CContainer fluid className="subheader-custom py-3 mb-4">
        <CRow xs={{ cols: 1, gutter: 2 }} lg={{ cols: 2, gutter: 3 }} className="px-4">
        <CCol>
            <div className="create-blog-button d-flex align-items-center">
              {moduleName}
              <span className="ms-2 border-left"></span>
              {/* <CButton className="add_new" onClick={handleAddNew}>
                    Add New
                  </CButton> */}
              {Array.isArray(props.selectedRow) && props.selectedRow.length > 0 ? (
                <>
                  <span className="selected_row">{props.selectedRow.length} selected:</span>
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
                ''
              )}
            </div>
          </CCol>
          <CCol className="text-end">
         
          {props.handleFilter && (
              <div className="text-end search_bar position-relative">
                <CIcon icon={cilSearch} className="search_icon" />
                <input
                  className="search_bar_box"
                  placeholder="Search"
                  type="text"
                  onChange={handleFilter}
                />
              </div>
          )}
          </CCol>
          
        </CRow>
        <DeleteModal
          visible={visible}
          selectedRow={selectedRow}
          handleConfirmDelete={async () => {
            dispatch({ type: 'set', selectedrows: [] })
            const success = await handleConfirmDelete(moduleName, deletionType, selectedRow)
            dispatch({ type: 'set', toggleCleared: !toggleCleared })

            if (success && deletionType === 'delete') {
              var response = await HelperFunction.getData(
                `${
                  moduleName.toLowerCase().endsWith('s') ? moduleName.slice(0, -1) : moduleName
                }s/trash`,
                1,
                10,
              )
            } else {
              var response = await HelperFunction.getData(
                `${moduleName.toLowerCase().endsWith('s') ? moduleName.slice(0, -1) : moduleName}s`,
                1,
                10,
              )
            }
            dispatch({ type: 'set', data: response.data.data })

            setVisible(false) // Update the visibility state here
          }}
          handleClose={() => setVisible(false)}
        />
      </CContainer>
    </div>
  )
}
SingleSubHeader.propTypes = {
  handleFilter: PropTypes.any,
  selectedRow: PropTypes.any,
  moduleName: PropTypes.any.isRequired,
  deletionType: PropTypes.any,
}

export default SingleSubHeader
