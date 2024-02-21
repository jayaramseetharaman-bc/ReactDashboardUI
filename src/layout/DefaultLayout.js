import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { UnauthenticatedTemplate } from '@azure/msal-react'
import SignInButton from 'src/components/SignInButton'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
      <UnauthenticatedTemplate>
        <h5>
          <center>
            <SignInButton>Please sign-in to see your profile information.</SignInButton>
          </center>
        </h5>
      </UnauthenticatedTemplate>
    </div>
  )
}

export default DefaultLayout
