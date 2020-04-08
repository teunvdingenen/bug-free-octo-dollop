import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import useInterval from './useInterval';

const url = 'todo';

const TICKER_QUERY = gql`
	query ticker($count: Int!) {
		ticker(count: $count) {
			value
			user {
				name
			}
		}
	}
`;

const NEXT_MUTATION = gql`
  mutation next($token: String!) {
    next(token: $token)
  }
`;

export default function Ticker({ match }) {
  const { c, t } = match.params;
  const {
    data, loading, error, refetch,
  } = useQuery(TICKER_QUERY, { variables: { count: parseInt(c) } });
  const [doNext] = useMutation(NEXT_MUTATION, { variables: { token: t } });

  useInterval(() => {
    doNext().then(({ data: { next } }) => {
      if (next) {
        refetch();
      }
    });
  }, [14000]);

  useInterval(() => {
    refetch();
  }, [2000]);

  const getTicker = (d) => {
    if (loading || d === undefined) {
      return '';
    }
    const { ticker } = d;
    if (ticker.length > 0) {
      return ticker.map((tick) => `${tick.user.name}: ${tick.value}`).join('  --  ');
    }
    return `Jouw berichtje hier? Ga naar: ${url}`;
  };

  return (
    <div>
      <h1>
        {getTicker(data)}
      </h1>
    </div>
  );
}
