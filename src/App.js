
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Registrationform from './components/Registrationform';
import Alldata from './components/Alldata';
import EditForm from './components/EditEmployeeData';

import AuthForm from './components/AuthForm';
import DashboardLayout from './components/DashboardLayout';
import Profile from './components/Profile';
import LoginForm from './components/LoginForm';
import UpdatePassword from './components/UpdatePassword';
import WelcomePage from './components/DashBoard';
import { useEffect } from 'react';




function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<LoginForm />} /> */}
          <Route path="/" element={<LoginForm />} />
          {/*  <Route path="/register" element={<Registrationform />} />   
          <Route path="/alldata" element={<Alldata />} />
          <Route path="/edit/:id" element={<EditForm />} />
 */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path='home' element={<WelcomePage />} />
            <Route path='profile' element={<Profile />} />
            <Route path='alldata' element={<Alldata />} />
            <Route path='addemployee' element={<Registrationform />} />
            <Route path='password' element={<UpdatePassword />} />

          </Route>


        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
