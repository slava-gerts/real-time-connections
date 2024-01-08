import {useEffect, useState} from 'react'

type Message = {
  id: number
  message: string
}

const SSE = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [value, setValue] = useState('')

  useEffect(() => {
    const subscribe = async () => {
      const eventSource = new EventSource('http://localhost:5000/connect')
      eventSource.onmessage = function (event) {
        const message = JSON.parse(event.data)
        setMessages(curr => [message, ...curr])
      }
    }

    subscribe()
  }, [])

  const onSendMessage = async () => {
    await fetch('http://localhost:5000/new-messages', {
      method: 'POST',
      body: JSON.stringify({
        message: value,
        id: Date.now(),
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  return (
    <>
      <section>
        <h2>Server Site Events</h2>
        <input onChange={e => setValue(e.target.value)} type='text' value={value} />
        <button onClick={onSendMessage}>Send</button>

        <pre>
          Messages:
          {messages.map(({message, id}) => <p key={id}>{message}</p>)}
        </pre>
      </section>
    </>
  );
};

export default SSE;