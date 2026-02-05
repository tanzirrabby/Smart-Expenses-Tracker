# Frontend Updates - Login/Register to Dashboard Flow

## Changes Made

### 1. **Refactored App.jsx**
   - Simplified the main App component to manage authentication state
   - Separated concerns by importing Login and Dashboard components
   - Improved state initialization with proper localStorage handling
   - Added clear login/logout flow control

### 2. **New Login Component** (`src/components/Login.jsx`)
   - Dedicated login/registration page
   - Username and password input fields
   - Toggle between login and register modes
   - Loading state management
   - Better error handling and user feedback
   - Form validation

### 3. **New Dashboard Component** (`src/components/Dashboard.jsx`)
   - Complete expense tracking dashboard
   - User profile display with logout button
   - Total spent calculation
   - Add expense form with validation
   - Recent transactions list
   - Real-time expense fetching
   - Improved styling and UX

## Key Features

✅ **Automatic Redirect**: After successful login/registration, users are automatically redirected to the dashboard
✅ **Persistent Session**: Uses localStorage to maintain session across page refreshes
✅ **Clean UI**: Separated components for better maintainability
✅ **Error Handling**: Better error messages and validation
✅ **Loading States**: Visual feedback during API calls
✅ **Authorization**: Includes Bearer token in API requests

## How to Use

### Development
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Login
1. On the login page, enter your username and password
2. Click "Login" or "Sign Up" for a new account
3. On successful authentication, you'll be automatically redirected to the dashboard

### Dashboard
- View your total spending
- Add new expenses with title and amount
- See recent transactions
- Click "Logout" to return to the login page

## API Endpoints Used

- `POST http://localhost:3000/api/auth/login` - Login
- `POST http://localhost:3000/api/auth/register` - Register
- `GET http://localhost:3000/api/expenses` - Fetch expenses
- `POST http://localhost:3000/api/expenses` - Add expense

## File Structure

```
frontend/src/
├── App.jsx                 (Main app with auth logic)
├── components/
│   ├── Login.jsx          (Login/Register page)
│   └── Dashboard.jsx      (Expense dashboard)
├── App.css
├── index.css
└── main.jsx
```

## Requirements

- Node.js 16+
- React 19.2+
- Axios 1.13+
- React Router DOM (optional, installed but not yet used)
- Vite (dev server)

## Troubleshooting

### Login fails
- Ensure the API Gateway is running on port 3000
- Check that the user-service is running on port 3001
- Verify credentials are correct

### Dashboard doesn't load
- Check browser console for errors
- Ensure token is being saved in localStorage
- Verify the user object contains an `id` field

### Expenses not showing
- Refresh the page
- Check network requests in browser DevTools
- Ensure the expense-service is running on port 3002

## Starting All Services (Windows)

Run the provided PowerShell script:
```powershell
.\start-all.ps1
```

This will start all services in separate terminal windows:
- User Service (port 3001)
- Expense Service (port 3002)
- Budget Service (port 3003)
- Analytics Service (port 3004)
- Notification Service (port 3005)
- API Gateway (port 3000)
- Frontend (port 5173)
