import {BASE_URL, ENDPOINT} from './apiConfig'

const baseURL = BASE_URL

async function sendRequest(endpoint, method = 'GET', payload = null) {
  const url = `${baseURL}${endpoint}`

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if needed
    },
    body: payload ? JSON.stringify(payload) : null,
  }

  try {
    const response = await fetch(url, options)

    if (response.status === 403) {
      return {isSignedIn: false}
    }

    const responseData = await response.json()
    if (!response.ok) {
      // Handle other error responses
      const {error, message} = responseData
      throw new Error(message || error || 'Request failed')
    }

    return responseData
  } catch (error) {
    // Handle network errors
    throw new Error('Network error')
  }
}

// export async function loginWithGoogle(clientId, credential) {
//   const endpoint = '/login/google'
//   const payload = {
//     client_id: clientId,
//     credential,
//   }

//   try {
//     const response = await sendRequest(endpoint, 'POST', payload)
//     const {email, id, token} = response
//     return {email, id, token, isSignedIn: true}
//   } catch (error) {
//     if (error.message === '1006') {
//       throw new Error('Invalid Google authentication credential')
//     }
//     throw new Error('Login failed')
//   }
// }

export async function getUser() {
  const endpoint = ENDPOINT.GET_USER

  try {
    const response = await sendRequest(endpoint)

    if (!response.isSignedIn) {
      return {isSignedIn: false}
    }

    const {email, id} = response
    return {email, id, isSignedIn: true}
  } catch (error) {
    throw new Error('Failed to get user information')
  }
}
