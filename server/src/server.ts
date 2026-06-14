import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'
import { app } from './app.js'

async function bootstrap() {
  await connectDatabase()

  app.listen(env.port, () => {
    console.log(`EcoQuest API listening on port ${env.port}`)
  })
}

bootstrap().catch((error) => {
  console.error('Failed to start EcoQuest API', error)
  process.exit(1)
})
