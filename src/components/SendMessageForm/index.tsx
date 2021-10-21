import { FormEvent, useContext, useState } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../context/auth'
import { api } from '../../services/api'
import styles from './styles.module.scss'

export function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext)
  const [message, setMessage] = useState('')

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault()

    if (!message.trim()) {
      return
    }

    await api.post('messages', { message })
    setMessage('')
  }

  if (!user) return null

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}>
        <figure className={styles.userImage}>
          <img src={user.avatar_url} alt={user.name} />
        </figure>

        <strong className={styles.userName}>{user.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user.login}
        </span>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <label htmlFor="send-message-form-text">Mensagem</label>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          name="message"
          id="send-message-form-text"
          placeholder="Qual sua expectativa para o evento"
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  )
}
