import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://www.brickendon.com/" target="_blank" rel="noopener noreferrer">
          Brickendon
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://www.brickendon.com/" target="_blank" rel="noopener noreferrer">
          Brickendon consulting (India) private limited
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
