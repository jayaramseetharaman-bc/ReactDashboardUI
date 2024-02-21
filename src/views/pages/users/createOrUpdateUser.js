import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { CCardBody, CForm } from '@coreui/react'
import { CardBody } from 'react-bootstrap'

const CreateUserForm = () => {
  const [selectedRoles, setSelectedRoles] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()

  const roles = [
    { id: 1, name: 'Team Lead' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Consultant' },
    { id: 4, name: 'Software Engineer' },
  ]

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
    const userIdParam = urlParams.get('user-id')
    if (userIdParam) {
      setIsEditMode(true)
      setUserId(parseInt(userIdParam))
      fetchUserData(userIdParam)
    }
  }, [])

  const fetchUserData = async (userId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL
      const response = await fetch(`${apiUrl}/users?user-id=${userId}`)
      if (response.ok) {
        const userData = await response.json()
        formik.setValues({
          firstName: userData.userData.firstName,
          lastName: userData.userData.lastName,
          mobileNumber: userData.userData.contactNumber,
          email: userData.userData.email,
          address: userData.userData.address,
          userTypeId: userData.userData.userType,
          roleIds: userData.roleIds,
          isActive: userData.userData.isActive,
        })
        setSelectedRoles(userData.roleIds)
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch user data',
      })
    }
  }

  const handleRoleChange = (roleId) => {
    const updatedRoles = selectedRoles.includes(roleId)
      ? selectedRoles.filter((id) => id !== roleId)
      : [...selectedRoles, roleId]

    formik.setFieldValue('roleIds', updatedRoles)
    setSelectedRoles(updatedRoles)
  }

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    address: Yup.string().required('Address is required'),
    userTypeId: Yup.number().min(1, 'User Type is required'),
    roleIds: Yup.array().min(1, 'Please select at least one Role'),
    isActive: Yup.boolean(),
  })

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      address: '',
      userTypeId: 0,
      roleIds: [],
      isActive: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL
        let endpoint = '/users'
        let method = 'POST'
        if (isEditMode) {
          endpoint = `/users?user-id=${userId}`
          method = 'PUT'
        }

        const requestBody = isEditMode
          ? {
              userRequestInfo: {
                firstName: values.firstName,
                lastName: values.lastName,
                mobileNumber: values.mobileNumber,
                email: values.email,
                address: values.address,
                userTypeId: values.userTypeId,
                roleIds: values.roleIds,
              },
              isActive: values.isActive,
            }
          : {
              firstName: values.firstName,
              lastName: values.lastName,
              mobileNumber: values.mobileNumber,
              email: values.email,
              address: values.address,
              userTypeId: values.userTypeId,
              roleIds: values.roleIds,
            }

        const response = await fetch(`${apiUrl}${endpoint}`, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        const data = await response.json()
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `User ${isEditMode ? 'updated' : 'created'} successfully`,
          })
          formik.resetForm()
          setSelectedRoles([])
          navigate('/users')
        } else {
          throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} user`)
        }
      } catch (error) {
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} user:`, error.message)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || `Failed to ${isEditMode ? 'update' : 'create'} user`,
        })
      }
    },
  })

  return (
    <div className="forms">
      <form onSubmit={formik.handleSubmit} className="user-form">
        <h2 className="title">{isEditMode ? 'Edit User' : 'Add User'} </h2>
        <br />
        <div className="row">
          <div className="column">
            <label className="label">First Name</label>
            <br />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="error">{formik.errors.firstName}</div>
            ) : null}
          </div>
          <div className="column">
            <label className="label">Last Name</label> <br />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="error">{formik.errors.lastName}</div>
            ) : null}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="column">
            <label className="label">Mobile Number</label> <br />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
              <div className="error">{formik.errors.mobileNumber}</div>
            ) : null}
          </div>
          <div className="column">
            <label className="label">Email</label> <br />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isEditMode}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
        </div>
        <br />
        <div className="row">
          <div className="column">
            <label className="label">Address</label> <br />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.address && formik.errors.address ? (
              <div className="error">{formik.errors.address}</div>
            ) : null}
          </div>
          <div className="column">
            <label className="label">User Type</label>
            <br />
            <div>
              <input
                type="radio"
                id="admin"
                name="userTypeId"
                value="1"
                checked={formik.values.userTypeId === 1}
                onChange={() => formik.setFieldValue('userTypeId', 1)}
              />
              <label htmlFor="admin">Admin</label>
              &nbsp;&nbsp;&nbsp;
              <input
                type="radio"
                id="user"
                name="userTypeId"
                value="2"
                checked={formik.values.userTypeId === 2}
                onChange={() => formik.setFieldValue('userTypeId', 2)}
              />
              <label htmlFor="user">User</label>
            </div>
            {formik.touched.userTypeId && formik.errors.userTypeId ? (
              <div className="error">{formik.errors.userTypeId}</div>
            ) : null}
          </div>
        </div>
        {isEditMode && (
          <div className="row">
            <div className="column">
              <input
                type="checkbox"
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
              />
              &nbsp;&nbsp;
              <label className="label">Active</label>
            </div>
          </div>
        )}
        <div className="row">
          <div className="column">
            <label className="label">Role(s)</label>
            <br />
            {roles.map((role) => (
              <div key={role.id}>
                <input
                  type="checkbox"
                  name="roleIds"
                  value={role.id}
                  checked={selectedRoles && selectedRoles.includes(role.id)}
                  onChange={() => handleRoleChange(role.id)}
                />
                <label htmlFor={`role-${role.id}`}>{role.name}</label>
              </div>
            ))}
            {formik.touched.roleIds && formik.errors.roleIds ? (
              <div className="error">{formik.errors.roleIds}</div>
            ) : null}
          </div>
        </div>
        <button type="submit">{isEditMode ? 'Update' : 'Create'}</button>
      </form>
    </div>
  )
}

export default CreateUserForm
