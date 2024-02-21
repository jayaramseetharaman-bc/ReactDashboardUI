import React from 'react'
import { useEffect, useMemo, useState } from 'react'
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
import { cilUserPlus } from '@coreui/icons'

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
          return <span>{'' + renderedCellValue}</span>
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
            <Link to={`adduser?user-id=${renderedCellValue}`} className="me-3">
              Edit
            </Link>
            <CButton color="link" onClick={() => HandleDeleteButtonClick(renderedCellValue)}>
              Delete
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
    // enableGlobalFilter:false,
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
    muiTableHeadProps: {
      sx: {
        borderRight: '1px solid #e0e0e0', //add a border between columns
        '& tr:nth-of-type(odd)': {
          backgroundColor: '#9da5b1',
        },
      },
    },
    muiTableBodyProps: {
      sx: {
        //stripe the rows, make odd rows a darker color
        '& td:nth-of-type(odd)': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderRight: '1px solid #e0e0e0', //add a border between columns
      },
    },

    muiTablePaperProps: {
      elevation: 0, //change the mui box shadow
      //customize paper styles
    },
    state: {
      pagination,
      globalFilter,
      sorting,
    },
  })

  return (
    <CCard className="mb-4">
      <CCardHeader>Users List</CCardHeader>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <CButton color="primary" className="me-md-2 mt-2" onClick={() => HandleAddButtonClick()}>
          <CIcon icon={cilUserPlus} className="me-2" />
          Add user
        </CButton>
      </div>
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
export default UserDetails
