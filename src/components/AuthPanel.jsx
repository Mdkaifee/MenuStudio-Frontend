import { useState } from 'react'

const PASSWORD_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$'
const EMAIL_PATTERN = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'

function AuthPanel({ mode, onModeChange, onLogin, onRegister, loading, error, notice }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    if (mode === 'register') {
      await onRegister({
        email: email.trim(),
        password,
        restaurant_name: restaurantName.trim(),
      })
      return
    }
    await onLogin({ email: email.trim(), password })
  }

  return (
    <div className="auth-panel card">
      <h1>Menu QR Studio</h1>
      <p className="muted">Create digital menus for every restaurant and launch with one QR code.</p>

      <div className="mode-toggle">
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => onModeChange('login')}>
          Login
        </button>
        <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => onModeChange('register')}>
          Register
        </button>
      </div>

      <form onSubmit={submit} className="stack">
        {mode === 'register' && (
          <label>
            Restaurant Name
            <input
              value={restaurantName}
              onChange={(event) => setRestaurantName(event.target.value)}
              maxLength={25}
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            pattern={EMAIL_PATTERN}
            maxLength={254}
            required
          />
        </label>

        <label>
          Password
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              pattern={PASSWORD_PATTERN}
              title="Minimum 8 characters with uppercase, lowercase, number, and special character"
              required
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {notice && <p className="success-note">{notice}</p>}
        {error && <p className="error">{error}</p>}

        <button disabled={loading} className="primary" type="submit">
          {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default AuthPanel
