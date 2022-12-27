import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';


import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';

const app = express();

const httpServer= app.listen(8080, ()=>{ console.log('Server corriendo..')})

const socketServer = new Server(httpServer)

app.use(express.json())

app.use(express.static(__dirname + '/public'))

app.engine('handlebars' , handlebars.engine())

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use((req,res,next)=>{
    req.io = socketServer
    next()
})

app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

socketServer.on('connection', socket =>{
    
    socket.on('msg_front', message => console.log(message));
    socket.emit('msg_back',"Se a conectado al servicio")
    
})