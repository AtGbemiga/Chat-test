<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store' // Adjust the path to your store file
import type { OneSearchRes } from '../utils/types/searchRes'

const props = defineProps<{
  person: OneSearchRes
}>()

const userInitials = ref('')

// Initialize Pinia store
const userStore = useUserStore()

// Compute initials when the component is mounted
onMounted(() => {
  userInitials.value = props.person.user_name
    .split(' ')
    .map((word) => word[0])
    .join('')
})

// Handle button click to update the store
function handleClick() {
  userStore.update(
    props.person.id,
    props.person.user_name,
    props.person.phone_number,
    props.person.email,
  )
}
</script>

<template>
  <button @click="handleClick">
    <section>
      <div class="user-initials">
        {{ userInitials }}
      </div>
      <div>
        <h3>{{ props.person.user_name }}</h3>
        <p>some latest chat</p>
      </div>
      <div class="extras-wrapper">
        <time>8:00 pm</time>
        <div class="unread-message-wrapper">
          <p class="unread-message-count">2</p>
        </div>
      </div>
    </section>
  </button>
</template>

<style scoped>
button {
  display: inherit;
  width: 100%;
  background-color: inherit;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

section {
  padding: 0.5rem 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  align-items: center;
}

section > div:nth-of-type(2) {
  text-align: start;
}

.user-initials {
  background-color: #6e80a4;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f6f6f6;
  font-size: 2rem;
}

h3 {
  font-weight: 700;
}

.extras-wrapper {
  text-align: end;
}

.unread-message-wrapper {
  display: flex;
  justify-content: flex-end;
}

.unread-message-count {
  background-color: #3758f9;
  color: #f6f6f6;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
