import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            enabled: false,
            reporter: ['text', 'json', 'html'],
        },
    },
})