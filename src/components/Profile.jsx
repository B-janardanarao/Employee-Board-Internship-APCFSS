import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [details, setDetails] = useState(null);
  const [wings, setWings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const token = localStorage.getItem('token');



  useEffect(() => {
    fetch(`http://localhost:8080/api/details/${user.empid}`,
{
    headers: { Authorization: `Bearer ${token}` }})
      .then(res => res.json())
      .then(setDetails)
      .catch(console.error);

    fetch('http://localhost:8080/api/wings',
{
    headers: { Authorization: `Bearer ${token}` }})
      .then(res => res.json())
      .then(setWings)
      .catch(console.error);
  }, [user.empid]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : new Intl.DateTimeFormat('en-GB').format(date);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">My Profile</h3>
         
        {/* Profile Photo */}
        <div className="text-center mb-4">
          {details?.photo ? (
            <img
              src={details.photo}
              alt="Employee"
              className="rounded-circle border"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          ) : (
            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
              style={{ width: '150px', height: '150px' }}>
              No Photo
            </div>
          )}
        </div>

        {/* Basic Details */}
        {details && (
          <>
            <div className="row mb-4">
              <div className="col-md-6">
                <p><strong>Emp Id:</strong> {details.empid}</p>
                <p><strong>Name:</strong> {details.name}</p>
                <p><strong>Father's Name:</strong> {details.fatherName}</p>
                <p><strong>DOB:</strong> {formatDate(details.dateOfBirth)}</p>
                <p><strong>Gender:</strong> {details.gender}</p>
                <p><strong>Department:</strong> {details.department}</p>
              </div>
              <div className="col-md-6">
                <p><strong>RoleName:</strong> {details.role_name}</p>
                <p><strong>Wing:</strong> {details.wing}</p>
                <p><strong>Skills:</strong> {details.skills?.join(', ') || 'N/A'}</p>
                <p><strong>Joining Date:</strong> {formatDate(details.dateOfJoining)}</p>
                <p><strong>Total Experience:</strong> {details.totalExp}</p>
                 <p><strong>Address:</strong> {details.address}</p>
              </div>
            </div>

            {/* Experience Table */}
            <h5 className="mb-3">Experience Details</h5>
            {Array.isArray(details.experiences) && details.experiences.some(exp =>
              exp.location || exp.orgname || exp.fromDate || exp.toDate) ? (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>S.No</th>
                      <th>Location</th>
                      <th>Organization</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.experiences.map((exp, i) => (
                      (exp.location || exp.orgname || exp.fromDate || exp.toDate) && (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{exp.location}</td>
                          <td>{exp.orgname}</td>
                          <td>{formatDate(exp.fromDate)}</td>
                          <td>{formatDate(exp.toDate)}</td>
                          <td>{exp.duration}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No experience data available.</p>
            )}
          </>
        )}

        {!details && <p>Loading profile...</p>}
      </div>
    </div>
  );
};

export default Profile;
