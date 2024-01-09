import {useEffect, useRef, useState} from 'react'

type Message = {
  id: number
  message: string
  event: 'connection' | 'message'
  username: string
}

const WebSocketComponent = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [value, setValue] = useState('')
  const [connected, setConnected] = useState(false)
  const [username, setUsername] = useState('')

  const socket = useRef<WebSocket>()

  const onConnect = () => {
    socket.current = new WebSocket('ws://localhost:5000')

    socket.current.onopen = () => {
      setConnected(true)

      const message = {
        event: 'connection',
        username,
        id: Date.now(),
      }

      socket.current?.send(JSON.stringify(message))
    }
    socket.current.onmessage = (event) => {
      setMessages(curr => [JSON.parse(event.data), ...curr])
    }
    socket.current.onclose = () => {
      console.log('Socket closed')
    }
    socket.current.onerror = () => {
      console.log('Unexpected error')
    }
  }

  const onSendMessage = async () => {
    const message = {
      event: 'message',
      username,
      message: value,
      id: Date.now(),
    }

    socket.current?.send(JSON.stringify(message))
  }

  if (!connected) {
    return (
      <section>
        <h2>Please enter your name</h2>
        <input onChange={e => setUsername(e.target.value)} type='text' placeholder='Enter your name' value={username} />
        <button onClick={onConnect}>Sign in</button>
      </section>
    )
  }

  return (
    <>
      <section>
        <h2>Web socket</h2>
        <input onChange={e => setValue(e.target.value)} type='text' value={value} />
        <button onClick={onSendMessage}>Send</button>

        <pre>
          Messages:
          {messages.map(({message, id, username, event}) => {
            return (
              <p key={id}>
                {
                  event === 'connection' 
                    ? `User ${username} connected`
                    : `${username}: ${message}`
                }
              </p>
            )
          })}
        </pre>
      </section>
    </>
  );
};

export default WebSocketComponent;