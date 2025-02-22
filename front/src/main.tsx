import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import './index.css'
import NavBar from './components/NavBar/NavBar.tsx'
import NotFound from './components/NotFound/NotFound.tsx'

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
        element: null
      },
      {
        path: "/forms",
        element: null
      },
      {
        path: "/messages",
        element: null
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
