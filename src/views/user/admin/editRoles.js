import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import SingleSubHeader from 'src/components/custom/SingleSubHeader'
import BasicProvider from 'src/constants/BasicProvider'
import { setAlertTimeout } from 'src/helpers/alertHelper'
import handleSubmitHelper from 'src/helpers/submitHelper'
import { useEffectFormData } from 'src/helpers/formHelpers'

const validationRules = {
  display_name: {
    required: true,
    minLength: 2,
  },
}

export default function CreateUnit() {
  const dispatch = useDispatch()
  var params = useParams()

  const navigate = useNavigate()
  const id = params.id
  const isEditMode = !!id

  const [initialValues, setInitialValues] = useState({
    display_name: '',
    description: '',
    permission: [],
  })

  const [permissions, setPermissions] = useState([])
  const [types, setTypes] = useState([])

  const [selectedPermissions, setSelectedPermissions] = useState([])

  useEffect(() => {
    setInitialValues({
      display_name: '',
      type: '',
      description: '',
    })
    // dispatch({ type: 'set', validations: [] })
    if (isEditMode) fetchSingleData()
  }, [navigate])

  const fetchSingleData = async () => {
    try {
      let response = await new BasicProvider(`roles/show/${id}`, dispatch).getRequest()
      const permissionIds = response.data.permission.map((permission) => permission._id)
      setSelectedPermissions(permissionIds)
      setInitialValues({
        display_name: response.data.display_name,
        description: response.data.description,
        name: response.data.name,
        permission: permissionIds,
      })
    } catch (error) {
      dispatch({ type: 'set', catcherror: error.data })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      let response1 = await new BasicProvider(`permissions/roles`, dispatch).getRequest()
      let response2 = await new BasicProvider(`permissions/types`, dispatch).getRequest()

      if (response1) setPermissions(response1.data)
      if (response2) setTypes(response2.data)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // setInitialValues((prev) => ({ ...prev, permission_ids: selectedPermissions }))
    initialValues.permission = selectedPermissions

    try {
      const data = await handleSubmitHelper(initialValues, validationRules, dispatch)
      if (data === false) {
        return
      }

      var response
      if (isEditMode) {
        response = await new BasicProvider(`roles/update/${id}`, dispatch).patchRequest(
          initialValues,
        )
      } else {
        response = await new BasicProvider(`roles/create`, dispatch).postRequest(initialValues)
        setInitialValues({
          display_name: '',
          type: '',
          description: '',
        })
        // navigate(`/ecommerce/units/${response.data._id}/edit`)
      }
      setAlertTimeout(dispatch)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setInitialValues({ ...initialValues, [name]: value })
  }

  const handlePermissionChange = (permissionId) => {
    // Toggle selection
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permissionId)
        ? prevSelected.filter((id) => id !== permissionId)
        : [...prevSelected, permissionId],
    )
  }

  const renderPermissionsByType = (type) => {
    const permissionsOfType = permissions.filter((permission) => permission.type === type)
    return permissionsOfType.map((permission) => (
      <div key={permission._id}>
        <CFormCheck
          id={`permission_${permission._id}`}
          checked={selectedPermissions.some(
            (selectedPermission) => selectedPermission == permission._id,
          )}
          onChange={() => handlePermissionChange(permission._id)}
          defaultChecked={
            initialValues?.permission?.some((selectedPermission) => selectedPermission) ===
            selectedPermissions?.some((selectedPermission) => selectedPermission)
          }
        />
        <small>{permission.display_name}</small>
      </div>
    ))
  }

  const renderPermissions = () => {
    return types.map((type) => (
      <CCol md={6} key={type}>
        <CRow>
          <CCol md={6}>
            <h6>{type}</h6>
            {renderPermissionsByType(type)}
          </CCol>
        </CRow>
      </CCol>
    ))
  }

  return (
    <>
      <SingleSubHeader moduleName="Roles" />
      <CContainer fluid className="px-4">
        <CForm className="g-3 needs-validation" onSubmit={handleSubmit}>
          <CRow>
            <CCol md={4}>
              <CCard className="mb-4">
                <CCardHeader>Edit Role</CCardHeader>
                <CCardBody>
                  <div className="my-3">
                    <CFormLabel className="my-1">
                      Display Name<span className="text-danger">*</span>
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      name="display_name"
                      onChange={handleOnChange}
                      placeholder="Display Name"
                      value={initialValues.display_name ?? ''}
                    />
                  </div>

                  <div className="my-3">
                    <CFormLabel className="my-1">
                      Description<span className="text-danger">*</span>
                    </CFormLabel>
                    <CFormTextarea
                      type="text"
                      name="description"
                      onChange={handleOnChange}
                      placeholder="Description"
                      rows={3}
                      value={initialValues.description ?? ''}
                    />
                  </div>

                  <CCardFooter className="px-1">
                    {!isEditMode && (
                      <CButton className="submit_btn" type="submit" value="submit">
                        Submit
                      </CButton>
                    )}
                    {isEditMode && (
                      <CButton
                        className="btn btn-secondary  "
                        type="submit"
                        name="buttonClicked"
                        value="update"
                      >
                        Update
                      </CButton>
                    )}
                    <span className="mx-2">or </span>
                    <CButton
                      color="danger"
                      className=" text-light"
                      onClick={() => {
                        navigate('/admin/role/create')
                        setInitialValues({
                          display_name: '',
                          type: '',
                          description: '',
                        })
                      }}
                    >
                      Cancel
                    </CButton>
                  </CCardFooter>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol md={8}>
              <CCard>
                <CCardHeader>Role Permissions</CCardHeader>
                <CCardBody>
                  <CRow>
                    {types &&
                      types.length > 0 &&
                      types.map((type) => {
                        return (
                          <CCol md={4} key={type}>
                            <div className="mt-2">
                              <h6 className="text-capitalize">{type}</h6>
                              {renderPermissionsByType(type)}
                            </div>
                          </CCol>
                        )
                      })}

                    {/* <CCol md={6}>
                      <CRow>
                        <CCol md={6}>
                          <h6>Admin Log</h6>
                          <div>
                            <CFormCheck id="flexCheckDefault" />
                            ksdjafdkf
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <h6>News</h6>
                          <div>
                            <CFormCheck id="flexCheckDefault" />
                            oiwtuiwjgakjsdgkl
                          </div>
                        </CCol>
                      </CRow>
                    </CCol> */}

                    {/* <CCol md={6}>
                      <CRow>
                        <CCol md={6}>
                          <h6>Admin Log</h6>

                          <div>
                            <CFormCheck id="flexCheckDefault" />
                            dispaly name
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <h6>News</h6>

                          <div>
                            <CFormCheck id="flexCheckDefault" />
                            klsdfjkdjfkldf
                          </div>
                        </CCol>
                      </CRow>
                    </CCol> */}
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
    </>
  )
}
