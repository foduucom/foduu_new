import { CButton, CModal, CModalBody, CModalFooter } from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import BasicProvider from 'src/constants/BasicProvider'

const { default: HelperFunction } = require('./HelperFunctions')

export const handleConfirmDelete = async (moduleName, deletionType, selectedRow, setVisible) => {
  try {
    const selectedRowIds = selectedRow.map((row) => row._id)

    if (deletionType === 'trash') {
      await HelperFunction.trashData(moduleName.toLowerCase(), selectedRowIds)
    } else {
      await HelperFunction.deleteData(moduleName.toLowerCase(), selectedRowIds)
    }
    return true
  } catch (error) {
    console.error(error)
  }
}


export const DeleteModal = ({
  moduleName,
  visible,
  setVisible,
  currentPage,
  rowPerPage,
  handleClose,
  userId,
  deletionType,
  isDirectDelete,
  isFileWithPatams,
  isCaseDelete,
  selectedCaseId
}) => {
  const dispatch = useDispatch()
  if (moduleName) {
    var parts = moduleName.split('/')
    var module = parts.pop()
  }
  const capitalizeFirstLetter = (word) => {
    return word?.charAt(0).toUpperCase() + word?.slice(1)
  }
  
  const handleDelete = async () => {
    if (deletionType == 'trash') {
      const success = await HelperFunction.trashData(moduleName, userId)
      dispatch({ type: 'set', toggleCleared: false })
      dispatch({ type: 'set', selectedrows: [] })
      setVisible(false)
      

      if (success) {
        const response = await HelperFunction.getData(moduleName, currentPage, rowPerPage)
        console.log('Response =>', response)
        // console.log("module", module);
        dispatch({ type: 'set', data: { [`${module}`]: response.data.data } })
        dispatch({ type: 'set', totalCount: response.data.total })
      }
    } else {
      const success = await HelperFunction.deleteData(moduleName, userId)
      dispatch({ type: 'set', toggleCleared: false })
      dispatch({ type: 'set', selectedrows: [] })
      setVisible(false)

      if (success && !isDirectDelete) {
        const response = await HelperFunction.getData(
          `${moduleName}/trash/all`,
          currentPage,
          rowPerPage,
        )
        dispatch({
          type: 'set',
          data: { [`trash${capitalizeFirstLetter(module)}`]: response.data.data },
        })
        dispatch({ type: 'set', totalCount: response.data.total })
      }else  if(success && isDirectDelete && moduleName=='ecommerce/products/gallery'){
        const response = await HelperFunction.getData(
          `ecommerce/products/gallery`,
          currentPage,
          rowPerPage,
        )
        dispatch({ type: 'set', data: {productsGallery: response.data.data } })
        dispatch({ type: 'set', totalCount: response.data.total })
      }else  if(success && isDirectDelete && isFileWithPatams && isCaseDelete ){
      const response = await new BasicProvider(
        `${moduleName}?paeg=${currentPage}&count=${rowPerPage}&id=${selectedCaseId}`,
      ).getRequest()
       
        dispatch({ type: 'set', data: { [`${module}`]: response.data.data } })
        dispatch({ type: 'set', totalCount: response.data.total })
      }else {
        const response = await HelperFunction.getData(moduleName, currentPage, rowPerPage)
        dispatch({ type: 'set', data: { [`${module}`]: response.data.data } })
        dispatch({ type: 'set', totalCount: response.data.total })
      }
    }
  }


  return (
    <CModal alignment="center" visible={visible} onClose={handleClose} className="delete_item_box">
      <CModalBody className="text-center mt-4">
        <div className="logo_x m-auto mb-3">x</div>
        <span>
          Are you sure you want to delete the {capitalizeFirstLetter(module?.slice(0, -1))} ?
        </span>
      </CModalBody>
      <CModalFooter className="model_footer justify-content-center mb-3 pt-0">
        <CButton className="delete_btn model_btn" color="danger" onClick={handleDelete}>
          Yes
        </CButton>
        <CButton className="close_btn model_btn" color="secondary" onClick={handleClose}>
          No, cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

DeleteModal.propTypes = {
  visible: PropTypes.bool,
  module: PropTypes.any,
  module: PropTypes.string,
  handleConfirmDelete: PropTypes.func,
  handleClose: PropTypes.func,
}
