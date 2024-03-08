const baseUrl = process.env.REACT_APP_API_URL
function getAuthToken() {
  return localStorage.getItem('accessToken')
}

export async function GetUserDetailsWithPagination(
  pageIndex,
  pageSize,
  searchKeyword = null,
  sorting,
  selectedStatus = null,
  selectedRoles = [],
) {
  const accessToken = getAuthToken()
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
  const userResponse = await fetch(userUrl.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!userResponse.ok) {
    throw new Error('Failed to fetch employee details', userResponse.statusText)
  }
  const userData = await userResponse.json()

  return userData
}
export async function DeleteUserById(userId) {
  const accessToken = getAuthToken()
  const deleteUrl = `${baseUrl}/users?user-id=${userId}`
  const response = await fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to delete user', response.statusText)
  }
}

export async function AddorEditUser(formData, url, httpMethod) {
  const accessToken = getAuthToken()
  const userResponse = await fetch(`${baseUrl}${url}`, {
    method: httpMethod,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(formData),
  })
  if (!userResponse.ok) {
    const errorData = {
      message: 'Failed to Add User',
      status: userResponse.status,
    }
    throw errorData
  }
  const userData = await userResponse.json()
  return userData
}

export async function GetUserById(userId) {
  const accessToken = getAuthToken()
  const userUrl = `${baseUrl}/users?user-id=${userId}`
  const response = await fetch(userUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch user data', response.statusText)
  }
  const userData = await response.json()
  return userData
}
export async function GetRoles() {
  debugger
  const accessToken = getAuthToken()
  const userUrl = `${baseUrl}/users/roles`
  const response = await fetch(userUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch user data', response.statusText)
  }
  const roles = await response.json()
  return roles
}
