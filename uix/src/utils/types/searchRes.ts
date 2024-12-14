export type OneSearchRes = {
  id: number
  user_name: string
  phone_number: string
  email: string
}

export interface AllSearchRes {
  status: string
  message: string
  searchRes: OneSearchRes[]
}
