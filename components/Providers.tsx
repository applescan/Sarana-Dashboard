'use client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  const client = new ApolloClient({
    uri: 'https://sarana-dashboard.vercel.app/api/graphql',
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Providers;
