import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import './index.css'
import NavBar from './components/NavBar/NavBar.tsx'
import NotFound from './components/NotFound/NotFound.tsx'
import SignupForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import EmployeePets from './components/EmployeePets/EmployeePets.tsx'
import EmployeeForm from './components/EmployeeForm/EmployeeForm'

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
        element: null
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
        path: "/messages",
        element: null
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
