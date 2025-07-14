import React, { useState } from 'react';
import LoginForm from './LoginForm';
import Registrationform from './Registrationform';



const AuthForm = () => {
  const [activeForm, setActiveForm] = useState('login');




  return (

    
    <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
     
      <nav style={{ backgroundColor: 'blue', padding: '10px 20px', color: 'white' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="m-0">Employee Management</h4>
          <div>
            <button
              className={`btn btn-sm me-2 ${activeForm === 'login' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setActiveForm('login')}
            >
              Login
            </button>
            <button
              className={`btn btn-sm ${activeForm === 'register' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setActiveForm('register')}
            >
              Register
            </button>
          </div>
        </div>
      </nav>

     

      <div style={{ flex: 1 }} className="d-flex justify-content-center align-items-center">
        <div style={{ width: '100%', maxWidth: '1000px' }}>
          {activeForm === 'login' ? <LoginForm inlineMode /> : <Registrationform inlineMode />}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
