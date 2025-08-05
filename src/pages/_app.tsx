import React from 'react';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { HotToastConfig } from '@/components/layout/HotToastConfig';
import GlobalStyles from '@/styles/GlobalStyles';
import { ChakraProvider, DarkMode } from '@chakra-ui/react';
import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { Inconsolata } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';

import { StellarProvider } from '../components/web3/StellarProvider';

// Google Font(s) via `next/font`
const inconsolata = Inconsolata({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* TODO SEO */}
      <DefaultSeo
        // dangerouslySetAllPagesToNoFollow={!env.isProduction}
        // dangerouslySetAllPagesToNoIndex={!env.isProduction}
        defaultTitle="Syndicate - AI-Powered DeFi"
        titleTemplate="%s | Syndicate"
        description="Syndicate - Your intelligent AI assistant for Stellar DeFi. Get personalized recommendations, automated strategies, and seamless portfolio management."
        openGraph={{
          type: 'website',
          locale: 'en',
          // url: env.url,
          site_name: 'Syndicate',
          images: [
            // {
            //   url: `${env.url}/images/cover.jpg`, // TODO
            //   width: 1200,
            //   height: 675,
            // },
          ],
        }}
        twitter={{
          handle: '', // TODO
        }}
      />

      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        {/* Set Font Variables */}
        <style>{`
          :root {
            --font-inconsolata: ${inconsolata.style.fontFamily}, 'Inconsolata';
          }
        `}</style>
      </Head>

      {/* Suppress wallet extension console errors */}
      <Script
        id="suppress-wallet-errors"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const originalError = console.error;
              console.error = function(...args) {
                const message = args[0] && args[0].toString();
                if (message && (
                  message.includes('KeyRing is locked') ||
                  message.includes('pageProvider') ||
                  message.includes('starknet') ||
                  message.includes('injectedScript')
                )) {
                  return;
                }
                originalError.apply(console, args);
              };
            })();
          `,
        }}
      />

      <StellarProvider network="PUBLIC" appName="Syndicate">
        <CacheProvider value={cache}>
          <ChakraProvider>
            <DarkMode>
              <GlobalStyles />

              <BaseLayout>
                <Component {...pageProps} />
              </BaseLayout>

              <HotToastConfig />
            </DarkMode>
          </ChakraProvider>
        </CacheProvider>
      </StellarProvider>
    </>
  );
}

export default MyApp;
