
import { useState, useEffect, useRef } from "react";
import { FormikProvider, Form, Field, useFormik, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from "dayjs";

const Registrationform = ({ initialData = null, isEditMode = false, onSubmit }) => {
  const [roles, setRoles] = useState([]);
  const [wings, setWings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const fileInputRef = useRef(null);


  const token = localStorage.getItem('token');




  const experienceValidation = Yup.array().of(
    Yup.object().shape({
      location: Yup.string()
        .required("Required Field")
        .min(3, "Location must be at least 3 characters"),
      orgname: Yup.string()
        .required("Required Field")
        .min(3, "Organization Name must be at least 3 characters"),
      fromDate: Yup.string()
        .required("Required Field"),
      toDate: Yup.string()
        .required("Required Field"),
    })
  ).min(1, "At least one experience must be added");

  const validationSchema = Yup.lazy(values => {
    const baseSchema = {
      empid: Yup.string()
        .required("Name is required"),
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
        .required("Date of Birth is required")
        .test(
          "age-range",
          "Age must be between 18 and 60",
          function (value) {
            if (!value) return false;
            const birthDate = dayjs(value, "YYYY-MM-DD");
            const today = dayjs();
            const age = today.diff(birthDate, 'year');
            return age >= 18 && age <= 60;
          }
        ),
      age: Yup.number()
        .required("Age is required"),

      dateOfJoining: Yup.string()
        .required("Date of joining is required"),
      gender: Yup.string().required("Gender is required"),
      skills: Yup.array().min(1, "Select at least one skill"),
      role_id: Yup.string().required("Role is required"),
      wing: Yup.string().required("Wing is required"),
      department: Yup.string().required("Department is required"),
      address: Yup.string()
        .required("Address is required")
        .min(5, 'Address must be at least 5 characters')
        .max(100, 'Address cannot be more than 100 characters'),
      photo: Yup.string().required("Photo is required"),
      hasExperience: Yup.string().required("Please select Yes or No"),
    };

    if (values.hasExperience === "yes") {
      return Yup.object().shape({
        ...baseSchema,
        experiences: experienceValidation,
      });
    }



    return Yup.object().shape(baseSchema);
  });

  const formik = useFormik({
    initialValues: initialData || {
      name: '',
      empid: '',
      fatherName: '',
      dateOfBirth: '',
      age: '',
      dateOfJoining: '',
      gender: '',
      skills: [],
      role_id: '',

      wing: '',
      department: '',
      address: '',
      photo: "",
      hasExperience: '',
      totalExp: '',
      experiences: [],

    },
    enableReinitialize: true,
    validationSchema,


    onSubmit: (values, { resetForm }) => {

      const formattedValues = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format("DD-MM-YYYY"),
        dateOfJoining: dayjs(values.dateOfJoining).format("DD-MM-YYYY"),
        experiences: values.hasExperience === "yes"
          ? values.experiences.map(exp => ({
            ...exp,
            duration: calculateDuration(exp.fromDate, exp.toDate),
          }))
          : [],
        totalExp: calculateTotalExperience(values.experiences),
      };
      if (onSubmit) {
        onSubmit(formattedValues, resetForm);
      } else {
        axios.post("http://localhost:8080/api/register", formattedValues, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            alert("Registered successfully");
            resetForm();
            if (fileInputRef.current) fileInputRef.current.value = "";
          })
          .catch(err => {
            if (err.response && err.response.status === 400) {
              console.error("Validation Errors from Backend:", err.response.data);
              alert("Validation Error: " + err.response.data.join("\n"));
            } else {
              console.error("Unexpected Error:", err);
              alert("Something went wrong. Check the console.");
            }
          });
      }

    },
  });


  console.log("Initial Data:", initialData);

  useEffect(() => {
    axios.get("http://localhost:8080/api/roles",
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {

        setRoles(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch roles:", err);
      });
  }, []);


  useEffect(() => {
    axios.get("http://localhost:8080/api/skills", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSkillsList(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/wings", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setWings(res.data))
      .catch(err => console.error(err));
  }, []);

  /* useEffect(() => {
    if (formik.values.wing) {
      axios.get(`http://localhost:8080/api/departments?wing=${formik.values.wing}`)
        .then(res => setDepartments(res.data))
        .catch(err => console.error(err));
    } else {
      setDepartments([]);
      formik.setFieldValue('department', '');
    }
  }, [formik.values.wing]);
 
  useEffect(() => {
    if (formik.values.hasExperience === "yes" && formik.values.experiences.length === 0) {
      formik.setFieldValue('experiences', [{ location: '', orgname: '', fromDate: '', toDate: '' }]);
    }
    if (formik.values.hasExperience === "no") {
      formik.setFieldValue('experiences', []);
    }
  }, [formik.values.hasExperience]);
 */

  const { values, setFieldValue } = formik;

  useEffect(() => {
    if (values.wing) {
      axios.get(`http://localhost:8080/api/departments?wing=${values.wing}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setDepartments(res.data))
        .catch(err => console.error(err));
    } else {
      setDepartments([]);
      setFieldValue('department', '');
    }
  }, [values.wing, setFieldValue]);


  useEffect(() => {
    if (values.hasExperience === "yes" && values.experiences.length === 0) {
      setFieldValue('experiences', [{ location: '', orgname: '', fromDate: '', toDate: '', duration: '' }]);
    }
    if (values.hasExperience === "no") {
      setFieldValue('experiences', []);
    }
  }, [values.hasExperience, values.experiences.length, setFieldValue]);


  const addExperience = () => {
    formik.setFieldValue('experiences', [
      ...formik.values.experiences,
      { location: '', orgname: '', fromDate: '', toDate: '', duration: '' }
    ]);
  };

  const removeExperience = (index) => {
    const newExperiences = [...formik.values.experiences];
    newExperiences.splice(index, 1);
    formik.setFieldValue('experiences', newExperiences);
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateTotalExperience = (experiences) => {
    if (!experiences || experiences.length === 0) return "0 yr 0 mon";
    let totalMonths = 0;

    experiences.forEach(({ fromDate, toDate }) => {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      if (!isNaN(start) && !isNaN(end) && end >= start) {
        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        totalMonths += years * 12 + months;
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return `${years} yr ${months} mon`;
  };


  const calculateDuration = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "0 yr 0 mon";
    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start) || isNaN(end) || end < start) return "0 yr 0 mon";

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} yr ${months} mon`;
  };



  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit} style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
          <table cellPadding="10" cellSpacing="0" >
            <tbody>
              <tr><h2>{isEditMode ? "Edit Form" : "Employee Registration Form"}</h2></tr>


              <tr>
                <td><label>Employee Id:</label></td>
                <td>
                  <Field type="text" name="empid"
                    disabled={isEditMode}
                    style={{ backgroundColor: isEditMode ? '#e9ecef' : 'white' }}
                  />
                  <ErrorMessage name="empid" component="div" style={{ color: 'red' }} />
                </td>
              </tr>


              <tr>
                <td><label>Name:</label></td>
                <td>
                  <Field type="text" name="name" />
                  <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              <tr>
                <td><label>Father Name:</label></td>
                <td>
                  <Field type="text" name="fatherName" />
                  <ErrorMessage name="fatherName" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              <tr>
                <td><label>Date of Birth:</label></td>
                <td>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    onChange={e => {
                      const dob = e.target.value;
                      formik.setFieldValue('dateOfBirth', dob);
                      formik.setFieldValue('age', calculateAge(dob));
                    }}
                  />{' '}
                  <ErrorMessage name="dateOfBirth" component="div" style={{ color: 'red' }} />
                  <label> Age: </label>
                  <Field type="text" name="age" disabled />
                </td>
              </tr>

              <tr>
                <td><label>Date Of Joining:</label></td>
                <td>
                  <Field type="date" name="dateOfJoining" />
                  <ErrorMessage name="dateOfJoining" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              <tr>
                <td><label>Gender:</label></td>
                <td>
                  <label><Field type="radio" name="gender" value="Male" /> Male</label>
                  <label style={{ marginLeft: '10px' }}><Field type="radio" name="gender" value="Female" /> Female</label>
                  <label style={{ marginLeft: '10px' }}><Field type="radio" name="gender" value="Other" /> Other</label>
                  <ErrorMessage name="gender" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              <tr>
                <td><label>Skills:</label></td>
                <td>
                  {skillsList.map(skill => (
                    <label key={skill.id} style={{ display: 'inline-block', width: '33.33%' }}>
                      <Field type="checkbox" name="skills" value={skill.name} />
                      {' '}{skill.name}
                    </label>
                  ))}
                  <ErrorMessage name="skills" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              <tr>

                <td><label>Role:</label></td>
                <td>
                  <Field as="select" name="role_id"

                    style={{ backgroundColor: isEditMode ? '#e9ecef' : 'white' }}
                  >
                    <option value="">---Select---</option>
                    {roles.map(role => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="role_id" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              <tr>
                <td><label>Wing:</label></td>
                <td>
                  <Field as="select" name="wing">
                    <option value="">---Select---</option>
                    {wings.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}

                  </Field>
                  <ErrorMessage name="wing" component="div" style={{ color: 'red' }} />
                </td>
              </tr>

              <tr>
                <td><label>Department:</label></td>
                <td>
                  <Field as="select" name="department" disabled={!departments.length}>
                    <option value="">---Select---</option>
                    {departments.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
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
                <td><label>Upload Photo:</label></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.currentTarget.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => formik.setFieldValue("photo", reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    {formik.values.photo && (
                      <img
                        src={formik.values.photo}
                        alt="Profile Preview"
                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                  </div>

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
                          <th></th>
                          <th>Location</th>
                          <th>Organization Name</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formik.values.experiences.map((exp, index) => (
                          <tr key={index}>
                            <td>{index + 1})</td>
                            <td>
                              <Field name={`experiences[${index}].location`} />
                              <ErrorMessage name={`experiences[${index}].location`} component="div" style={{ color: 'red' }} />
                            </td>
                            <td>
                              <Field name={`experiences[${index}].orgname`} />
                              <ErrorMessage name={`experiences[${index}].orgname`} component="div" style={{ color: 'red' }} />
                            </td>
                            <td>
                              <Field type="date" name={`experiences[${index}].fromDate`} />
                              <ErrorMessage name={`experiences[${index}].fromDate`} component="div" style={{ color: 'red' }} />
                            </td>



                            <td>
                              <Field type="date" name={`experiences[${index}].toDate`} />
                              <ErrorMessage name={`experiences[${index}].toDate`} component="div" style={{ color: 'red' }} />
                            </td>

                            <td>
                              <td>
                                <input
                                  type="text"
                                  name={`experiences[${index}].duration`}
                                  value={calculateDuration(exp.fromDate, exp.toDate)}
                                  disabled
                                  style={{
                                    fontSize: '14px',
                                    color: 'black',
                                    width: '120px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#f5f5f5',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                  }}
                                />

                              </td>
                            </td>
                            <td>
                              {formik.values.experiences.length > 1 && (
                                <button type="button" onClick={() => removeExperience(index)}>−</button>
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="5">
                            <label><b>Total Experience:</b></label>
                            <input
                              type="text"
                              name="totalExp"
                              value={calculateTotalExperience(formik.values.experiences)}
                              disabled
                              style={{ fontSize: '16px', color: 'black', width: '150px', marginLeft: '10px' }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="5">
                            <button type="button" onClick={addExperience} disabled={formik.values.experiences.length >= 5}>+ Add Experience</button>
                            {formik.values.experiences.length >= 5 && <p style={{ color: 'red' }}>Maximum 5 experiences allowed.</p>}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}

              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>
                  <button type="submit" className="btn btn-primary me-2">
                    {isEditMode ? 'Update' : 'Submit'}
                  </button>

                  {!isEditMode && (
                    <>
                      <button type="button" onClick={() => {
                        formik.resetForm();
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }

                      }} style={{ marginRight: '10px' }} className="btn btn-primary">Reset</button>



                    </>
                  )}



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






















