import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import './index.css'
import NavBar from './components/NavBar/NavBar.tsx'
import NotFound from './components/NotFound/NotFound.tsx'
import SignupForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import EmployeePets from './components/EmployeePets/EmployeePets.tsx'
import EmployeeForm from './components/EmployeeForm/EmployeeForm';
import {io} from 'socket.io-client'
import { ConversationHistory } from './components/Chats/Conversations/ConversationHistory.tsx';
import { ConversationPage } from './components/Chats/Conversations/ConversationPage.tsx';
import { UserProvider } from './components/Users/UserContext.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import Logout from './components/Logout.tsx';

export const socket = io('ws://localhost:3001', {
  ackTimeout: 10000,
  retries: 3,
});

let router = createBrowserRouter([
  {
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: null
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/pets",
        element: <EmployeePets />
      },
      {
        path: "/forms",
        element: <EmployeeForm />
      },
      {
        path: "/conversation-history",
        element: <UserProvider><ConversationHistory></ConversationHistory></UserProvider>
      },
      {
        path: "/conversation-history/conversation/:conversation_id",
        element: <UserProvider><ConversationPage></ConversationPage></UserProvider>
      },
      {
        path: "/signup",
        element: <SignupForm />
      },
      {
        path: "/login",
        element: <LoginForm />
      },
      {
        path: "/logout",
        element: <Logout />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
