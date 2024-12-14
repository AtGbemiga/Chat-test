import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: undefined as number | undefined,
    user_name: '',
    phone_number: '',
    email: '',
  }),

  getters: {
    updateValue: (state) => ({
      id: state.id,
      user_name: state.user_name,
      phone_number: state.phone_number,
      email: state.email,
    }),
  },
  actions: {
    update(id: number, user_name: string, phone_number: string, email: string) {
      this.id = id
      this.user_name = user_name
      this.phone_number = phone_number
      this.email = email
    },
  },
})
