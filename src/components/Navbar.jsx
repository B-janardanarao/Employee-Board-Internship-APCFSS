

import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import './cssfiles/NavbarTop.css';


<Dropdown.Item className="dropdown-item-custom" href="/">
  <FaSignOutAlt style={{ marginRight: '8px' }} />
  Logout
</Dropdown.Item>


const NavbarTop = ({ user, wingName, roleName }) => {
  return (
    <>

      <Navbar className="navbar-custom" variant="dark" fixed='top' expand="lg">
        <Container>


          <Navbar.Brand className="navbar-brand-custom">
            Employee Management
          </Navbar.Brand>

          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                className="dropdown-toggle-custom circle-button"
                id="dropdown-custom"
              >
                <FaBars />


              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-custom">
                <Dropdown.Header className="dropdown-header-custom">
                  Welcome, <strong>{user?.name || 'Guest'}</strong>
                </Dropdown.Header>
                <Dropdown.ItemText className="user-info-text">
                  <strong>RoleName:</strong> {roleName || '-'}
                </Dropdown.ItemText>
                {/*   <Dropdown.ItemText className="user-info-text">
                  <strong>Wing:</strong> {wingName || '-'}
                </Dropdown.ItemText>

                <Dropdown.ItemText className="user-info-text">
                  <strong>Department:</strong> {user?.department || '-'}
                </Dropdown.ItemText>
                <Dropdown.Divider /> */}

                <Dropdown.Item className="dropdown-item-custom" href="/">
                  <FaSignOutAlt style={{ marginRight: '8px' }} />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarTop;




