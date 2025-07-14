import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Container, Card, Button, Form as RBForm, Spinner,
} from 'react-bootstrap';

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const validationSchema = Yup.object({
        empid: Yup.string().required('Employee ID is required'),
        password: Yup.string().required('Password is required'),
    });


    const formik = {
        initialValues: {
            empid: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const response = await axios.post('http://localhost:8080/api/login', {
                    empid: values.empid,
                    password: values.password,
                });
                const userData = response.data;



                const user = {
                    empid: userData.empid,
                    name: userData.name,
                    wing: userData.wingName,
                    department: userData.department,

                    roleName: userData.roleName,
                    roleId: userData.roleId

                };

                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(user));


                navigate('/dashboard/home');


            } catch (error) {
                if (error.response && error.response.status === 401) {

                    setFieldError('password', 'Invalid credentials');
                } else {
                    alert('Something went wrong. Please try again later.');
                }
            } finally {
                setSubmitting(false);
            }
        },
    };


    useEffect(() => {
        if (location.pathname === "/") {
            localStorage.removeItem("token");

            const handlePopState = (e) => {
                window.history.pushState(null, '', window.location.href);
            };

            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [location.pathname]);


    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center min-vh-100"
            style={{
                background: 'linear-gradient(135deg, #1f3b73, #2a5298)',
            }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    backgroundColor: '#ffffff',
                }}
                className="p-4"
            >
                <h3 className="text-center mb-4 text-primary fw-bold">Welcome Back</h3>

                <Formik {...formik}>
                    {(formikProps) => (
                        <FormikProvider value={formikProps}>
                            <Form noValidate>
                                <RBForm.Group className="mb-3" controlId="id">
                                    <RBForm.Label className="fw-semibold">Employee ID</RBForm.Label>
                                    <Field
                                        type="text"
                                        name="empid"
                                        as={RBForm.Control}
                                        isInvalid={formikProps.touched.id && formikProps.errors.id}
                                        placeholder="enter your empId"
                                    />
                                    <ErrorMessage name="empid" component={RBForm.Control.Feedback} type="invalid" />
                                </RBForm.Group>

                                <RBForm.Group className="mb-3" controlId="password">
                                    <RBForm.Label className="fw-semibold">Password</RBForm.Label>
                                    <Field
                                        type="password"
                                        name="password"
                                        as={RBForm.Control}
                                        placeholder="enter your password"
                                        isInvalid={formikProps.touched.password && formikProps.errors.password}
                                    />
                                    <ErrorMessage name="password" component={RBForm.Control.Feedback} type="invalid" />
                                </RBForm.Group>

                                <div className="d-grid">
                                    <Button
                                        type="submit"
                                        disabled={formikProps.isSubmitting}
                                        className="btn btn-primary fw-semibold"
                                        style={{ backgroundColor: '#1f3b73', borderColor: '#1f3b73' }}
                                    >
                                        {formikProps.isSubmitting ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Logging in...
                                            </>
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </FormikProvider>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default LoginForm;
