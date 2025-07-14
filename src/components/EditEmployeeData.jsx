
import React, { useEffect, useState } from 'react';
import Registrationform from './Registrationform';
import axios from 'axios';

const EditForm = ({ empid, onClose, token }) => {
  const [initialData, setInitialData] = useState(null);

  const token1 = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/register/${empid}`, {
      headers: { Authorization: `Bearer ${token1}` }
    })
      .then(res => {
        if (!res.data) {
          alert("User not found");
          onClose();
          return;
        }

        console.log(res);

        const formatToInput = str => {
          const [d, m, y] = str.split("-");
          return `${y}-${m}-${d}`;
        };

        

        const data = {
          ...res.data,
          wing: res.data.wing || '',
          department: res.data.department || '',

          dateOfBirth: res.data.dateOfBirth ? formatToInput(res.data.dateOfBirth) : '',
          dateOfJoining: res.data.dateOfJoining ? formatToInput(res.data.dateOfJoining) : '',
          photo: res.data.photo || "",
          experiences: (res.data.experiences || []).map(exp => ({
            location: exp.location || '',
            orgname: exp.orgname || '',
            fromDate: exp.fromDate || '',
            toDate: exp.toDate || '',
          })),
          hasExperience: (res.data.experiences && res.data.experiences.length > 0) ? "yes" : "no",
        };

       

        setInitialData(data);
      })
      .catch(err => {
        console.error(err);
        alert("Error loading user");
        onClose();
      });
  }, [empid, onClose]);

  return (
    <>
      {initialData ? (
        <Registrationform
          initialData={initialData}
          isEditMode
          onSubmit={(updatedData) => {
            axios.put(`http://localhost:8080/api/update/${empid}`, updatedData, {
              headers: {
                Authorization: `Bearer ${token1}`,
              }
            })
              .then(() => {
                alert("Form updated successfully!");
                onClose();
              })
              .catch(err => {
                console.error(err);
                alert("Update failed!");
              });
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default EditForm;
