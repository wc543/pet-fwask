import React, { useContext } from 'react'
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
import { ThemeProvider } from '@mui/material/styles';
import {  AuthProvider } from './components/AuthContext.tsx';
import ViewAdoptionForm from './components/forms/ViewAdoptionForm.tsx';
import OpenPet from './components/Pets/OpenPet.tsx';
import EditPet from './components/Pets/EditPet.tsx';
import { PetProvider } from './components/Pets/PetContext.tsx'
import ViewFosterParentForm from './components/forms/ViewFosterParentForm.tsx'
import ViewFosterPetForm from './components/forms/ViewFosterPetForm.tsx'
import SubmitAdoptionForm from './components/forms/SubmitAdoptionForm.tsx'
import SubmitFosterPetForm from './components/forms/SubmitFosterPetForm.tsx'
import SubmitFosterParentForm from './components/forms/SubmitFosterParentForm.tsx'
import { getTheme } from './theme.tsx'

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
        path: "/forms/:userId",
        element:  <ProtectedRoute />,
        children: [{path: "", element: <PetProvider><UserProvider><FormList /></UserProvider></PetProvider> }],
      },
      {
        path: "/conversation-history",
        element: <ProtectedRoute />,
        children: [{ path: "", element:  <PetProvider><ConversationHistory></ConversationHistory></PetProvider>}],
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
        element: <UserProvider><PetProvider><ViewAdoptionForm/></PetProvider></UserProvider>,
      },
      {
        path: "forms/foster-parent/:fosterParentFormId",
        element: <UserProvider><PetProvider><ViewFosterParentForm/></PetProvider></UserProvider>,
      },
      {
        path: "forms/foster-pet/:fosterPetFormId",
        element: <UserProvider><PetProvider><ViewFosterPetForm/></PetProvider></UserProvider>,
      },
      {
        path: "forms/submitAdoptionForm/:petId",
        element: <ProtectedRoute />,
        children: [{path:"", element: <PetProvider><UserProvider><SubmitAdoptionForm/></UserProvider></PetProvider>}],
      },
      {
        path: "forms/submitFosterPetForm/:petId",
        element: <ProtectedRoute />,
        children: [{path:"", element: <PetProvider><UserProvider><SubmitFosterPetForm/></UserProvider></PetProvider>}],
      },
      {
        path: "forms/submitFosterParentForm/:userId",
        element: <ProtectedRoute />,
        children: [{path:"", element: <PetProvider><UserProvider><SubmitFosterParentForm/></UserProvider></PetProvider>}],
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);

function ThemedApp() {
  const theme = getTheme();
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <ThemedApp />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
)
