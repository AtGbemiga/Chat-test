<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DottedDesign',
  props: {
    position: {
      type: String,
      validator: (value: string) => ['right', 'left'].includes(value),
    },
  },
})
</script>

<template>
  <div class="design" :style="{ justifyContent: position === 'right' ? 'end' : 'start' }">
    <div>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<style scoped>
.design {
  height: 2.5rem;
  display: flex;
  background-color: #f6f6f6;
}

.design > div {
  height: 100%;
  width: 4rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  place-items: center;
}

span {
  background-color: blue;
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 50%;
}
</style>
