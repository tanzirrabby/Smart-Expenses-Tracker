import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const auth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isRegistering 
      ? `${API_URL}/auth/register` 
      : `${API_URL}/auth/login`;

    // For registration, email is required. For login, we use email
    const payload = isRegistering
      ? { 
          username: email, 
          email: email,  // Use email as both username and email
          password: password 
        }
      : { 
          email: email,  // Login with email
          password: password 
        };

    try {
      const res = await axios.post(endpoint, payload);
      console.log("✅ Success:", res.data);
      
      if (isRegistering) {
        alert("Account Created! Now logging you in...");
        if (res.data.token) {
          onLoginSuccess(res.data);
        } else {
          setIsRegistering(false);
        }
      } else {
        onLoginSuccess(res.data);
      }
    } catch (err) {
      console.error("❌ Auth Error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);
      
      let errorMsg = 'Action Failed';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message === 'Network Error') {
        errorMsg = 'Cannot connect to server. Make sure all services are running.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'Network error - Cannot reach API Gateway (port 3000)';
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      alert('Error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          margin: '0 0 30px 0',
          fontSize: '28px',
          color: '#333',
          fontWeight: 'bold'
        }}>
          {isRegistering ? '📝 Create Account' : '💳 Smart Tracker'}
        </h2>
        
        <form onSubmit={auth} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
          <div>
            <label style={{display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:'600', color: '#333'}}>
              {isRegistering ? 'Email or Username' : 'Username'}
            </label>
            <input 
              placeholder={isRegistering ? "Enter email or username" : "Enter your username"} 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div>
            <label style={{display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:'600', color: '#333'}}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s',
              marginTop: '10px'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
          >
            {loading ? '⏳ Processing...' : (isRegistering ? '✅ Sign Up' : '🔓 Login')}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setEmail('');
              setPassword('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'underline',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#764ba2'}
            onMouseOut={(e) => e.target.style.color = '#667eea'}
          >
            {isRegistering ? '← Login' : 'Sign Up →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
