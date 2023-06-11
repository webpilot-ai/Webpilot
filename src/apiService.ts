import {Storage} from '@plasmohq/storage'

import {BASE_URL, GOOGLE_CREDENTIAL, ENDPOINT} from './apiConfig'

const baseURL = BASE_URL

async function sendRequest(endpoint, method = 'GET', payload = null) {
  const storage = new Storage()
  const url = `${baseURL}${endpoint}`
  const credential = (await storage.get(GOOGLE_CREDENTIAL)) || ''

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${credential}`,
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

    if (response.isSignedIn === false) {
      return {isSignedIn: false}
    }

    const {email, id} = response
    return {email, id, isSignedIn: true}
  } catch (error) {
    throw new Error('Failed to get user information')
  }
}

export async function getAPIUsage() {
  const endpoint = ENDPOINT.GET_API_USAGE

  try {
    const response = await sendRequest(endpoint)

    if (response.isSignedIn === false) {
      return {isSignedIn: false}
    }

    const {current_used: current, total_amount: total} = response
    return {current, total}
  } catch (error) {
    throw new Error('Failed to get user information')
  }
}
