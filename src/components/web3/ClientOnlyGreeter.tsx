import { useEffect, useState } from 'react'
import { GreeterContractInteractions } from './GreeterContractInteractions'
import { ChainInfo } from './ChainInfo'
import { Text, Box } from '@chakra-ui/react'

// Client-side only wrapper for Soroban components
export const ClientOnlyGreeter = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Box textAlign="center" p={8}>
        <Text color="gray.500">Loading Soroban components...</Text>
      </Box>
    )
  }

  return (
    <div tw="mt-20 flex w-full flex-wrap items-start justify-center gap-4">
      <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center" color="gray.500" tw="w-full">
        Original Soroban Contract Demo
      </Text>
      
      {/* Chain Metadata Information */}
      <ChainInfo />

      {/* Greeter Read/Write Contract Interactions */}
      <GreeterContractInteractions />
    </div>
  )
}