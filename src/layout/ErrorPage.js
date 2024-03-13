import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'

const ErrorPage = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">401 Unauthorized</h1>
              <h4 className="pt-3">Oops! You{"'"}re not allowed.</h4>
              <p className="text-medium-emphasis float-start">
                The page you are trying to access requires proper authorization. Please check your
                credentials and try again. If you believe you should have access, please contact the
                administrator.
              </p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ErrorPage
