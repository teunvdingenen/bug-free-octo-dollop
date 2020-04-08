import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import useInterval from './useInterval';

const url = 'fantasticfitness.herokuapp.com';

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
  const { token, timer } = match.params;
  const {
    data, loading, error, refetch,
  } = useQuery(TICKER_QUERY, { variables: { count: 2 } });
  const [doNext] = useMutation(NEXT_MUTATION, { variables: { token } });

  useInterval(() => {
    doNext().then(refetch);
  }, [timer]);

  useInterval(() => {
    if (data && data.ticker && data.ticker.length < 1) {
      refetch();
    }
  }, [2000]);

  const getTicker = (d) => {
    if (loading || d === undefined) {
      return '';
    }
    const { ticker } = d;
    if (ticker.length > 0) {
      return `${ticker[0].user.name}: ${ticker[0].value}  --  `;
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
