
import React, { useState, useEffect } from 'react'; // Explicit import of React
import { Box, Button, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from 'state';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';

// Define the validation schemas for the registration and login forms
const registerSchema = yup.object().shape({
  firstName: yup.string().required('Bu alan boş bırakılamaz'),
  lastName: yup.string().required('Bu alan boş bırakılamaz'),
  email: yup.string().email('Geçersiz email adresi').required('Bu alan boş bırakılamaz'),
  password: yup.string().required('Bu alan boş bırakılamaz'),
  location: yup.string().required('Bu alan boş bırakılamaz'),
  occupation: yup.string().required('Bu alan boş bırakılamaz'),
  picture: yup.string().required('Profil resmi zorunludur'),
});

const loginSchema = yup.object().shape({
  email: yup.string().email('Geçersiz email adresi').required('Bu alan boş bırakılamaz'),
  password: yup.string().required('Bu alan boş bırakılamaz'),
});

// Define the initial form values for registration and login
const initialValuesRegister = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  picture: '',
  twitterLink: '',
  linkedinLink: '',
};

const initialValuesLogin = {
  email: '',
  password: '',
};

const Form = () => {
  const [pageType, setPageType] = useState('login');
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const isLogin = pageType === 'login';
  const isRegister = pageType === 'register';
  const [error, setError] = useState('');

  // Set a timeout to clear the error message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  // Registration function with form data handling
  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
    formData.append('picturePath', values.picture.name);

    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    onSubmitProps.resetForm();

    if (data) {
      setPageType('login');
    }
  };

  // Login function with error handling
  const login = async (values, onSubmitProps) => {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    onSubmitProps.resetForm();

    if (!data.msg) {
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );
      navigate('/home');
    } else {
      setError('E-posta veya şifre yanlış');
    }
  };

  // Handle form submission based on the page type
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) {
      await login(values, onSubmitProps);
    } else if (isRegister) {
      await register(values, onSubmitProps);
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              '& > div': {
                gridColumn: isNonMobile ? undefined : 'span 4',
              },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="Adınız"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: 'span 2' }}
                />
                <TextField
                  label="Soyadınız"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: 'span 2' }}
                />
                <TextField
                  label="Konumunuz"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  label="Mesleğiniz"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  label="Twitter Adresiniz"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.twitterLink}
                  name="twitterLink"
                  error={Boolean(touched.twitterLink) && Boolean(errors.twitterLink)}
                  helperText={touched.twitterLink && errors.twitterLink}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  label="LinkedIn Adresiniz"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.linkedinLink}
                  name="linkedinLink"
                  error={Boolean(touched.linkedinLink) && Boolean(errors.linkedinLink)}
                  helperText={touched.linkedinLink && errors.linkedinLink}
                  sx={{ gridColumn: 'span 4' }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) => setFieldValue('picture', acceptedFiles[0])}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                      >
                        <input {...getInputProps()} />
                        {values.picture ? (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        ) : (
                          <Typography>Buradan bir resim ekleyiniz</Typography>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: 'span 4' }}
            />
            <TextField
              label="Şifre"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: 'span 4' }}
            />
          </Box>

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: '2rem 0',
                p: '1rem',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}
            >
              {isLogin ? 'GİRİŞ YAP' : 'KAYIT OL'}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? 'register' : 'login');
                resetForm();
              }}
              sx={{
                textAlign: 'right',
                textDecoration: 'underline',
                color: palette.primary.main,
                '&:hover': {
                  cursor: 'pointer',
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin ? 'Hesabınız yok mu? Buradan kaydolun.' : 'Zaten hesabınız var mı? Giriş yapın.'}
            </Typography>
            {error && (
              <Typography variant="body2" color="error" sx={{ marginTop: '-1rem' }}>
                {error}
              </Typography>
            )}
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
