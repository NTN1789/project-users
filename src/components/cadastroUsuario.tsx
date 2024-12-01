import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Typography, FormControlLabel, Checkbox, Grid, MenuItem, Breadcrumbs, Link } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [userData, setUserData] = useState<any>(null); 
  const apiUrlBase = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isEditing) {
      axios.get(`${apiUrlBase}/usuarios/${id}`)
        .then(response => {
          const user = response.data;
          setUserData(user); 
        })
        .catch(error => {
          console.error('Erro ao carregar usuário:', error);
          alert('Erro ao carregar dados do usuário. Por favor, tente novamente.');
          navigate('/');
        });
    }
  }, [isEditing, id, navigate, apiUrlBase]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    phone: Yup.string().required('Telefone é obrigatório'),
    organization: Yup.string().required('Órgão/Secretaria é obrigatório'),
    userType: Yup.string().required('Tipo de usuário é obrigatório'),
    permissions: Yup.object({
      permission1: Yup.boolean(),
      permission2: Yup.boolean(),
      permission3: Yup.boolean(),
    }).required(),
  });

  const handleSubmit = async (values: any) => {
    const { name, email, phone, organization, userType, permissions } = values;

    const userData = {
      name,
      email,
      phone,
      organization,
      userType,
      permissions,
    };

    const apiUrl = isEditing
      ? `${apiUrlBase}/editar-user/${id}`
      : `${apiUrlBase}/cadastrar-usuario`;

    try {
      if (isEditing) {
        await axios.put(apiUrl, userData);
        alert('Usuário atualizado com sucesso!');
      } else {
        await axios.post(apiUrl, userData);
        alert('Usuário criado com sucesso!');
      }
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar o usuário:', error);
      alert('Erro ao salvar os dados. Verifique as informações e tente novamente.');
    }
  };

  if (!userData && isEditing) {
    return <div>Carregando...</div>; 
  }

  return (
    <Paper sx={{ padding: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" onClick={() => navigate('/')}>
          Usuários
        </Link>
        <Typography color="textPrimary">
          {isEditing ? 'Editar usuário' : 'Criar novo usuário'}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
        {isEditing ? 'Editar usuário' : 'Criar novo usuário'}
      </Typography>

      <Formik
        initialValues={{
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          organization: userData?.organization || '',
          userType: userData?.userType || '',
          permissions: userData?.permissions || { permission1: false, permission2: false, permission3: false },
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Field
                  as={TextField}
                  label="Nome"
                  variant="standard"
                  fullWidth
                  required
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={<ErrorMessage name="name" />}
                  error={Boolean(values.name && false)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Field
                  as={TextField}
                  label="E-mail"
                  variant="standard"
                  fullWidth
                  required
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={<ErrorMessage name="email" />}
                  error={Boolean(values.email && false)}
                />
              </Grid>
              <Grid item xs={10} md={4}>
                <Field
                  as={TextField}
                  label="Telefone"
                  variant="standard"
                  fullWidth
                  required
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={<ErrorMessage name="phone" />}
                  error={Boolean(values.phone && false)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label="Tipo de usuário"
                  variant="standard"
                  select
                  fullWidth
                  name="userType"
                  value={values.userType}
                  onChange={handleChange}
                >
                  <MenuItem value="administrador">Administrador</MenuItem>
                  <MenuItem value="usuario">Usuário Município</MenuItem>
                  <MenuItem value="outros">Outros</MenuItem>
                </Field>
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label="Órgão/Secretaria"
                  variant="standard"
                  fullWidth
                  required
                  name="organization"
                  value={values.organization}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={<ErrorMessage name="organization" />}
                  error={Boolean(values.organization && false)}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
              Permissões de acesso
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Typography variant="subtitle1" sx={{ mt: 4, fontWeight: 'bold' }}>
                  Permissões pai 1
                </Typography>
                <FormControlLabel
                  control={<Checkbox checked={values.permissions.permission1} onChange={(e) => setFieldValue('permissions.permission1', e.target.checked)} />}
                  label="Permissão filha 1"
                />
                <FormControlLabel
                  control={<Checkbox checked={values.permissions.permission2} onChange={(e) => setFieldValue('permissions.permission2', e.target.checked)} />}
                  label="Permissão filha 2"
                />
              </Grid>
              <Grid item xs={6} sx={{ fontWeight: 'bold' }}>
                <Typography variant="subtitle1" sx={{ mt: 4, fontWeight: 'bold' }}>
                  Permissões pai 2
                </Typography>
                <FormControlLabel
                  control={<Checkbox checked={values.permissions.permission3} onChange={(e) => setFieldValue('permissions.permission3', e.target.checked)} />}
                  label="Permissão filha 3"
                />
              </Grid>
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
              <Button variant="outlined" onClick={() => navigate('/')}>Voltar</Button>
              <Button variant="contained" color="primary" type="submit">Salvar</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default UserForm;








