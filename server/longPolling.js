const express = require('express')
const cors = require('cors')
const events = require('events')

const PORT = 5000

const emmiter = new events.EventEmitter()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/get-messages', (req, res) => {
  emmiter.once('newMessage', message => {
    console.log(`Raised newMessage event with message ${message.message}`)
    res.json(message)
  })
})

app.post('/new-messages', (req, res) => {
  const message = req.body
  console.log(`Received a message ${message.message}`)
  emmiter.emit('newMessage', message)

  res.status(200).json({})
})

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))