import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import ApolloClient from 'apollo-client';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import AddTicker from './AddTicker';
import Register from './Register';
import Ticker from './Ticker';

const cache = new InMemoryCache();

cache.writeData({ data: { api: { __typename: 'Api', id: 0, name: '' } } });

const request = async (operation) => {
  const token = localStorage.getItem('fantastictoken');
  operation.setContext({
    headers: {
      authorization: token || '',
    },
  });
};

const requestLink = new ApolloLink((operation, forward) => new Observable((observer) => {
  let handle;
  Promise.resolve(operation)
    .then((oper) => request(oper))
    .then(() => {
      handle = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      });
    })
    .catch(observer.error.bind(observer));

  return () => {
    if (handle) {
      handle.unsubscribe();
    }
  };
}));

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach((error) => {
          console.log(error.message);
        });
      }
      if (networkError) {
        // localStorage.clear();
      }
    }),
    requestLink,
    new HttpLink({
      uri: '/graphql',
    }),
  ]),
  cache,
});

ReactDOM.render((
  // eslint-disable-next-line react/jsx-filename-extension
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Switch>
        <Route path="/bericht" component={AddTicker}/>
        <Route path="/ticker/:c/:t" component={Ticker}/>
        <Route exact path="/" component={Register}/>
      </Switch>
    </BrowserRouter>
  </ApolloProvider>
), document.getElementById('root'));
