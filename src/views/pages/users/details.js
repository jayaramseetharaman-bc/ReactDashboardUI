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
  CAlert,
} from '@coreui/react'
import Select from 'react-select'
import { AddorEditUser, GetUserById, GetRoles } from 'src/services/httpService'

const CreateUserForm = () => {
  const [selectedRoles, setSelectedRoles] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [isFormSubmit, setIsFormSubmit] = useState(null)
  const [errorMessage, setErrorMessage] = useState()
  const [roles, setRoles] = useState([])

  useEffect(() => {
    async function fetchRoles() {
      try {
        const roles = await GetRoles()
        console.log('Roles:', roles)
        setRoles(roles)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }
    fetchRoles()
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1])
    const userIdParam = urlParams.get('user-id')
    if (userIdParam) {
      setIsEditMode(true)
      setUserId(userIdParam)
      fetchUserData(userIdParam)
    }
  }, [])

  const handleCancel = () => {
    window.history.back()
  }
  const fetchUserData = async (userId) => {
    try {
      const userData = await GetUserById(userId)
      formik.setValues({
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobileNumber: userData.contactNumber,
        email: userData.email,
        address: userData.address,
        userTypeId: userData.userType,
        roleIds: userData.roleIds,
        isActive: userData.isActive,
        termsAndConditions: false,
      })
      setSelectedRoles(userData.roleIds)
    } catch (error) {
      console.error('Error fetching user data:', error.message)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch user data',
      })
    }
  }

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .matches(/^[a-zA-Z]+$/, 'First Name should only contain alphabetic characters')
      .min(2, 'First Name should be at least 2 characters long')
      .max(50, 'First Name should not exceed 50 characters'),
    lastName: Yup.string()
      .required('Last Name is required')
      .matches(/^[a-zA-Z]+$/, 'Last Name should only contain alphabetic characters')
      .min(2, 'Last Name should be at least 2 characters long')
      .max(50, 'Last Name should not exceed 50 characters'),
    mobileNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^\d{10}$/, 'Mobile Number should be a 10-digit number'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    address: Yup.string().required('Address is required'),
    userTypeId: Yup.number().min(1, 'User Type is required'),
    roleIds: Yup.array()
      .min(1, 'Please select at least one Role')
      .required('Please select at least one Role'),
    isActive: Yup.boolean(),
    termsAndConditions: Yup.boolean().test(
      'is-checked',
      'Please agree to the terms and conditions before saving',
      (value) => value === true,
    ),
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
      termsAndConditions: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsFormSubmit(true)

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
      try {
        const userData = await AddorEditUser(requestBody, endpoint, method)
        console.log(userData)
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `User ${isEditMode ? 'updated' : 'created'} successfully`,
        }).then(() => {
          formik.resetForm()
          setSelectedRoles([])
          navigate('/users')
        })
      } catch (err) {
        if (err.status === 409) {
          setErrorMessage('Email Already Exists.Please try with a different Email')
          formik.errors.email = 'Email Already Exists'
        } else {
          setErrorMessage('Unexpected Error Occured.Please try again after sometime')
        }
      }
    },
  })

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div>{isEditMode ? 'Edit User' : 'Add User'}</div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={12}>
              <CForm className="row g-3" onSubmit={formik.handleSubmit}>
                {isFormSubmit && errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                <CCol md={6}>
                  <CFormInput
                    type="text"
                    id="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.touched.firstName && !!formik.errors.firstName}
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
                  >
                    <option value="">Select User Type</option>
                    <option value="1">Admin</option>
                    <option value="2">User</option>
                  </CFormSelect>
                  <CFormFeedback invalid>{formik.errors.userTypeId}</CFormFeedback>
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="roleIds">Role(s)</CFormLabel>
                  <Select
                    isMulti
                    options={roles.map((role) => ({ value: role.roleId, label: role.roleName }))}
                    value={selectedRoles.map((roleId) => ({
                      value: roleId,
                      label: roles.find((role) => role.roleId === roleId)?.roleName,
                    }))}
                    onChange={(selectedOptions) => {
                      const selectedRoleIds = selectedOptions.map((option) => option.value)
                      setSelectedRoles(selectedRoleIds)
                      formik.setFieldValue('roleIds', selectedRoleIds)
                    }}
                    onBlur={formik.handleBlur('roleIds')}
                    className={formik.touched.roleIds && formik.errors.roleIds ? 'is-invalid' : ''}
                  />
                  {formik.touched.roleIds && formik.errors.roleIds && (
                    <div className="invalid-feedback">{formik.errors.roleIds}</div>
                  )}
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
                    id="termsAndConditions"
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
                    checked={formik.values.termsAndConditions}
                    onChange={() =>
                      formik.setFieldValue('termsAndConditions', !formik.values.termsAndConditions)
                    }
                    invalid={formik.touched.termsAndConditions && formik.errors.termsAndConditions}
                  />
                  <CFormFeedback className="text-danger" invalid>
                    {formik.errors.termsAndConditions}
                  </CFormFeedback>
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
                          1. Agreement By accessing or using the application, you agree to be bound
                          by these Terms and Conditions.
                        </p>
                        <p>
                          2. User Responsibilities You are responsible for maintaining the
                          confidentiality of your account and password. You are responsible for all
                          activities that occur under your account.
                        </p>
                        <p>
                          3. Privacy Your privacy is important to us. Please review our Privacy
                          Policy to understand how we collect, use, and disclose information.
                        </p>
                        <p>
                          4. Usage You may use the application for lawful purposes only. You agree
                          not to use the application for any unlawful purpose or in any way that
                          violates these Terms and Conditions.
                        </p>
                        <p>
                          5. Changes We reserve the right to modify or replace these Terms and
                          Conditions at any time. Your continued use of the application after any
                          such changes constitute acceptance of the new Terms and Conditions.
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
                    Save
                  </CButton>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <CButton onClick={handleCancel} color="primary" type="button">
                    Cancel
                  </CButton>
                </CCol>
              </CForm>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CreateUserForm
