import React, { useEffect, useMemo, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { GetUserDetailsWithPagination, DeleteUserById } from 'src/services/httpService'
import { Link, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAccordion,
  CAccordionItem,
  CAccordionBody,
  CAccordionHeader,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { cilPlus } from '@coreui/icons'
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa'
import Select from 'react-select'

function UserDetails() {
  const navigate = useNavigate()
  const selectInputRef = useRef()
  const [userData, setUserData] = useState({
    userList: [],
    rowCount: 0,
  })
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [globalFilter, setGlobalFilter] = useState(null)
  const [sorting, setSorting] = useState([])
  const [visible, setVisible] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  const [selectedSearchOptions, setselectedSearchOptions] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [triggerApiCall, setTriggerApiCall] = useState(false)

  const roles = [
    { id: 1, name: 'Team Lead' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Consultant' },
    { id: 4, name: 'Software Engineer' },
  ]
  let searchByOptions = [
    { id: 1, name: 'Status' },
    { id: 2, name: 'Roles' },
  ]

  async function GetUserDetails(currentPage, pageCount, globalFilter, sorting) {
    try {
      const userJson = await GetUserDetailsWithPagination(
        currentPage,
        pageCount,
        globalFilter,
        sorting,
        selectedStatus,
        selectedRoles,
      )
      setUserData(userJson)
      console.log('userJson', userData)
      console.log('statevalues', userData)
    } catch (err) {
      console.log(err)
    }
  }

  async function HandleDeleteUser(userId) {
    try {
      await DeleteUserById(userId)
      setVisible(false)
      GetUserDetails(pagination.pageIndex, pagination.pageSize, globalFilter, sorting)
    } catch (err) {
      console.log(err)
    }
  }
  function HandleDeleteButtonClick(userId) {
    setUserIdToDelete(userId)
    setVisible(true)
  }

  function HandleAddButtonClick() {
    navigate('/users/adduser')
  }

  function HandleSearchButtonClick() {
    setGlobalFilter(searchTerm)
    setTriggerApiCall((prevState) => !prevState)
  }
  // function HandleSearchButtonClick() {
  //   setGlobalFilter(searchTerm)
  //   if (selectedSearchOptions && selectedSearchOptions.length > 0) {
  //     if (selectedSearchOptions.includes(1)) {
  //       console.log('activefilterselected', selectedStatus)
  //     } else if (selectedSearchOptions.includes(2)) {
  //       console.log('rolesfilterselected', selectedRoles)
  //     }
  //   }
  //   setTriggerApiCall((prevState) => !prevState)
  // }
  function HandleClearButtonClick() {
    setSearchTerm('')
    setGlobalFilter('')
    //setselectedSearchOptions([])
    setSelectedRoles([])
    setSelectedStatus(null)
    // selectInputRef.current.clearValue()
    setTriggerApiCall((prevState) => !prevState)
  }

  useEffect(() => {
    GetUserDetails(pagination.pageIndex, pagination.pageSize, globalFilter, sorting)
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, sorting, triggerApiCall])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'userName',
        header: 'User Name',
        size: 150,
        enableColumnActions: false,
      },
      {
        accessorKey: 'email',
        header: 'User Email',
        size: 150,
        enableColumnActions: false,
      },
      {
        accessorKey: 'contactNumber',
        header: 'User Contact',
        size: 100,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'isActive',
        header: 'IsActive',
        size: 100,
        // eslint-disable-next-line react/prop-types
        Cell: ({ renderedCellValue }) => {
          return (
            <span>
              {renderedCellValue ? (
                <span
                  className="badge"
                  style={{ backgroundColor: 'Green', color: 'white', fontSize: '13px' }}
                >
                  Yes
                </span>
              ) : (
                <span
                  className="badge"
                  style={{ backgroundColor: 'Red', color: 'white', fontSize: '13px' }}
                >
                  No
                </span>
              )}
            </span>
          )
        },
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'roleIds',
        header: 'Roles',
        size: 150,
        Cell: ({ renderedCellValue }) => {
          const rolesList = renderedCellValue
            .map((roleId) => {
              const role = roles.find((role) => role.id === roleId)
              return role ? role.name : ''
            })
            .filter((role) => role !== '')

          return <span>{rolesList.join(', ')}</span>
        },
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'userId',
        header: 'Actions',
        size: 100,
        enableSorting: false,
        enableColumnActions: false,
        // eslint-disable-next-line react/prop-types
        Cell: ({ renderedCellValue }) => (
          <div>
            <Link
              to={`edituser?user-id=${renderedCellValue}`}
              style={{ fontSize: '1rem' }}
              className="me-1"
            >
              <FaEdit />
            </Link>
            <CButton
              className="mb-1"
              color="link"
              onClick={() => HandleDeleteButtonClick(renderedCellValue)}
            >
              <FaTrashAlt />
            </CButton>
          </div>
        ),
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: userData.userList,
    muiTableBodyCellProps: {
      sx: {
        borderRight: '2px  #e0e0e0',
        maxWidth: '200px',
        wordWrap: 'break-word',
      },
    },
    // initialState: { showGlobalFilter: true },
    enableGlobalFilter: false,
    enableColumnFilters: false,
    enableGlobalFilterModes: false,
    enableFacetedValues: false,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    enableDensityToggle: false,
    enableHiding: false,
    enableFullScreenToggle: false,
    positionGlobalFilter: 'left',
    rowCount: userData.rowCount,
    paginationDisplayMode: 'pages',
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    state: {
      pagination,
      globalFilter,
      sorting,
    },
  })

  return (
    <>
      <CCard className="mb-2">
        <CCardHeader>
          <CAccordion flush>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Search</CAccordionHeader>
              <CAccordionBody>
                <div className="mb-3 me-5"></div>
                <div className="d-flex flex-wrap align-items-center">
                  <div className="mb-3 me-4 custom-select">
                    <CInputGroup>
                      <CInputGroupText id="addon-wrapping">
                        <FaSearch />
                      </CInputGroupText>
                      <CFormInput
                        className=""
                        id="searchInput"
                        placeholder="Search by Username and Email"
                        aria-label="Search"
                        aria-describedby="addon-wrapping"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </CInputGroup>
                  </div>
                  <div className="mb-3 me-4">
                    <Select
                      className="custom-search-select"
                      placeholder="Search by Role"
                      isMulti
                      options={roles.map((role) => ({
                        value: role.id,
                        label: role.name,
                      }))}
                      value={selectedRoles.map((roleId) => ({
                        value: roleId,
                        label: roles.find((role) => role.id === roleId).name,
                      }))}
                      onChange={(selectedOptions) => {
                        const selectedRoleIds = selectedOptions.map((option) => option.value)
                        setSelectedRoles(selectedRoleIds)
                      }}
                    />
                  </div>
                  <div className="mb-3 me-4">
                    <Select
                      className="custom-search-select"
                      placeholder="Search by Status"
                      isSearchable
                      isClearable
                      options={[
                        // { value: '', label: 'Select...' },
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                      ]}
                      value={
                        selectedStatus
                          ? {
                              value: selectedStatus,
                              label: selectedStatus === 'active' ? 'Active' : 'Inactive',
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setSelectedStatus(selectedOption ? selectedOption.value : null)
                      }
                    />
                  </div>
                  <div className="ms-auto">
                    <CButton
                      color="primary"
                      className="me-3"
                      onClick={() => HandleSearchButtonClick()}
                    >
                      Search
                    </CButton>
                    <CButton color="primary" onClick={() => HandleClearButtonClick()}>
                      Clear
                    </CButton>
                  </div>
                </div>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CCardHeader>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>Users</div>
          <div>
            <CButton
              color="primary"
              className="me-md-3 mt-2"
              onClick={() => HandleAddButtonClick()}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Add
            </CButton>
          </div>
        </CCardHeader>
        <div style={{ zIndex: 0 }}>
          <MaterialReactTable table={table} />
          <CModal
            alignment="center"
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="VerticallyCenteredExample"
          >
            <CModalHeader>
              <CModalTitle id="VerticallyCenteredExample">Delete User Confirmation</CModalTitle>
            </CModalHeader>
            <CModalBody>Do you really want to delete the user?</CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
              <CButton color="danger" onClick={() => HandleDeleteUser(userIdToDelete)}>
                Delete
              </CButton>
            </CModalFooter>
          </CModal>
        </div>
      </CCard>
    </>
  )
}

UserDetails.propTypes = {
  renderedCellValue: PropTypes.any,
}

export default UserDetails
