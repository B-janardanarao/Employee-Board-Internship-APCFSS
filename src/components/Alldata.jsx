
import React, { useState, useEffect } from 'react';
import { Button, Modal, Navbar, Container, Nav, ModalHeader } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';

import EditForm from './EditEmployeeData';



const Alldata = (wingName) => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [wings, setWings] = useState([]);
  const [editId, setEditId] = useState(null);
  const [statuses, setStatuses] = useState({});




  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};


  const token = localStorage.getItem('token');


  console.log("User from localStorage:", user);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };



  useEffect(() => {

    if (user.roleName === 'Hr' && data.length > 0) {

      const initialStatuses = {};
      data.forEach(emp => {
        initialStatuses[emp.empid] = true;
      });
      setStatuses(initialStatuses);
    }
  }, [data])



  useEffect(() => {

    fetch('http://localhost:8080/api/wings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setWings)
      .catch(console.error);


    const fetchData = async () => {
      try {
        let response;

        if (user.roleName === 'Hr') {
          response = await fetch('http://localhost:8080/api/names', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          setData(data);

        } else if (user.roleName === 'Manager') {

          if (user.wing) {
            response = await fetch(`http://localhost:8080/api/wing/${user.wing}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setData(data);


          }

        } else {
          // Other roles — show only own data
          response = await fetch(`http://localhost:8080/api/details/${user.empid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const singleData = await response.json();
          setData([singleData]);
        }

      } catch (err) {
        console.error('Error fetching employee data:', err);
      }
    };

    fetchData();

  }, [user.empid, user.roleName, user.wing, token]);


  const handleClose = () => {
    setShow(false);
    setDetails(null);
  };



  const handleShow = (empid) => {

    if (!empid) {
      alert("Employee ID is missing. Cannot view details.");
      return;
    }
    fetch(`http://localhost:8080/api/details/${empid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setDetails)
      .then(() => setShow(true))
      .catch(console.error);
  };

  const handleDelete = (empid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      fetch(`http://localhost:8080/api/delete/${empid}`, {
        method: 'DELETE',

        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.ok) {
            alert("Record deleted successfully!");
            setData(data.filter(item => item.empid !== empid));
          } else {
            alert("Failed to delete the record.");
          }
        })
        .catch((error) => {
          console.error("Delete error:", error);
          alert("An error occurred while deleting.");
        });
    }
  };





  return (
    <>


      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '50%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >

        </div>

        <table className="table table-bordered table-striped" style={{ maxWidth: '60%' }}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>All Details</th>

            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((employee, index) => (
                <tr key={employee.empid || index}>
                  <td>{index + 1}</td>
                  <td>{employee.name}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleShow(employee.empid)}>
                      👁 View
                    </Button>{' '}


                    {user.roleName !== 'Manager' && (
                      <Button variant="warning" onClick={() => setEditId(employee.empid)}>
                        Edit
                      </Button>
                    )}
                    {' '}



                    {/* 
                    {user.roleName === 'Hr' && (
                      <Button variant="danger" onClick={() => handleDelete(employee.empid)}>
                        Delete
                      </Button>
                    )} */}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No details available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Modal show={show} onHide={handleClose} size="lg" scrollable>
          <Modal.Header closeButton>
            <Modal.Title>

              <strong>{details?.name ? `  ${details.name.toUpperCase()}` : ''}</strong> Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {details ? (
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>

                  <p>
                    <strong>Employee Id:</strong> {details.empid}
                  </p>

                  <p>
                    <strong>Name:</strong> {details.name}
                  </p>
                  <p>
                    <strong>Father Name:</strong> {details.fatherName}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong> {details.dateOfBirth}
                  </p>
                  <p>
                    <strong>Age:</strong> {details.age}
                  </p>
                  <p>
                    <strong>Joining Date:</strong> {details.dateOfJoining}
                  </p>
                  <p>
                    <strong>Gender:</strong> {details.gender}
                  </p>
                  <p>
                    <strong>Skills:</strong> {details.skills?.join(', ')}
                  </p>



                  <p>
                    <strong>Wing:</strong>{' '}
                    {details.wing}
                  </p>
                  <p>
                    <strong>Department:</strong> {details.department}
                  </p>
                  <p>
                    <strong>Address:</strong> {details.address}
                  </p>

                  <div>
                    <strong>Experience:</strong>
                    {Array.isArray(details.experiences) &&
                      details.experiences.length > 0 &&
                      details.experiences.some(
                        (exp) => exp.location || exp.orgname || exp.fromDate || exp.toDate,
                      ) ? (
                      <table className="table table-bordered table-sm mt-2" style={{ borderWidth: "2px", borderColor: "#000" }}>
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Location</th>
                            <th>Organization Name</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {details.experiences.map(
                            (exp, i) =>
                              (exp.location || exp.orgname || exp.fromDate || exp.toDate || exp.duration) && (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>{exp.location}</td>
                                  <td>{exp.orgname}</td>
                                  <td>{formatDate(exp.fromDate)}</td>
                                  <td>{formatDate(exp.toDate)}</td>
                                  <td>{formatDate(exp.duration)}</td>
                                </tr>
                              ),
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ paddingLeft: '10px' }}>No experience</p>
                    )}
                  </div>

                  <p>
                    <strong>Total Experience:</strong> {details.totalExp}
                  </p>
                </div>

                <div style={{ minWidth: '160px', textAlign: 'center' }}>
                  <strong>Photo:</strong>
                  <br />
                  {details.photo ? (
                    <img
                      src={details.photo}
                      alt="Employee"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        marginTop: '10px',
                      }}
                    />
                  ) : (
                    <p>No photo available</p>
                  )}
                </div>
              </div>
            ) : (
              <p>Loading details...</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {editId && (
          <Modal show={true} onHide={() => setEditId(null)} size="xl" scrollable>
            <ModalHeader closeButton></ModalHeader>
            <Modal.Body>
              <EditForm
                empid={editId}
                token={token}
                onClose={() => {
                  setEditId(null);

                  if (user.roleName === 'Hr') {
                    fetch('http://localhost:8080/api/names', {
                      headers: { Authorization: `Bearer ${token}` }
                    })
                      .then(res => res.json())
                      .then(setData)
                      .catch(console.error);
                  } else {
                    fetch(`http://localhost:8080/api/details/${user.empid}`,
                      {
                        headers: { Authorization: `Bearer ${token}` }
                      }
                    )
                      .then(res => res.json())
                      .then(singleData => setData([singleData]))
                      .catch(console.error);
                  }
                }}
              />

            </Modal.Body>
          </Modal>
        )}

      </div>
    </>
  );
};

export default Alldata;
