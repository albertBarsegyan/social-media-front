import { api } from "./client"

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  name: string
}

export const authApi = {
  me: () => api.get("auth/me").json<User>(),
  login: (input: LoginInput) => api.post("auth/login", { json: input }).json<User>(),
  register: (input: RegisterInput) => api.post("auth/register", { json: input }).json<User>(),
  logout: () => api.post("auth/logout").then(() => undefined),
}
