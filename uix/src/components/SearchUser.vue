<script setup lang="ts">
import { ref } from 'vue'
import SearchResCard from './SearchResCard.vue'
import type { AllSearchRes, OneSearchRes } from '@/utils/types/searchRes'
import { debounce } from '@/lib/debounce'

const searchWord = ref('')
const searchResult = ref<OneSearchRes[]>([])
const errorMsg = ref('')

// Add delay to user input typing to prevent several DB calls
const newOnInputChange = debounce(() => onInputChange(), 400)

/**
 * Handles input change event for search input field.
 * If input is empty, clears the search result and error message.
 * Otherwise, sends a POST request to the server with the search word as JSON payload.
 * If the response is successful, updates the search result and clears the error message.
 * If the response is not successful, clears the search result and updates the error message.
 */
const onInputChange = async () => {
  if (!searchWord.value) {
    errorMsg.value = ''
    searchResult.value = []
    return
  }

  try {
    const res = await fetch(`/api/user/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchWord: searchWord.value }),
    })

    const responseData: AllSearchRes = await res.json()

    if (!res.ok) {
      // Handle server errors
      searchResult.value = [] // Clear search results
      errorMsg.value = responseData.message || 'An error occurred during search.'
      return
    }

    if (responseData && responseData.status === 'success') {
      searchResult.value = responseData.searchRes
      errorMsg.value = '' // Clear error message
    }
  } catch (error: unknown) {
    searchResult.value = [] // Clear search results
    if (error instanceof Error) {
      errorMsg.value = error.message
    } else {
      errorMsg.value = 'An unknown error occurred.'
    }
  }
}
</script>

<template>
  <aside>
    <div class="logo-wrapper">
      <img src="/logo.png" alt="logo" />
    </div>
    <div class="search-wrapper">
      <i class="pi pi-search" style="color: black"></i>
      <label for="searchWord"></label>
      <input
        type="search"
        v-model="searchWord"
        name="searchWord"
        id="searchWord"
        placeholder="search"
        v-on:keyup="newOnInputChange"
      />
    </div>
    <section>
      <p v-if="errorMsg" class="error">
        {{ errorMsg }}
      </p>
      <div v-else>
        <SearchResCard v-for="res in searchResult" :key="res.id" :person="res" />
      </div>
    </section>
  </aside>
</template>

<style scoped>
aside {
  height: fit-content;
  padding: 1rem;
}

.logo-wrapper {
  display: flex;
  justify-content: start;
  height: 3rem;
}

.search-wrapper {
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #f5f5f5;
}

input {
  border: none;
  background-color: #f5f5f5;
  flex: 2;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
