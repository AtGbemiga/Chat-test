// import { SERVERURL } from '@/utils/constants/urls'
// import type { VueCookies } from 'vue-cookies'
// import type { ResSuccess } from '@/utils/types/success'
// import { inject } from 'vue'
// import { tokenCheck } from './tokenCheck'

// // interface ResSignUp extends ResSuccess {
// //   token: string
// // }

// // const keyName = 'token'
// // const expires = 2 * 24 * 60 * 60 * 1000
// // const path = '/'
// // const secure = true
// // const sameSite = 'strict'

// // async function signUpFn(
// //   email: string,
// //   phone: string,
// //   name: string,
// // ): Promise<ResSignUp | undefined> {
// //   const url = `${SERVERURL}/auth/email-sign-up`

// //   const res = await fetch(url, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       Accept: 'application/json',
// //     },
// //     body: JSON.stringify({ email, phone, name }),
// //   })

// //   if (!res.ok) {
// //     const exactErrorMsg = await res.json()
// //     const errorMsgString = JSON.stringify(exactErrorMsg)
// //     const errorMsg = JSON.parse(errorMsgString).error

//     // Throw an error to stop further execution
//     return
//   }

//   const data: ResSignUp = await res.json()

//   console.log({ data })

//   // check for cookies, if found, update it, if not found, set it.
//   const $cookies = inject<VueCookies>('$cookies')
//   if (!tokenCheck() && $cookies) {
//     $cookies.set(keyName, data.token, expires, path, undefined, secure, sameSite)
//   } else if (tokenCheck() && $cookies) {
//     $cookies.remove(keyName, path)

//     $cookies.set(keyName, data.token, expires, path, undefined, secure, sameSite)
//   }

//   return data
// }
// export default signUpFn
