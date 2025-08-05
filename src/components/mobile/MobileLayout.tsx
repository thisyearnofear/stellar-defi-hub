import React from 'react';
import { Box, VStack, HStack, Text, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiDollarSign, FiUser, FiMenu } from 'react-icons/fi';
import { RiRobotLine } from 'react-icons/ri';
import { useRouter } from 'next/router';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const navItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: FiTrendingUp, label: 'Trade', path: '/trade' },
    { icon: RiRobotLine, label: 'AI', path: '/ai' },
    { icon: FiDollarSign, label: 'Earn', path: '/blend' },
    { icon: FiUser, label: 'Portfolio', path: '/portfolio' },
  ];

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Mobile Header */}
      <Box
        bg="white"
        px={4}
        py={3}
        borderBottom="1px"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Stellar DeFi
          </Text>
          <IconButton aria-label="Menu" icon={<FiMenu />} variant="ghost" size="sm" />
        </HStack>
      </Box>

      {/* Main Content */}
      <Box pb="80px" minH="calc(100vh - 60px)">
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        borderTop="1px"
        borderColor="gray.200"
        px={2}
        py={2}
        zIndex={10}
      >
        <HStack justify="space-around">
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <VStack
                key={item.path}
                spacing={1}
                cursor="pointer"
                onClick={() => router.push(item.path)}
                color={isActive ? 'blue.500' : 'gray.500'}
                _hover={{ color: 'blue.500' }}
                flex={1}
                py={1}
              >
                <item.icon size={20} />
                <Text fontSize="xs" fontWeight={isActive ? 'semibold' : 'normal'}>
                  {item.label}
                </Text>
              </VStack>
            );
          })}
        </HStack>
      </Box>
    </Box>
  );
};
