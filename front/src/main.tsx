import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import './index.css'
import NavBar from './components/NavBar/NavBar.tsx'
import NotFound from './components/NotFound/NotFound.tsx'
import SignupForm from './components/LoginSignUp/SignUpForm.tsx';
import LoginForm from './components/LoginSignUp/LoginForm.tsx';
import ViewPets from './components/Pets/ViewPets.tsx'
import AddPet from './components/Pets/AddPet.tsx';
import FormList from './components/forms/FormList.tsx';
import {io} from 'socket.io-client'
import { ConversationHistory } from './components/Chats/Conversations/ConversationHistory.tsx';
import { ConversationPage } from './components/Chats/Conversations/ConversationPage.tsx';
import { UserProvider } from './components/Users/UserContext.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import Logout from './components/LoginSignUp/Logout.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Users/Profile.tsx';
import { AuthProvider } from './components/AuthContext.tsx';
import ViewAdoptionForm from './components/forms/ViewAdoptionForm.tsx';
import OpenPet from './components/Pets/OpenPet.tsx';
import EditPet from './components/Pets/EditPet.tsx';

export const socket = io('ws://localhost:3001');

let router = createBrowserRouter([
  {
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: <UserProvider><ViewPets></ViewPets></UserProvider>
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/pets",
        element: <UserProvider><ViewPets></ViewPets></UserProvider>
      },
      {
        path: "/pets/id/:id",
        element: <UserProvider><OpenPet/></UserProvider>
      },
      {
        path: "/pets/create",
        element: <UserProvider><AddPet/></UserProvider>
      },
      {
        path: "pets/edit/:id",
        element: <UserProvider><EditPet/></UserProvider>
      },
      {
        path: "/forms",
        element:  <ProtectedRoute />,
        children: [{path: "", element: <FormList /> }],
      },
      {
        path: "/conversation-history",
        element: <ProtectedRoute />,
        children: [{ path: "", element:  <ConversationHistory></ConversationHistory>}],
      },
      {
        path: "/conversation-history/conversation/:conversation_id",
        element: <ProtectedRoute />,
        children: [{ path: "", element:  <PetProvider><ConversationPage></ConversationPage></PetProvider>}],
      },
      {
        path: "/profile",
        element: <ProtectedRoute />,
        children: [{ path: "", element: <Profile /> }],
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
        path: "forms/adoption/:adoptionFormId",
        element: <ViewAdoptionForm/>,
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
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
)
