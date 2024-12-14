<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCookies } from 'vue3-cookies'
import DottedDesign from '@/components/DottedDesign.vue'
import router from '../router'
import type { ResSuccess } from '../utils/types/success'

const { cookies } = useCookies()

const my_cookie_value = cookies.get('token')
onMounted(() => {
  if (my_cookie_value) {
    router.push('/dashboard') // redirect to dashboard if token is present
  }
})

const initialValues = ref({
  name: '',
  email: '',
  phone: '',
})

const errorMsg = ref('')

interface ResSignUp extends ResSuccess {
  token: string
  message: string
}

const onFormSubmit = async () => {
  if (!initialValues.value.name || !initialValues.value.email || !initialValues.value.phone) {
    return
  }

  try {
    const res = await fetch('/api/auth/email-sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON format
      },
      body: JSON.stringify(initialValues.value),
    })

    const responseData: ResSignUp = await res.json()

    if (!res.ok) {
      // Handle server errors (e.g., "User already exists")
      errorMsg.value = responseData.message || 'An error occurred during sign up.'
      return
    }

    if (responseData && responseData.status === 'success') {
      cookies.set('token', responseData.token)
      router.push('/dashboard')
    }
  } catch (error) {
    errorMsg.value = (error as Error).message
  }
}
</script>

<template>
  <article>
    <form v-on:submit.prevent="onFormSubmit">
      <DottedDesign :position="`right`" />
      <section>
        <div class="logo-wrapper">
          <img src="/logo.png" alt="logo" />
        </div>
        <div>
          <label for="name"></label>
          <input type="text" id="name" v-model="initialValues.name" placeholder="Name" required />
        </div>
        <div>
          <label for="email"></label>
          <input
            type="email"
            id="email"
            v-model="initialValues.email"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label for="phone"></label>
          <input
            type="phone"
            id="phone"
            v-model="initialValues.phone"
            placeholder="Phone Number"
            required
          />
        </div>
        <button>Sign Up</button>
        <div v-if="errorMsg">
          <p class="error">{{ errorMsg }}</p>
        </div>
      </section>
      <DottedDesign :position="`left`" />
    </form>
  </article>
</template>

<style scoped>
article {
  background-color: #8b8bd8;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

section {
  background-color: #f6f6f6;
  padding: 2rem;
  width: calc(100vw - 1rem);
  min-height: calc(50vh - 1rem);
  height: fit-content;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  row-gap: 1rem;
}

div {
  /* outline: 1px solid red; */
}

input {
  width: 100%;
  padding: 0.5rem;
  border-color: #d3d3d3;
  border-style: solid;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  height: 3rem;
}

button {
  background-color: #6e80a4;
  color: #f6f6f6;
  padding: 0.7rem;
}

@media screen and (min-width: 64rem) {
  section {
    width: 25rem;
  }
}
</style>
