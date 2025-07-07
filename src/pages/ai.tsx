import { type NextPage } from 'next'
import Head from 'next/head'
import { AIAgentChat } from '../components/ai/AIAgentChat'
import { useBreakpointValue, Box } from '@chakra-ui/react'

const AIPage: NextPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <>
      <Head>
        <title>AI Assistant - Stellar DeFi Hub</title>
        <meta name="description" content="Your personal Stellar DeFi AI assistant" />
      </Head>

      <Box p={isMobile ? 0 : 6} h={isMobile ? "100vh" : "auto"}>
        <AIAgentChat />
      </Box>
    </>
  )
}

export default AIPage