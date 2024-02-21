import { LogLevel } from '@azure/msal-browser'

export const msalConfig = {
  auth: {
    clientId: '86fb7a10-b70e-4a74-990e-896235ce2d28',
    authority: 'https://login.microsoftonline.com/6a93ae23-97f2-41b5-82aa-c7143b2a1868',
    redirectUri: 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            return
          case LogLevel.Info:
            console.info(message)
            return
          case LogLevel.Verbose:
            console.debug(message)
            return
          case LogLevel.Warning:
            console.warn(message)
            return
          default:
            return
        }
      },
    },
  },
}

export const loginRequest = {
  scopes: ['User.Read'],
}

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
}
