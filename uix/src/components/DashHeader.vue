<script setup lang="ts">
import { useUserStore } from '@/store'

// Initialize Pinia store
const userStore = useUserStore()

import { computed } from 'vue'

// Compute initials when the component
const newUserInitials = computed(() => {
  return userStore.user_name
    .split(' ')
    .map((word) => word[0])
    .join('')
})
</script>

<template>
  <section>
    <div class="user-initials">
      {{ newUserInitials }}
    </div>

    <div v-if="userStore.id">
      <p>{{ userStore.user_name }}</p>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

section > div:nth-of-type(2) {
  text-align: center;
}
.user-initials {
  background-color: #6e80a4;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f6f6f6;
  font-size: 1.3rem;
}

@media screen and (min-width: 64rem) {
  section {
    min-width: 10rem;
  }
}
</style>
