import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilEnvelopeOpen, cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useEffect } from 'react'
import { loginRequest } from 'src/authConfig'
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react'

const AppHeaderDropdown = () => {
  const { instance, accounts } = useMsal()

  useEffect(() => {
    const requestProfilePhoto = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        console.log('res', response)
        localStorage.setItem('accessToken', response.accessToken)
      } catch (error) {
        console.error('Error fetching profile photo:', error)
      }
    }

    requestProfilePhoto()
  }, [instance, accounts])

  const generateInitials = (name) => {
    const initials = name.match(/\b\w/g) || []
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase()
  }
  const generateBackgroundColor = () => {
    return '#8B4513'
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    instance.logoutRedirect({
      postLogoutRedirectUri: '/#/logout',
    })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <div
          className="avatar-placeholder"
          style={{
            backgroundColor: generateBackgroundColor(),
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: '14px',
          }}
        >
          {accounts[0] ? generateInitials(accounts[0].name) : ''}
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          Account({accounts[0] ? accounts[0].localAccountId : ''})
        </CDropdownHeader>
        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" />
          {accounts[0] ? accounts[0].name : ''}
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilEnvelopeOpen} color="primary" className="me-2" />
          {accounts[0] ? accounts[0].username : ''}
        </CDropdownItem>
        <AuthenticatedTemplate>
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Sign Out
          </CDropdownItem>
        </AuthenticatedTemplate>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
