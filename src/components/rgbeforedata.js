/* import { useState, useEffect } from "react"
import { FormikProvider, Form, Field, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';
import { ErrorMessage } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef } from "react";
import dayjs from "dayjs";






const Registrationform = () => {

  const [experienceList, setExperienceList] = useState([{ id: Date.now() }]);
  const [wings, setWings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const fileInputRef = useRef(null);



const ExperienceValidation = () => {
  return Yup.array()
    .of(
      Yup.object().shape({
        location: Yup.string()
          .required("Location is required")
          .min(2, "Location must be at least 2 characters"),
        orgname: Yup.string()
          .required("Organization Name is required")
          .min(2, "Organization Name must be at least 2 characters"),
        from: Yup.string()
          .required("From Date must be in the format dd-MM-yyyy"),
        to: Yup.string()
          .required("To Date must be in the format dd-MM-yyyy"),
      })
    )
    .min(1, "At least one experience must be added");
};



  const validationSchema = Yup.lazy(values => {
  const baseSchema = {
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
      .min(3, "Name must be at least 3 characters")
      .max(22, "Name must be at most 22 characters"),
    fatherName: Yup.string()
      .required("Father Name is required")
      .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
      .min(3, "Father Name must be at least 3 characters")
      .max(22, "Father Name must be at most 22 characters"),
    dateOfBirth: Yup.string()
      .required("Date of Birth must be in the format dd-MM-yyyy"),
      
    age: Yup.number()
      .required("Age is required")
      .min(18, "Minimum age is 18")
      .max(50, "Maximum age is 50"),
    dateOfJoining: Yup.string()
      .required("Date of joining must be in the format dd-MM-yyyy"),
    gender: Yup.string().required("Gender is required"),
    skills: Yup.array().min(1, "Select at least one skill"),
    wing: Yup.string().required("Wing is required"),
    department: Yup.string().required("Department is required"),
    address: Yup.string().required("Address is required")
     .min(5, 'Address must be at least 5 characters')
     .max(50, 'Address cannot be more than 50 characters'),
    photo: Yup.string().required("Photo is required"),
    hasExperience: Yup.string().required("Please select Yse or No "),
  };

  if (values.hasExperience === "yes") {
    return Yup.object().shape({
      ...baseSchema,
      experiences: ExperienceValidation(),
    });
  }


  return Yup.object(baseSchema);
});

  




  const formik = useFormik({
    initialValues: {
      name: '',
      fatherName: '',
      dateOfBirth: '',
      age: '',
      dateOfJoining: '',
      gender: '',
      skills: [],
      wing: '',
      department: '',
      address: '',
      photo: "",
      location: '',
      orgname: '',
      from: '',
      to: '',
    
      hasExperience: '',
      
      

    },

    
    validationSchema: validationSchema,
  
onSubmit: (values, { resetForm }) => {
  
  const experiences = experienceList.map((_, index) => ({
    location: values[`location_${index}`],
    orgname: values[`orgname_${index}`],
    fromDate: dayjs(values[`from_${index}`]).format("DD-MM-YYYY"),
    toDate: dayjs(values[`to_${index}`]).format("DD-MM-YYYY"),
  }));

 
  const formattedValues = {
    ...values,
    dateOfBirth: dayjs(values.dateOfBirth).format("DD-MM-YYYY"),
    dateOfJoining: dayjs(values.dateOfJoining).format("DD-MM-YYYY"),
  };

  
  const totalExp = calculateTotalExperience(experienceList, values);

 
  const data = {
    ...formattedValues,
    experiences,
    totalExp,
  };

  console.log(data); 

  axios.post("http://localhost:8080/api/register", data)
    .then(res => {
      alert("Registered successfully");
      resetForm();
      setExperienceList([{ id: Date.now() }]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    })
    .catch(err => {
      console.error(err);
      alert("Something went wrong");
    });
},
  });

  const [skillsList, setSkillsList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/skills")
      .then(response => {
        setSkillsList(response.data);
      })
      .catch(error => {
        console.error("Error fetching skills", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/wings")
      .then(res => setWings(res.data))
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    if (formik.values.wing) {
      axios.get(`http://localhost:8080/api/departments?wing=${formik.values.wing}`)
        .then(res => setDepartments(res.data))
        .catch(err => console.error(err));
    } else {
      setDepartments([]);
    }
  }, [formik.values.wing]);



  const addExperience = () => {
    setExperienceList([...experienceList, { id: Date.now() }]);
  }

  const removeExperience = (id) => {
    setExperienceList((prevList) => {

      const newList = prevList.filter(exp => exp.id !== id);


      const newValues = { ...formik.values };


      prevList.forEach((_, index) => {
        delete newValues[`location_${index}`];
        delete newValues[`orgname_${index}`];
        delete newValues[`from_${index}`];
        delete newValues[`to_${index}`];
      });


      newList.forEach((exp, newIndex) => {
        const oldIndex = prevList.findIndex(e => e.id === exp.id);


        if (oldIndex !== -1) {
          newValues[`location_${newIndex}`] = formik.values[`location_${oldIndex}`] || '';
          newValues[`orgname_${newIndex}`] = formik.values[`orgname_${oldIndex}`] || '';
          newValues[`from_${newIndex}`] = formik.values[`from_${oldIndex}`] || '';
          newValues[`to_${newIndex}`] = formik.values[`to_${oldIndex}`] || '';
        }
      });


      formik.setValues(newValues);

      return newList;
    });
  };






  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };


  const navigate = useNavigate();

  const handleAllListClick = () => {
    navigate('/alldata');
  };

  const calculateTotalExperience = (experienceList, formikValues) => {
    let totalMonths = 0;

    experienceList.forEach((exp, index) => {
      const from = formikValues[`from_${index}`];
      const to = formikValues[`to_${index}`];

      const start = new Date(from);
      const end = new Date(to);

      if (!isNaN(start) && !isNaN(end)) {
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        totalMonths += years * 12 + months;
      }
    });

    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    return `${totalYears} yr ${remainingMonths} mon`;
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit} style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
          <table cellPadding="10" cellSpacing="0" >

            <tbody>
              <tr><td><h1>Registration Form</h1></td></tr>
              <tr>
                <td><label>Name:</label></td>
                <td><Field type="text" name="name" />
                  <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                </td>

              </tr>
              <tr>
                <td><label>Father Name:</label></td>
                <td><Field type="text" name="fatherName" />
                  <ErrorMessage name="fatherName" component="div" style={{ color: 'red' }} /></td>
              </tr>
              <tr>
                <td><label>Date of Birth:</label></td>
                <td>
                  <Field type="date" name="dateOfBirth" onChange={(e) => {
                    const dob = e.target.value;
                    formik.setFieldValue('dateOfBirth', dob);
                    const age = calculateAge(dob);
                    formik.setFieldValue('age', age);
                  }}
                  />
                  <ErrorMessage name="dateOfBirth" component="div" style={{ color: 'red' }} />
                  <label>      Age:</label>
                  <Field type="text" name="age" disabled />
                </td>
              </tr>
              <tr>
                <td><label>Date Of Joining:</label></td>
                <td><Field type="date" name="dateOfJoining" />
                  <ErrorMessage name="dateOfJoining" component="div" style={{ color: 'red' }} />
                </td>
              </tr>
              <tr>
                <td><label>Gender:</label>

                </td>
                <td>
                  <label><Field type="radio" name="gender" value="Male" /> Male</label>
                  <label><Field type="radio" name="gender" value="Female" />  Female</label>
                  <label><Field type="radio" name="gender" value="Other" /> Other</label>
                  <ErrorMessage name="gender" component="div" style={{ color: 'red' }} />
                </td>
              </tr>
              <tr>
                <td><label>Skills:</label></td>

                <td>
                  {skillsList.map(skill => (
                    <label
                      key={skill.id}
                      style={{ display: 'inline-block', width: '33.33%' }}>
                      <Field type="checkbox" name="skills" value={skill.name} />
                      {' '}{skill.name}
                    </label>
                  ))}

                  <ErrorMessage name="skills" component="div" style={{ color: 'red' }} />
                </td>



              </tr>
              <tr>
                <td><label>Wing:</label></td>
                <td>
                  <Field as="select" name="wing">
                    <option value="">---Select---</option>
                    {wings.map((wing) => (
                      <option key={wing.code} value={wing.code}>{wing.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="wing" component="div" style={{ color: 'red' }} />
                </td>
              </tr>
              <tr>
                <td><label>Department:</label></td>
                <td>
                  <Field as="select" name="department">
                    <option value="">---Select---</option>
                    {departments.map((dept) => (
                      <option key={dept.code} value={dept.name}>{dept.name}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="department" component="div" style={{ color: 'red' }} />
                </td>
              </tr>
              <tr>
                <td><label>Address:</label></td>
                <td>
                  <Field as="textarea" name="address" rows="3" cols="40" />
                  <ErrorMessage name="address" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              <tr>
                <td>
                  <lable>Upload Photo:</lable></td>
                <td>
                  <input
                    name="photo"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          formik.setFieldValue("photo", reader.result);

                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <ErrorMessage name="photo" component="div" style={{ color: 'red' }} />
                </td>

              </tr>


              <tr>
                <td colSpan="2">
                  <label><strong>Do you have previous work experience?</strong></label><br />
                  <label>
                    <Field type="radio" name="hasExperience" value="yes" />
                    Yes
                  </label>
                  <label style={{ marginLeft: '10px' }}>
                    <Field type="radio" name="hasExperience" value="no" />
                    No
                  </label>
                  <ErrorMessage name="hasExperience" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              {formik.values.hasExperience === "yes" && (
                <tr>
                  <td colSpan="2">
                    <table style={{ width: '100%', marginTop: '10px', border: '1px solid #ccc' }}>
                      <thead>
                        <tr>
                          <th colSpan="5" style={{ textAlign: 'left' }}>Previous Work Experience</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experienceList.map((exp, index) => (
                          <tr key={exp.id}>
                            <td style={{ paddingRight: '10px' }}>
                              <label>Location:</label><br />
                              <Field name={`location_${index}`} />
                              <ErrorMessage name={`location_${index}`} component="div" style={{ color: 'red' }} />
                            </td>

                            <td style={{ paddingRight: '10px' }}>
                              <label>Organization Name:</label><br />
                              <Field name={`orgname_${index}`} />
                              <ErrorMessage name={`orgname_${index}`} component="div" style={{ color: 'red' }} />
                            </td>

                            <td style={{ paddingRight: '10px' }}>
                              <label>From:</label><br />
                              <Field type="date" name={`from_${index}`} />
                              <ErrorMessage name={`from_${index}`} component="div" style={{ color: 'red' }} />
                            </td>

                            <td style={{ paddingRight: '10px' }}>
                              <label>To:</label><br />
                              <Field type="date" name={`to_${index}`} />
                              <ErrorMessage name={`to_${index}`} component="div" style={{ color: 'red' }} />

                            </td>

                            



                            {experienceList.length > 1 && (
                              <td>
                                <button type="button" onClick={() => removeExperience(exp.id)}>−</button>
                              </td>
                            )}
                          </tr>
                        ))}

                        <tr>
                          <td colSpan="5">
                            <label>Total Experience:</label><br />
                            <input
                              type="text"
                              value={calculateTotalExperience(experienceList, formik.values)}
                              
                              disabled
                              style={{ fontSize: '16px', color: 'black', width: '150px' }}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td colSpan="5">
                            <button type="button" onClick={addExperience} disabled={experienceList.length >= 5}>+ Add Experience</button>
                            {experienceList.length >= 5 && <p style={{ color: 'red' }}>Maximum 5 experiences allowed.</p>}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
     
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>
                  <button type="submit" style={{ marginRight: '10px' }} className="btn btn-primary">Submit</button>
                  <button type="button" onClick={() => {
                    formik.resetForm();
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    setExperienceList([{ id: Date.now() }]);
                  }} style={{ marginRight: '10px' }} className="btn btn-primary">Reset</button>
                  <button type="button" onClick={handleAllListClick} className="btn btn-primary" style={{ float: 'right' }}>All List</button>
                </td>
              </tr>

            </tbody>
          </table>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default Registrationform;
 */