import React from 'react'
import { loginRequest } from 'src/authConfig'
import { useMsal } from '@azure/msal-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCardTitle,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const SignInPage = () => {
  const navigate = useNavigate()
  const { instance } = useMsal()
  const handleSignIn = () => {
    navigate('/')
  }
  return (
    <>
      <CCard className="text-center mt-5">
        <CCardHeader>Logout</CCardHeader>
        <CCardBody>
          <CCardTitle>
            You have been successfully logged out.Please click the below link to sign in again.
          </CCardTitle>
          <CButton className="btn-lg" color="link" onClick={handleSignIn}>
            {' '}
            Back to login
          </CButton>{' '}
        </CCardBody>
      </CCard>
    </>
  )
}

export default SignInPage
