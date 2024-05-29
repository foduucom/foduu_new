import { CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import { useEffect, useState } from 'react'
import BasicProvider from 'src/constants/BasicProvider'
import Select from 'react-select'

const CaseFilter = ({ rowPerPage, filterData, setFilterData, onFilter, onReset }) => {
  const [initialvalue, setInitialvalue] = useState({
    cin_number: '',
    applicant_name: '',
    case_of_branch: '',
    ra_branch: '',
    finance_name: '',
  })
  const [rabranchData, setRAbranchData] = useState()
  const [financenameData, setFinancenameData] = useState()
  useEffect(() => {
    setInitialvalue(filterData)
  }, [filterData])

  useEffect(() => {
    fetchRAbranch()
    fetchFinancename()
  }, [])

  async function fetchRAbranch() {
    try {
      var response = await new BasicProvider(`ra_branch?count=1000`).getRequest()
      var data = response?.data.data
      setRAbranchData(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchFinancename() {
    try {
      var response = await new BasicProvider(
        `cms/categories/get-childrentree/finance_name?count=1000`,
      ).getRequest()
      var data = response?.data
      setFinancenameData(data.finance_name)
    } catch (error) {
      console.log(error)
    }
  }
  function getOptionList(data, defaultOption = { value: '', label: 'Select' }) {
    const options = data
      ? data.map((cast) => ({
          value: cast?._id,
          label: cast?.name,
        }))
      : []
    return [defaultOption, ...options]
  }

  function getOptionsList(data, defaultOption = { value: '', label: 'Select' }) {
    const options = []
    data?.forEach((item) => {
      if (item.children && item.children.length > 0) {
        const childrenOptions = item.children.map((child) => ({
          value: child._id,
          label: child.name,
        }))
        options.push(...childrenOptions)
      }
    })
    return [defaultOption, ...options]
  }

  const rabranchOptions = getOptionList(rabranchData)
  const financeOptions = getOptionsList(financenameData)

  const handleFilter = async () => {
    initialvalue.count = rowPerPage
    initialvalue.page = 1
    setFilterData(initialvalue)
    onFilter(initialvalue)
  }

  const handleChange = (name, value) => {
    setInitialvalue((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <div>
      <div className="datatable bg-white mb-2 p-3 pb-0">
        <CForm>
          <CRow className="align-items-center">
            <CCol xs={12} lg={4} className="align-items-center">
              <CFormLabel>Search By CIN Number</CFormLabel>
              <CFormInput
                name="cin_number"
                placeholder="Enter CIN Number..."
                value={initialvalue.cin_number}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </CCol>

            {/* Applicant name */}
            <CCol xs={12} lg={4} className="align-items-center">
              <CFormLabel>Applicant Name</CFormLabel>
              <CFormInput
                name="applicant_name"
                placeholder="Enter Applicant Name..."
                value={initialvalue.applicant_name}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </CCol>

            {/* Case of branch */}
            {/* <CCol xs="4" className="align-items-center">
                            <CFormLabel>Case of Branch</CFormLabel>
                            <CFormInput
                                name="case_of_branch"
                                placeholder="Enter Case of Branch..."
                                value={initialvalue.case_of_branch}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </CCol> */}

            {/* RA Branch */}
            <CCol xs={12} lg={4} className="align-items-center">
              <CFormLabel>RA Branch</CFormLabel>
              <Select
                name="ra_branch"
                className="mb-2 mb-lg-0"
                value={
                  rabranchOptions &&
                  rabranchOptions.find((option) => option.value === initialvalue.ra_branch)
                }
                options={rabranchOptions}
                onChange={(event) => {
                  setInitialvalue((prevValue) => ({
                    ...prevValue,
                    ra_branch: event.value,
                  }))
                }}
              />
            </CCol>

            {/* Finance Name  */}
            <CCol xs={12} lg={4} className="align-items-center">
              <CFormLabel>Finance Name</CFormLabel>
              <Select
                name="finance_name"
                value={
                  financeOptions &&
                  financeOptions.find((option) => option.value === initialvalue.finance_name)
                }
                options={financeOptions}
                onChange={(event) => {
                  setInitialvalue((prevValue) => ({
                    ...prevValue,
                    finance_name: event.value,
                  }))
                }}
              />
            </CCol>

            {/* button  filter reset */}
            <CCol xs={6} lg={3}>
              <div className="d-flex mt-3  align-items-center">
                <CButton
                  color="primary "
                  className=" ms-2 w-70 px-2"
                  type="submit"
                  onClick={(event) => {
                    event.preventDefault()
                    handleFilter()
                  }}
                >
                  Filter
                </CButton>
                <CButton
                  color="danger "
                  onClick={() => {
                    onReset()
                  }}
                  className=" ms-2 px-2 w-70"
                  style={{ color: 'white' }}
                >
                  Reset
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </div>
    </div>
  )
}

export default CaseFilter
