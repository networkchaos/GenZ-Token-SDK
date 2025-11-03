import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { apiKeyAuth } from './middleware/apiKeyAuth.js'
import { healthRouter } from './routes/health.js'
import { tokensRouter } from './routes/tokens.js'
import { walletsRouter } from './routes/wallets.js'
import { webhooksRouter } from './routes/webhooks.js'
import { depositsRouter } from './routes/deposits.js'

const app = express()
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.use('/v1/health', healthRouter)
app.use('/v1/tokens', apiKeyAuth, tokensRouter)
app.use('/v1/wallets', apiKeyAuth, walletsRouter)
app.use('/v1/deposits', depositsRouter)
app.use('/v1/webhooks', webhooksRouter)

const port = process.env.PORT ? Number(process.env.PORT) : 8080
app.listen(port, () => {
  console.log(`GenZ backend listening on :${port}`)
})


