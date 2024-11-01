import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api } from '../../axiosConfig'

interface JWTResponse {
  expirationDate: string
  token: string
}

export default function Login() {
  const [user, setUsername] = useState('')
  const [pass, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Try to login as a barber first
      const barberoResponse = await api.post('/barbero/login', { user, pass })
      if (barberoResponse.data.token) {
        handleSuccessfulLogin(barberoResponse.data, 'barbero')
        return
      }
    } catch (err) {
      // If barber login fails, try client login
      try {
        const clienteResponse = await api.post('/cliente/login', { user, pass })
        if (clienteResponse.data.token) {
          handleSuccessfulLogin(clienteResponse.data, 'cliente')
          return
        }
      } catch (err) {
        console.error('Error during client login:', err)
        setError('Credenciales inválidas. Por favor, intenta de nuevo.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessfulLogin = (jwtResponse: { token: string, expirationDate: string }, rol: string) => {
    localStorage.setItem('token', jwtResponse.token)
    localStorage.setItem('rol', rol)
    if (rol == 'barbero') {
      navigate('/dashboard-barbero')
    } else {
      navigate('/barberias-disponibles')
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>BarberTurn</h1>
        <h2 style={styles.subtitle}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={user}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={styles.input}
              required
            />
            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Link to="/recuperar-contrasena" style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Link>
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        {error && (
          <div style={styles.errorNotification}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        <p style={styles.footer}>
          ¿No tienes cuenta? <Link to="/registro" style={styles.registerLink}>Regístrate aquí</Link>
        </p>
        <p style={styles.footer}>© 2024 BarberTurn. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-gallery-tVsfhFLAU6Jg8Wx0HZ0WN8YsxgZbMP.jpg')`,
    backgroundSize: 'cover',
  },
  loginBox: {
    width: '300px',
    padding: '40px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    textAlign: 'center' as const,
    color: 'white',
  },
  title: {
    fontSize: '2.5em',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.5em',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  inputGroup: {
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    padding: '10px',
    paddingRight: '20px',
    borderRadius: '5px',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '2px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  forgotPassword: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.8em',
    alignSelf: 'flex-end' as const,
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    background: 'white',
    color: 'black',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
    ':disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  },
  footer: {
    marginTop: '20px',
    fontSize: '0.8em',
  },
  registerLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  errorNotification: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ff6b6b',
    marginTop: '10px',
    fontSize: '0.9em',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '5px',
  },
};
