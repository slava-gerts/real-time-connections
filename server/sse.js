const express = require('express')
const cors = require('cors')
const events = require('events')

const PORT = 5000

const emmiter = new events.EventEmitter()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/connect', (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  })

  emmiter.on('newMessage', message => {
    console.log(`Raised newMessage event with ${message}`)
    res.write(`data: ${JSON.stringify(message)} \n\n`)
  })
})

app.post('/new-messages', (req, res) => {
  const message = req.body
  console.log(`Received a message ${message.message}`)
  emmiter.emit('newMessage', message)

  res.status(200).json({})
})

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))