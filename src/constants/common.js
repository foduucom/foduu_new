import axios from "axios"

export const checkRole = (roleName, admin) => {
  if (admin && admin.role) {
    return admin.role.some((role) => role.name === roleName)
  }
  return false
}
                                                                                                                                   
export function hasAccess(userRole, roles) {
  if (Array.isArray(userRole) && roles) {
    return roles.some((r) => {
      if (userRole && Array.isArray(userRole)) {
        return userRole.map((item) => item?.toLowerCase()).includes(r?.toLowerCase())
    }
      return false
    })
  } else if (userRole && roles) {
    return roles.map((item) => item?.toLowerCase()).includes(userRole?.toLowerCase())
  } else {
    return false
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                           
export function convertUtcToDate(utcDateString) {
  const utcDate = new Date(utcDateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = utcDate.toLocaleDateString('en-US', options);
  return formattedDate;
}

export function convertUtcToDateWithTime(utcDateString) {
  const utcDate = new Date(utcDateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const formattedDateTime = utcDate.toLocaleDateString('en-US', options);
  return formattedDateTime;
}


export const handleDownload = async (fullUrl) => {
  try {
    const response = await axios.get(fullUrl, {
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    const filename = fullUrl.split('/').pop()
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    // customSuccessMSG(dispatch, 'File Downloaded Successfully !!')
  } catch (error) {
    console.error('Error downloading image:', error)
  }
}


