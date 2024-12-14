<script>
import { watch, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store'
import { useCookies } from 'vue3-cookies'
import DashHeader from './DashHeader.vue'

const { cookies } = useCookies()

export default {
  components: {
    DashHeader,
  },
  setup() {
    const state = reactive({
      userId: '',
      recipientId: '',
      messageContent: '',
      messages: [],
      socket: null,
      isConnected: false,
    })

    const userStore = useUserStore()

    watch(
      () => userStore.id,
      (newId) => {
        state.recipientId = newId
        console.log('Updated recipient_id:', state.recipientId)
      },
      { immediate: true },
    )

    const fetchUserId = async () => {
      try {
        const response = await fetch('http://localhost:4192/api/v1/chat/getUserId', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.get('token')}`,
          },
        })
        const data = await response.json()
        if (response.ok && data.user_id) {
          console.log('user_id', data.user_id)
          state.userId = data.user_id
        } else {
          console.error('Failed to fetch user ID:', data.message)
        }
      } catch (error) {
        console.error('Error fetching user ID:', error)
      }
    }

    const connect = () => {
      if (!state.userId) {
        alert('User ID not set. Please try again.')
        return
      }

      state.socket = new WebSocket('ws://localhost:4192')

      state.socket.onopen = () => {
        state.isConnected = true
        state.socket.send(JSON.stringify({ type: 'identify', userId: state.userId }))
      }

      state.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === 'message') {
          state.messages.push({ from: data.from, content: data.content })
        } else if (data.type === 'info' || data.type === 'error') {
          alert(data.message)
        }
      }

      state.socket.onclose = () => {
        state.isConnected = false
        alert('Disconnected from server')
      }
    }

    const sendMessage = () => {
      if (!state.recipientId || !state.messageContent) {
        alert('Please enter a message.')
        return
      }

      const message = {
        type: 'message',
        toUserId: state.recipientId,
        content: state.messageContent,
      }

      state.socket.send(JSON.stringify(message))
      state.messages.push({ from: state.userId, content: state.messageContent })
      state.messageContent = ''
    }

    onMounted(fetchUserId)

    return {
      state,
      connect,
      sendMessage,
    }
  },
}
</script>

<template>
  <DashHeader />
  <div id="app">
    <h1>Private Chat</h1>

    <div>
      <button @click="connect">Connect</button>
    </div>

    <div>
      <p>
        You are connected as: <strong>{{ userId }}</strong>
      </p>

      <div class="message-input">
        <textarea v-model="state.messageContent" placeholder="Type your message"></textarea>
        <button @click="sendMessage">Send</button>
      </div>

      <div>
        <h2>Messages</h2>
        <div class="messages-container">
          <div
            v-for="(msg, index) in state.messages"
            :key="index"
            :class="['message', msg.from === state.userId ? 'sender' : 'recipient']"
          >
            <strong>{{ msg.from === state.userId ? 'You' : msg.from }}:</strong>
            <span>{{ msg.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 1em;
}

.message-input {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  height: 60px;
  margin-bottom: 10px;
}

.messages-container {
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.message {
  margin-bottom: 0.5em;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.message.sender {
  background-color: #e1ffc7;
  align-self: flex-end;
  text-align: right;
}

.message.recipient {
  background-color: #f1f1f1;
  align-self: flex-start;
  text-align: left;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message strong {
  display: block;
  font-size: 0.9em;
  margin-bottom: 5px;
}
</style>
