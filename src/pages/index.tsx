import { CenterBody } from '@/components/layout/CenterBody'
import { MobileDashboard } from '@/components/mobile/MobileDashboard'
import { AIOnboarding } from '@/components/onboarding/AIOnboarding'
import { useOnboarding } from '@/hooks/useOnboarding'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useBreakpointValue } from '@chakra-ui/react'
import { Box, Button, VStack, Text, Card, SimpleGrid } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import 'twin.macro'

const HomePage: NextPage = () => {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { hasCompletedOnboarding, completeOnboarding } = useOnboarding()

  // Show onboarding for new users
  if (hasCompletedOnboarding === false) {
    return <AIOnboarding onComplete={completeOnboarding} />
  }

  // Show mobile dashboard on mobile, desktop experience on desktop
  if (isMobile) {
    return <MobileDashboard />
  }

  const features = [
    {
      title: 'Stellar DEX Trading',
      description: 'Trade assets on Stellar\'s built-in decentralized exchange',
      href: '/trade',
      color: 'blue'
    },
    {
      title: 'Blend Protocol',
      description: 'Lend and borrow assets on Stellar with competitive rates',
      href: '/blend',
      color: 'purple'
    },
    {
      title: 'Portfolio',
      description: 'Track your Stellar assets and DeFi positions',
      href: '/portfolio',
      color: 'green'
    }
  ]

  return (
    <>
      <CenterBody tw="mt-20 mb-10 px-5">
        {/* Title */}
        <div tw="flex flex-col items-center text-center font-mono">
          <h1 tw="font-black text-[2.5rem]">Stellar DeFi Hub</h1>
          <h1 tw="font-black text-[2.5rem] text-gray-500">Your Gateway to Stellar DeFi</h1>
          <p tw="mt-1 text-gray-600 text-sm">
            Trade on the DEX, earn yield with Blend, and access the entire Stellar ecosystem
          </p>
        </div>


        {/* Feature Cards */}
        <Box mt={16} w="100%" maxW="4xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {features.map((feature) => (
              <Card
                key={feature.title}
                p={6}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                onClick={() => void router.push(feature.href)}
              >
                <VStack spacing={4} align="start">
                  <Text fontSize="xl" fontWeight="bold" color={`${feature.color}.500`}>
                    {feature.title}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {feature.description}
                  </Text>
                  <Button
                    size="sm"
                    colorScheme={feature.color}
                    rightIcon={<ArrowForwardIcon />}
                    onClick={(e) => {
                      e.stopPropagation()
                      void router.push(feature.href)
                    }}
                  >
                    Get Started
                  </Button>
                </VStack>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Stellar Ecosystem */}
        <Box mt={16} w="100%" maxW="4xl">
          <Text fontSize="lg" fontWeight="bold" mb={6} textAlign="center" color="gray.700">
            Stellar Ecosystem
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {[
              { name: 'XLM', description: 'Native Stellar token' },
              { name: 'USDC', description: 'USD Coin on Stellar' },
              { name: 'Blend', description: 'Lending protocol' },
              { name: 'Soroban', description: 'Smart contracts' }
            ].map((asset) => (
              <Card
                key={asset.name}
                p={4}
                textAlign="center"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                shadow="sm"
                _hover={{ shadow: 'md', borderColor: 'blue.300' }}
                transition="all 0.2s"
              >
                <Text fontSize="sm" fontWeight="semibold" color="gray.800">{asset.name}</Text>
                <Text fontSize="xs" color="gray.600" mt={1}>{asset.description}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </CenterBody>
    </>
  )
}

export default HomePage
