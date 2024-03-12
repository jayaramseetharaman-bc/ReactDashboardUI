import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCardTitle, CContainer } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
  const navigate = useNavigate()
  const handleSignIn = () => {
    navigate('/')
  }
  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CCard className="text-center">
            <CCardHeader>
              {' '}
              <CCardTitle className="font-bold text-gray-200 text-9xl">
                401-Unauthorised issue
              </CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CCardTitle>
                {' '}
                Access is allowed only for registered users. Please try to login again.
              </CCardTitle>
              <CButton className="btn-lg" color="link" onClick={handleSignIn}>
                {' '}
                Back to login
              </CButton>{' '}
            </CCardBody>
          </CCard>
        </CContainer>
      </div>
    </>
  )
}

export default ErrorPage
