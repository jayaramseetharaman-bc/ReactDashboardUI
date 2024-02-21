import React from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import SignInButton from './components/SignInButton'
import DefaultLayout from './layout/DefaultLayout'
import { Route, Routes } from 'react-router-dom'

const MainContent = () => {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <Routes>
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </AuthenticatedTemplate>
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

export default MainContent
