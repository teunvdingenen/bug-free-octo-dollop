import React from 'react';
import { TextField } from 'formik-material-ui';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import {
  Formik, Form, Field,
} from 'formik';
import * as Yup from 'yup';
import { Redirect } from 'react-router-dom';
import useStyles from './useStyles';

const SAVE_TICKER = gql`
	mutation saveTicker($tickerInput: DefaultInput!) {
		saveTicker(tickerInput: $tickerInput)
	}
`;

export default function AddTicker() {
  const classes = useStyles();
  const [saveTicker] = useMutation(SAVE_TICKER);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
  });

  if (localStorage.getItem('fantastictoken') === null
    || localStorage.getItem('fantastictoken') === undefined) {
    return (
      <Redirect to={{
        pathname: '/',
        state: { from: location },
      }}
      />
    );
  }

  return (
    <main className={classes.main}>
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={4000}
        onClose={() => {
          setSnackbar({
            ...snackbar,
            open: false,
          });
        }}
        message={snackbar.message}
      />
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Berichtje versturen
        </Typography>
        <Formik
          initialValues={{
            value: '',
          }}
          onSubmit={({
            value,
          }, { resetForm }) => {
            saveTicker({
              variables: {
                tickerInput: {
                  value,
                },
              },
            }).then(({ data }) => {
              setSnackbar({
                open: true,
                message: `Je bent nr ${data.saveTicker} in de wachtrij`,
              });
              resetForm({});
            });
          }}
          validationSchema={Yup.object().shape({
            value: Yup.string().max(128).required('Required'),
          })}
          render={({
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit} className="form-container">
              <FormControl margin="normal" required fullWidth>
                <Field
                  component={TextField}
                  name="value"
                  type="text"
                  label="Bericht"
                />
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Versturen
              </Button>
            </Form>
          )}
        />
      </Paper>
    </main>
  );
}
