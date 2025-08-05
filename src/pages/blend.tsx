import { type NextPage } from 'next';
import Head from 'next/head';
import { VStack, Container, Text } from '@chakra-ui/react';
import { BlendPools } from '../components/blend/BlendPools';

const BlendPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Blend Protocol | Stellar Bridge Hub</title>
        <meta name="description" content="Lend and borrow on Blend Protocol" />
      </Head>

      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold">
              Blend Protocol
            </Text>
            <Text fontSize="lg" color="gray.600">
              Lend, borrow, and earn yield on your Stellar assets
            </Text>
          </VStack>

          <BlendPools />
        </VStack>
      </Container>
    </>
  );
};

export default BlendPage;
