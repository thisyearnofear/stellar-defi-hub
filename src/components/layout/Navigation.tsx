import { Box, Flex, HStack, Text, Button, Spacer } from '@chakra-ui/react';
import { ConnectButton } from '../web3/ConnectButton';
import { useRouter } from 'next/router';

export const Navigation = () => {
  const router = useRouter();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Trade', href: '/trade' },
    { label: 'Blend', href: '/blend' },
    { label: 'Portfolio', href: '/portfolio' },
  ];

  return (
    <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4} shadow="sm">
      <Flex align="center" maxW="7xl" mx="auto">
        {/* Logo/Title */}
        <Text
          fontSize="xl"
          fontWeight="bold"
          color="gray.800"
          cursor="pointer"
          onClick={() => router.push('/')}
          _hover={{ color: 'blue.600' }}
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
              _hover={{ color: 'blue.600', bg: 'gray.50' }}
            >
              {item.label}
            </Button>
          ))}
        </HStack>

        <Spacer />

        {/* Connect Wallet Button - Enhanced Contrast */}
        <Box>
          <ConnectButton />
        </Box>
      </Flex>
    </Box>
  );
};
