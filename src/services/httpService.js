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
  const userUrl = new URL('https://localhost:7226/users/userList')
  userUrl.searchParams.append('PageIndex', pageIndex + 1)
  userUrl.searchParams.append('PageSize', pageSize)
  if (searchKeyword !== null) {
    userUrl.searchParams.append('SearchKeyword', searchKeyword)
  }
  if (selectedStatus !== null && selectedStatus.trim() !== '') {
    userUrl.searchParams.append('SearchByStatus', selectedStatus === 'active' ? true : false)
  }
  if (selectedRoles.length > 0) {
    selectedRoles.forEach((roleId) => {
      userUrl.searchParams.append('SearchByRoles', roleId)
    })
  }
  userUrl.searchParams.append('SortBy', sortBy)
  userUrl.searchParams.append('SortOrder', sortOrder)
  // const apiKey = 'otb5xg2keprbf0qjn0btnngokdz26nc1'
  const userResponse = await fetch(userUrl.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!userResponse.ok) {
    throw new Error('Failed to fetch employee details', userResponse.statusText)
  }
  const userData = await userResponse.json()

  return userData
}
export async function DeleteUserById(userId) {
  const deleteUrl = `https://localhost:7226/users?userId=${userId}`
  const response = await fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error('Failed to delete user', response.statusText)
  }
}
