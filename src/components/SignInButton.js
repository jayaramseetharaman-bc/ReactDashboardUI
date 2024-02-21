import { useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from 'src/authConfig'

export const SignInButton = () => {
  const { instance } = useMsal()

  useEffect(() => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.log(e)
    })
  }, [instance])

  return null
}

export default SignInButton
