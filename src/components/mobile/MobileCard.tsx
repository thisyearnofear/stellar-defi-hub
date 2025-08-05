import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface MobileCardProps extends BoxProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  noPadding = false,
  ...props
}) => {
  return (
    <Box
      bg="white"
      borderRadius="16px"
      shadow="sm"
      border="1px"
      borderColor="gray.100"
      overflow="hidden"
      p={noPadding ? 0 : 4}
      {...props}
    >
      {children}
    </Box>
  );
};
