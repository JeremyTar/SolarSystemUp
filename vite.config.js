import vitePluginString from "vite-plugin-string"

export default {
    build: {
        target: 'esnext'
      },
    plugins: [
        vitePluginString()
    ]
}