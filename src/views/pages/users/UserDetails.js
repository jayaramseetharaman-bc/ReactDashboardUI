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
} from '@coreui/react'
import { cilPlus } from '@coreui/icons'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'

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
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [visible, setVisible] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  // const theme = useTheme()
  // const baseBackgroundColor =
  //   theme.palette.mode === 'dark' ? 'rgba(3, 44, 43, 1)' : 'rgba(244, 255, 233, 1)'
  // const baseBackgroundColor = 'rgba(213, 241, 222, 255)'

  const roles = [
    { id: 1, name: 'Team Lead' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Consultant' },
    { id: 4, name: 'Software Engineer' },
  ]

  async function GetUserDetails(currentPage, pageCount, globalFilter, sorting) {
    try {
      console.log(sorting)
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
    initialState: { showGlobalFilter: true },
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
    // muiTableHeadProps: {
    //   sx: {
    //     borderRight: '1px solid #e0e0e0', //add a border between columns
    //     '& tr:nth-of-type(odd)': {
    //       backgroundColor: '#9da5b1',
    //     },
    //   },
    // },
    // muiTableBodyProps: {
    //   sx: (theme) => ({
    //     '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td': {
    //       backgroundColor: darken(baseBackgroundColor, 0.1),
    //     },
    //     '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td': {
    //       backgroundColor: darken(baseBackgroundColor, 0.2),
    //     },
    //     '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td': {
    //       backgroundColor: lighten(baseBackgroundColor, 0.1),
    //     },
    //     '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td': {
    //       backgroundColor: darken(baseBackgroundColor, 0.2),
    //     },
    //   }),
    // },
    // muiTableBodyCellProps: {
    //   sx: {
    //     borderRight: '1px solid #e0e0e0', //add a border between columns
    //   },
    // },
    // muiTablePaperProps: {
    //   elevation: 0, //change the mui box shadow
    //   //customize paper styles
    // },
    // mrtTheme: (theme) => ({
    //   baseBackgroundColor: baseBackgroundColor,
    //   // draggingBorderColor: theme.palette.secondary.main,
    // }),

    state: {
      pagination,
      globalFilter,
      sorting,
    },
  })

  return (
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
  )
}

UserDetails.propTypes = {
  renderedCellValue: PropTypes.any,
}

export default UserDetails
