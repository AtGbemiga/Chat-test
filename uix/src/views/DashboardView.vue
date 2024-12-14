<script setup lang="ts">
import ChatRoom, { type ResGetUserId } from '@/components/ChatRoom.vue'
import SearchUser from '@/components/SearchUser.vue'
import UserFullInfo from '@/components/UserFullInfo.vue'
import { onMounted, ref } from 'vue'
import { useCookies } from 'vue3-cookies'

const resUserId = ref<number>() // Reactive reference for user ID

const { cookies } = useCookies()

// Get the token cookie
const my_cookie_value = cookies.get('token')

const errorMsg = ref('')

onMounted(() => {
  const initializeWebSocket = (userId: number) => {
    const websocket = new WebSocket(`ws://localhost:4192`)

    websocket.onopen = () => {
      console.log('WebSocket connected with userId:', userId)
      websocket.send(JSON.stringify({ type: 'CONNECT', userId }))
    }

    websocket.onmessage = (event) => {
      console.log('Received WebSocket message:', JSON.parse(event.data))
    }
  }

  const getUserId = async () => {
    try {
      const res = await fetch('/api/chat/getUserId', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${my_cookie_value}`,
        },
      })

      const responseData: ResGetUserId = await res.json()
      console.log('responseData', responseData)

      if (!res.ok) {
        // Handle server errors
        errorMsg.value = responseData.message || 'An error occurred during sign up.'
        return
      }

      if (responseData && responseData.status === 'success') {
        resUserId.value = responseData.user_id // Set reactive value
        console.log('userid', responseData.user_id)

        // Initialize WebSocket after fetching user ID
        initializeWebSocket(responseData.user_id)
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMsg.value = error.message
      } else {
        errorMsg.value = 'An unknown error occurred.'
      }
    }
  }

  getUserId()
})
</script>

<template>
  <article>
    <section class="dashboard-section-wrapper">
      <aside>
        <SearchUser />
      </aside>
      <section class="chat-wrapper">
        <ChatRoom />
      </section>
      <section>
        <UserFullInfo />
      </section>
    </section>
  </article>
</template>

<style scoped>
@media screen and (min-width: 64rem) {
  article {
    background-color: #8b8bd8;
    height: 100vh;
    max-height: fit-content;
    padding: 2rem;
  }

  .dashboard-section-wrapper {
    display: flex;
    background-color: #f6f6f6;
    padding: 2rem;
    min-width: 80vw;
    height: 100%;
  }

  aside {
    float: left;
  }

  .chat-wrapper {
    flex: 3;
    background-color: #f6f6f6;
    height: 100%;
  }
}
</style>
