import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Reset } from '../global/styles/reset';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Webare | Connecting Stories</title>
      </Head>
      <div className="app">
        <main>
          <Component {...pageProps} />
          <Reset />
        </main>
      </div>
    </>
  );
}

export default CustomApp;
