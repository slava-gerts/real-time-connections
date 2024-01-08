import {useEffect, useState} from 'react'

type Message = {
  id: number
  message: string
}

const LongPolling = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [value, setValue] = useState('')

  useEffect(() => {
    const subscribe = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-messages')
        const data = await response.json() as Message

        if (data) {
          setMessages(curr => [data, ...curr])
        }

        subscribe()
      } catch {
        setTimeout(() => {
          subscribe()
        }, 500)
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
        <h2>Long polling</h2>
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

export default LongPolling;