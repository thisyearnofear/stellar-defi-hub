import type { FC, PropsWithChildren } from 'react'
import { Box, Flex, HStack, Text, Button, Spacer, useBreakpointValue } from '@chakra-ui/react'
import { ConnectButton } from '../web3/ConnectButton'
import { useRouter } from 'next/router'
import { MobileLayout } from '../mobile/MobileLayout'
import 'twin.macro'

export const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Trade', href: '/trade' },
    { label: 'Blend', href: '/blend' },
    { label: 'Portfolio', href: '/portfolio' },
  ]

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>
  }

  return (
    <>
      <div tw="relative flex min-h-full flex-col">
        {/* Navigation Header */}
        <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4}>
          <Flex align="center" maxW="7xl" mx="auto">
            {/* Logo/Title */}
            <Text 
              fontSize="xl" 
              fontWeight="bold" 
              color="gray.800"
              cursor="pointer"
              onClick={() => router.push('/')}
            >
              Stellar DeFi Hub
            </Text>

            {/* Navigation Links */}
            <HStack spacing={6} ml={8}>
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(item.href)}
                  color={router.pathname === item.href ? 'blue.600' : 'gray.600'}
                  fontWeight={router.pathname === item.href ? 'semibold' : 'medium'}
                  _hover={{ color: 'blue.600' }}
                >
                  {item.label}
                </Button>
              ))}
            </HStack>

            <Spacer />

            {/* Connect Wallet Button */}
            <ConnectButton />
          </Flex>
        </Box>

        {/* Main Content */}
        <main tw="relative flex grow flex-col">{children}</main>
      </div>
    </>
  )
}
