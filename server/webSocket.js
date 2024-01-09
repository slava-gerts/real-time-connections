const ws = require('ws')

const PORT = 5000

const wss = new ws.Server({
  port: PORT,
}, () => console.log(`Server started on port ${PORT}`))

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    const parsedMessage = JSON.parse(message)

    switch (parsedMessage.event) {
      case 'message':
      case 'connection':
        broadcastMessage(parsedMessage)
        break
    }
  })
})

function broadcastMessage(message) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify(message))
  })
}