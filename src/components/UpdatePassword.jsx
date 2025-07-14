import React, { useState } from 'react';
import { Field, Form, FormikProvider, useFormik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UpdatePassword = () => {
    const token = localStorage.getItem('token');

    console.log('Token:', token);

    const userString = localStorage.getItem('user');

    const user = userString ? JSON.parse(userString) : null;
    const userId = user ? user.empid : null;
    console.log("User:", user);
    console.log("userId:", userId);

    console.log(localStorage.getItem('user'));



    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRenewPassword, setShowRenewPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            newpassword: '',
            renewpassword: '',
        },
        validationSchema: Yup.object({
            newpassword: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('New Password is required'),
            renewpassword: Yup.string()
                .oneOf([Yup.ref('newpassword'), null], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await axios.put(
                    'http://localhost:8080/api/password',
                    {
                        empid: userId,
                        password: values.newpassword,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                alert('Password changed successfully!');
                resetForm();
            } catch (error) {
                console.error('Password update failed:', error);
                alert('Error updating password. Please try again.');
            }
        },
    });

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto' }}>
            <div
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '30px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                }}
            >
                <h4 style={{ marginBottom: '20px', textAlign: 'center' }}>Change Password</h4>

                <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>

                        <div style={{ marginBottom: '15px', position: 'relative' }}>
                            <label>New Password:</label>
                            <Field
                                type={showNewPassword ? 'text' : 'password'}
                                name="newpassword"
                                className="form-control"


                            />
                            <span
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{
                                    position: 'absolute',

                                    top: '50%',
                                    right: '10px',
                                    transform: 'translateY(-50%)',


                                    top: '38px',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: '#555',
                                }}
                                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setShowNewPassword(!showNewPassword);
                                    }
                                }}
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            <ErrorMessage name="newpassword" component="div" className="text-danger" />
                        </div>

                        <div style={{ marginBottom: '15px', position: 'relative' }}>
                            <label>Re-enter New Password:</label>
                            <Field
                                type={showRenewPassword ? 'text' : 'password'}
                                name="renewpassword"
                                className="form-control"
                            />
                            <span
                                onClick={() => setShowRenewPassword(!showRenewPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '38px',
                                    transform: 'translateY(-50%)',

                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: '#555',
                                }}
                                aria-label={showRenewPassword ? 'Hide password' : 'Show password'}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setShowRenewPassword(!showRenewPassword);
                                    }
                                }}
                            >
                                {showRenewPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            <ErrorMessage name="renewpassword" component="div" className="text-danger" />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button type="submit" className="btn btn-primary px-4">
                                Update Password
                            </button>
                        </div>
                    </Form>
                </FormikProvider>
            </div>
        </div>
    );
};

export default UpdatePassword;
