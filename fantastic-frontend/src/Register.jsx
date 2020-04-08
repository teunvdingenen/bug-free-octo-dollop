import React from 'react';
import { TextField } from 'formik-material-ui';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import {
  Formik, Form, Field,
} from 'formik';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import useStyles from './useStyles';

const REGISTER = gql`
	mutation register($authInput: AuthInput!) {
		register(authInput: $authInput)
	}
`;

export default function Register({ location }) {
  const classes = useStyles();
  const [register] = useMutation(REGISTER);
  const [next, toNext] = React.useState(false);

  if (localStorage.getItem('fantastictoken') !== undefined
    && localStorage.getItem('fantastictoken') !== null) {
    return (
      <Redirect to={{
        pathname: '/bericht',
        state: { from: location },
      }}
      />
    );
  }

  return (
    <main className={classes.main}>
      {next}
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Voornaam
        </Typography>
        <Formik
          initialValues={{}}
          onSubmit={({
            name,
          }, { setSubmitting }) => {
            register({
              variables: {
                authInput: {
                  name,
                },
              },
            }).then(({ data: { register } }) => {
              localStorage.setItem('fantastictoken', register);
              setSubmitting(false);
              toNext(true);
            });
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(128).required('Required'),
          })}
          render={({
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit} className="form-container">
              <FormControl margin="normal" required fullWidth>
                <Field
                  type="text"
                  name="name"
                  label="Jouw naam"
                  component={TextField}
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Verder
              </Button>
            </Form>
          )}
        />
      </Paper>
    </main>
  );
}
