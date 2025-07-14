/* import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './cssfiles/sidebar.css';

const Sidebar = ({ wingName, roleName, department }) => {

  const commonLinks = [
    { label: 'Home', path: '/dashboard/home' },

  ];



  const hrLinks = [
    { label: 'All Employees', path: '/dashboard/alldata' },
    { label: 'Add Employee', path: '/dashboard/addemployee' },
    { label: 'Profile', path: '/dashboard/profile' },
    { label: 'Settings', path: '/dashboard/password' },
    { label: 'LogOut', path: '/' },
  ];

  const empLinks = [
    { label: 'View/Edit', path: '/dashboard/alldata' },
    { label: 'Profile', path: '/dashboard/profile' },
    { label: 'Settings', path: '/dashboard/password' },
    { label: 'LogOut', path: '/' },
  ];


  const getLinks = () => {
    if (roleName === 'Hr') return [...commonLinks, ...hrLinks];

    if (roleName === 'Manager') return [...commonLinks, ...empLinks];

    if (roleName === 'Employee') return [...commonLinks, ...empLinks];
  };

  return (
    <div style={{
      width: '220px',
      height: '100vh',
      background: '#708090',
      color: 'white',
      position: 'fixed',
      top: '55px',
      left: 0,
      paddingTop: '56px'
    }}>
      <Nav className="flex-column p-3">
        {getLinks().map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              'nav-link text-white' + (isActive ? ' active-link' : '')
            }
            end
          >
            {link.label}
          </NavLink>

        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;



 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import './cssfiles/sidebar.css';
import * as FaIcons from 'react-icons/fa';

const Sidebar = ({ empId }) => {

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const getIconComponent = (iconName) => {
    const Icon = FaIcons[iconName];
    return Icon ? <Icon /> : null;
  };


  useEffect(() => {
    const token = localStorage.getItem('token');


    if (empId && token) {
      axios
        .get(`http://localhost:8080/api/roleBased-Sidebars/${empId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setMenuItems(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching sidebar menu:', err);
          setError('Failed to load menu');
          setLoading(false);
        });
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [empId]);

  if (loading) return <div className="sidebar">Loading...</div>;
  if (error) return <div className="sidebar error">{error}</div>;

  return (
    <div className="sidebar">
      <ul className="menu-list">
        {Array.isArray(menuItems) && menuItems.length > 0 ? (
          menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'menu-link active-link' : 'menu-link'
                }
                end
              >
                {getIconComponent(item.icon)}
                <span style={{ marginLeft: '10px' }}>{item.label}</span>
              </NavLink>
            </li>
          ))
        ) : (
          <li>No menu items found</li>
        )}
      </ul>
    </div>
  );

};

export default Sidebar;
