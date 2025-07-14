import React from 'react'
import Sidebar from './sidebar'
import NavbarTop from './Navbar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {



  const storedUser = JSON.parse(localStorage.getItem('user'));
  const wingName = storedUser?.wing;
  const roleName = storedUser?.roleName;
  const user = storedUser;

  const empId = storedUser?.empid;
  const department = user?.department;

  return (
    <div>

      <NavbarTop user={user} wingName={wingName} roleName={roleName} />

      <div style={{ display: 'flex' }}>
        {/*  <Sidebar wingName={wingName} department={department} roleName={roleName} /> */}
        <Sidebar empId={empId} />
        <div style={{ flex: 1, marginLeft: '220px', padding: '20px', marginTop: '50px', backgroundColor: '#F0FFFF', minHeight: '100vh' }}>
          <Outlet />

        </div>
      </div>

    </div>


  )
}

export default DashboardLayout