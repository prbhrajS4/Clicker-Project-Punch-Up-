import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8' // or 'istanbul'
    },
    env: {
      VITE_DATABASE_URL: "memory://"
    },
  }
})

