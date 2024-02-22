import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import {
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CCardHeader,
  CRow,
  CCard,
  CModalHeader,
  CModal,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CFormCheck,
  CButton,
  CCardBody,
} from '@coreui/react'
import { CardBody } from 'react-bootstrap'

const CreateUserForm = () => {
  const [selectedRoles, setSelectedRoles] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

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

  const handleCancel = () => {
    window.history.back()
  }
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
          }).then(() => {
            formik.resetForm()
            setSelectedRoles([])
            navigate('/users')
          })
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
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3" onSubmit={formik.handleSubmit}>
              <CCardHeader>
                <strong>{isEditMode ? 'Edit User' : 'Add User'}</strong>
              </CCardHeader>
              {/* <CCol md={6} style={{ backgroundColor: '#f4f4f4' }}> */}
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.firstName && !!formik.errors.firstName}
                  required
                />
                <CFormFeedback invalid>{formik.errors.firstName}</CFormFeedback>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.lastName && !!formik.errors.lastName}
                  required
                />
                <CFormFeedback invalid>{formik.errors.lastName}</CFormFeedback>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="mobileNumber"
                  label="Mobile Number"
                  value={formik.values.mobileNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.mobileNumber && !!formik.errors.mobileNumber}
                  required
                />
                <CFormFeedback invalid>{formik.errors.mobileNumber}</CFormFeedback>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isEditMode}
                  invalid={formik.touched.email && !!formik.errors.email}
                  required
                />
                <CFormFeedback invalid>{formik.errors.email}</CFormFeedback>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="address"
                  label="Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.address && !!formik.errors.address}
                  required
                />
                <CFormFeedback invalid>{formik.errors.address}</CFormFeedback>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="userTypeId">User Type</CFormLabel>
                <CFormSelect
                  id="userTypeId"
                  value={formik.values.userTypeId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.userTypeId && !!formik.errors.userTypeId}
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="1">Admin</option>
                  <option value="2">User</option>
                </CFormSelect>
                <CFormFeedback invalid>{formik.errors.userTypeId}</CFormFeedback>
              </CCol>
              <CCol md={6}>
                <label className="label">Role(s)</label>
                <br />
                {roles.map((role) => (
                  <div key={role.id} style={{ marginBottom: '6px' }}>
                    <input
                      type="checkbox"
                      name="roleIds"
                      value={role.id}
                      checked={selectedRoles && selectedRoles.includes(role.id)}
                      onChange={() => handleRoleChange(role.id)}
                    />
                    <label htmlFor={`role-${role.id}`} style={{ marginLeft: '7px' }}>
                      {role.name}
                    </label>
                  </div>
                ))}
                {formik.touched.roleIds && formik.errors.roleIds ? (
                  <div className="error">{formik.errors.roleIds}</div>
                ) : null}
              </CCol>
              {isEditMode && (
                <CCol xs={6}>
                  <CFormCheck
                    type="checkbox"
                    id="isActive"
                    label="Active (Check to indicate that the user is active)"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                  />
                </CCol>
              )}
              <CCol xs={12}>
                <CFormCheck
                  type="checkbox"
                  id="agreeChanges"
                  label={
                    <>
                      Agree to terms and conditions{' '}
                      <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => setVisible(!visible)}
                      >
                        (view terms and conditions)
                      </span>
                    </>
                  }
                  checked={formik.values.agreeChanges}
                  onChange={formik.handleChange}
                  required
                />
              </CCol>
              {visible && (
                <CCol xs={12}>
                  <CModal
                    backdrop="static"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    aria-labelledby="StaticBackdropExampleLabel"
                  >
                    <CModalHeader>
                      <CModalTitle id="StaticBackdropExampleLabel">
                        Terms and conditions
                      </CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <p>
                        1. Agreement By accessing or using the application, you agree to be bound by
                        these Terms and Conditions.
                      </p>
                      <p>
                        2. User Responsibilities You are responsible for maintaining the
                        confidentiality of your account and password. You are responsible for all
                        activities that occur under your account.
                      </p>
                      <p>
                        3. Privacy Your privacy is important to us. Please review our Privacy Policy
                        to understand how we collect, use, and disclose information.
                      </p>
                      <p>
                        4. Usage You may use the application for lawful purposes only. You agree not
                        to use the application for any unlawful purpose or in any way that violates
                        these Terms and Conditions.
                      </p>
                      <p>
                        5. Changes We reserve the right to modify or replace these Terms and
                        Conditions at any time. Your continued use of the application after any such
                        changes constitute acceptance of the new Terms and Conditions.
                      </p>
                      <p>
                        6. Contact Us If you have any questions about these Terms and Conditions,
                        please contact us.
                      </p>
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                      </CButton>
                    </CModalFooter>
                  </CModal>
                </CCol>
              )}
              <br /> <br />
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  {isEditMode ? 'Update' : 'Create'}
                </CButton>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <CButton onClick={handleCancel} oncolor="primary" type="button">
                  Cancel
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateUserForm
