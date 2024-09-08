'use client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Providers;
