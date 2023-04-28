import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import chatRouter from './routes/chat.router.js'
import viewsRouter from './routes/views.router.js'
import { MessageService } from './repositories/index.js'
import config from './config/config.js'
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import sessionRouter from './routes/session.router.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errors.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import __dirname from './utils.js'
import { addLogger } from './logger_utils.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))
app.use(addLogger)

app.engine('handlebars', handlebars.engine())

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(cookieParser('mySecret'))

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion de e-Commerce',
      description: 'Este proyecto e-Commerce pertenece al trabajado integrador final del curso Backend'
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

mongoose.set({ strictQuery: true })
mongoose.connect(config.MONGO_URI, {
  dbname: config.MONGO_DB_NAME
}, async (error) => {
  if (!error) {
    console.log('Conectado a la base de datos')
    const httpServer = app.listen(config.PORT, () => {
      console.log('Servidor corriendo...')
    })

    const socketServer = new Server(httpServer)

    let messages = []

    socketServer.on('connection', socket => {
      socket.on('msg_front', data => console.log(data))
      socket.emit('msg_back', 'Conectado al servicio')

      socket.on('session', async data => {
        messages = await MessageService.get()
        socketServer.emit('first', messages)
      })

      socket.on('message', async data => {
        await MessageService.create(data)
        messages = await MessageService.get()
        socketServer.emit('logs', messages)
      })
    })

    app.use((req, res, next) => {
      req.io = socketServer
      next()
    })

    initializePassport()
    app.use(passport.initialize())

    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/api/chat', chatRouter)
    app.use('/session', sessionRouter)
    app.use('/views', viewsRouter)
    app.use(errorHandler)

    app.get('/loggerTest', (req, res) => {
      req.logger.fatal('FATAL')
      req.logger.error('ERROR')
      req.logger.warning('WARNING')
      req.logger.info('INFO')
      req.logger.http('HTTP')
      req.logger.debug('DEBUG')
    })

    app.get('/', (req, res) => {
      res.redirect('views/products')
    }
    )
  } else {
    console.log('ups!! no se pudo conectar a la base de datos')
  }
})
