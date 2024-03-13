import httpClient from 'src/interceptors/http-request-interceptor'
const baseUrl = process.env.REACT_APP_API_URL

export async function GetUserDetailsWithPagination(
  pageIndex,
  pageSize,
  searchKeyword = null,
  sorting,
  selectedStatus = null,
  selectedRoles = [],
) {
  var sortBy = 'userName'
  var sortOrder = 'ASC'
  if (sorting && sorting.length > 0) {
    sortBy = sorting[0].id
    var sortOrderBoolean = sorting[0].desc

    if (sortOrderBoolean) {
      sortOrder = 'DESC'
    }
  }
  const url = `${baseUrl}/users/data`
  const userUrl = new URL(url)
  userUrl.searchParams.append('PageIndex', pageIndex + 1)
  userUrl.searchParams.append('PageSize', pageSize)
  if (searchKeyword !== null) {
    userUrl.searchParams.append('SearchKeyword', searchKeyword)
  }
  if (selectedStatus !== null && selectedStatus.trim() !== '') {
    userUrl.searchParams.append('Status', selectedStatus === 'active' ? true : false)
  }
  if (selectedRoles.length > 0) {
    selectedRoles.forEach((roleId) => {
      userUrl.searchParams.append('Roles', roleId)
    })
  }
  userUrl.searchParams.append('SortBy', sortBy)
  userUrl.searchParams.append('SortOrder', sortOrder)
  // const apiKey = 'otb5xg2keprbf0qjn0btnngokdz26nc1'
  try {
    const userResponse = await httpClient.get(userUrl)
    return userResponse.data
  } catch (error) {
    throw new Error('Failed to fetch employee details', error.response.status)
  }
}
export async function DeleteUserById(userId) {
  const deleteUrl = `${baseUrl}/users?user-id=${userId}`
  try {
    await httpClient.delete(deleteUrl)
  } catch (error) {
    throw new Error('Failed to delete user', error.response.status)
  }
}

export async function AddorEditUser(formData, url, httpMethod) {
  const userUrl = `${baseUrl}${url}`
  try {
    const userRequest = JSON.stringify(formData)
    if (httpMethod === 'POST') {
      await httpClient.post(userUrl, userRequest)
    } else {
      await httpClient.put(userUrl, userRequest)
    }
  } catch (error) {
    const errorData = {
      message: 'Failed to Add or Edit User',
      status: error.response.status,
    }
    throw errorData
  }
}

export async function GetUserById(userId) {
  const userUrl = `${baseUrl}/users?user-id=${userId}`
  try {
    const userResponse = await httpClient.get(userUrl)
    return userResponse.data
  } catch (error) {
    throw new Error('Failed to fetch user data', error.response.status)
  }
}
export async function GetRoles() {
  const rolesUrl = `${baseUrl}/users/config/roles`
  try {
    const roles = await httpClient.get(rolesUrl)
    return roles.data
  } catch (error) {
    throw new Error('Failed to fetch user roles', error.response.status)
  }
}
export async function GetUserExists(userId) {
  debugger
  const userExists = `${baseUrl}/users/is-exist?user-id=${userId}`
  try {
    const isUserExists = await httpClient.get(userExists)
    return isUserExists
  } catch (error) {
    throw new Error('Failed to fetch user status', error.response.status)
  }
}
