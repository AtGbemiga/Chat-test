import { inject } from 'vue'
import type { VueCookies } from 'vue-cookies'

// check for token in cookies
export const tokenCheck = () => {
  const $cookies = inject<VueCookies>('$cookies')

  if (!$cookies) {
    return false
  } else if (!$cookies.get('token')) {
    return false
  } else {
    return true
  }
}
