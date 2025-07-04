export const API_ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  RESET_PASSWORD_REQUEST: '/reset-password-request',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_VERIFY: '/reset-password-token-verify',
  
  // Tasks
  TODOS: '/todos',
  TODO_BY_ID: (id: number) => `/todos/${id}`,
  
  // Categories
  CATEGORIES: '/category',
  CATEGORY_BY_ID: (id: number) => `/category/${id}`,
  
  // Tags
  TAGS: '/tags',
  
  // User
  USER: '/user',
} as const;
