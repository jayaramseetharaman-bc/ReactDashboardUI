import React, { useEffect, useMemo, useState } from 'react'
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
    debugger
    console.log('searchtext', searchTerm)
    setGlobalFilter(searchTerm)
    if (selectedSearchOptions && selectedSearchOptions.length > 0) {
      if (selectedSearchOptions.includes(1)) {
        console.log('activefilterselected', selectedStatus)
      } else if (selectedSearchOptions.includes(2)) {
        console.log('rolesfilterselected', selectedRoles)
      }
    }
  }
  function HandleClearButtonClick() {
    setSearchTerm('')
    setGlobalFilter('')
    setselectedSearchOptions([])
    setSelectedRoles([])
    setSelectedStatus(null)
  }

  useEffect(() => {
    GetUserDetails(pagination.pageIndex, pagination.pageSize, globalFilter, sorting)
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, sorting])

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
        size: 150,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'isActive',
        header: 'IsActive',
        size: 150,
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
        size: 200,
        Cell: ({ renderedCellValue }) => {
          const [isRolesOpen, setIsRolesOpen] = useState(false)
          return (
            <>
              <CButton
                className="btn-lg"
                color="link"
                style={{ fontSize: '13px', marginLeft: '-15px' }}
                onClick={() => setIsRolesOpen(!isRolesOpen)}
              >
                {isRolesOpen ? 'Hide Roles' : 'Show Roles'}
              </CButton>

              {isRolesOpen && (
                <div>
                  {renderedCellValue.map((roleId) => {
                    const role = roles.find((role) => role.id === roleId)
                    return <div key={roleId}>{role.name}</div>
                  })}
                </div>
              )}
            </>
          )
        },
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: 'userId',
        header: 'Actions',
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
          <CAccordion flush activeItemKey={2}>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>Search</CAccordionHeader>
              <CAccordionBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <CInputGroup>
                      <CInputGroupText id="addon-wrapping">
                        <FaSearch />
                      </CInputGroupText>
                      <CFormInput
                        id="searchInput"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="addon-wrapping"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="ms-2">
                        <CButton
                          className="btn btn-primary"
                          color="primary"
                          onClick={() => HandleSearchButtonClick()}
                        >
                          Search
                        </CButton>
                        <CButton
                          className="btn btn-primary ms-2"
                          color="primary"
                          onClick={() => HandleClearButtonClick()}
                        >
                          Clear
                        </CButton>
                      </div>
                    </CInputGroup>
                  </div>
                  <div className="ms-md-3 mt-2 d-flex align-items-center">
                    <div className="me-3">Search By</div>
                    <Select
                      className="custom-select"
                      id="search-by"
                      isMulti
                      options={searchByOptions.map((searchby) => ({
                        value: searchby.id,
                        label: searchby.name,
                      }))}
                      onChange={(selectedOptions) => {
                        const selectedSearchOptions = selectedOptions.map((option) => option.value)
                        setselectedSearchOptions(selectedSearchOptions)
                        if (selectedOptions.length === 0) {
                          setSelectedStatus('')
                          setSelectedRoles([])
                        }
                      }}
                    />
                  </div>
                </div>
                <CInputGroup className="mt-3 d-flex align-items-center">
                  {selectedSearchOptions.includes(1) && (
                    <div>
                      <div className="ms-3">Status</div>
                      <CFormSelect
                        size="sm"
                        className="mb-3 mt-2 ms-2"
                        aria-label="status"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value=""> Select...</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </CFormSelect>
                    </div>
                  )}

                  {selectedSearchOptions.includes(2) && (
                    <div className="ms-2">
                      <div className="ms-2">Roles</div>
                      <Select
                        className="mb-3 mt-2 ms-2 me-3"
                        isMulti
                        options={roles.map((role) => ({ value: role.id, label: role.name }))}
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
                  )}
                </CInputGroup>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CCardHeader>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>Users</div>
          <CButton color="primary" className="me-md-3 mt-2" onClick={() => HandleAddButtonClick()}>
            <CIcon icon={cilPlus} className="me-2" />
            Add
          </CButton>
        </CCardHeader>
        <div>
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
