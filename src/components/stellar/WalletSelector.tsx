import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Button,
  Text,
  Image,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { useStellar } from '../web3/StellarProvider';
import { StellarWalletType } from '../../lib/wallets/stellarWalletAdapter';

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({ isOpen, onClose }) => {
  const { availableWallets, connect } = useStellar();

  const handleWalletSelect = async (walletType: StellarWalletType) => {
    try {
      await connect(walletType);
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const getWalletDescription = (walletType: StellarWalletType): string => {
    switch (walletType) {
      case StellarWalletType.FREIGHTER:
        return 'Browser extension wallet for Stellar';
      case StellarWalletType.LOBSTR:
        return 'Mobile and web wallet with built-in DEX';
      case StellarWalletType.HANA:
        return 'Multi-chain wallet supporting Stellar';
      case StellarWalletType.RABET:
        return 'Simple and secure Stellar wallet';
      case StellarWalletType.ALBEDO:
        return 'Web-based wallet with advanced features';
      default:
        return 'Stellar wallet';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Stellar Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={3}>
            {availableWallets.length > 0 ? (
              availableWallets.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  size="lg"
                  width="100%"
                  height="auto"
                  p={4}
                  onClick={() => handleWalletSelect(wallet.id)}
                  _hover={{ bg: 'gray.50', borderColor: 'blue.300' }}
                >
                  <HStack spacing={4} width="100%">
                    <Image
                      src={wallet.icon}
                      alt={wallet.name}
                      boxSize="40px"
                      fallback={
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                          }}
                        >
                          🌟
                        </div>
                      }
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack>
                        <Text fontWeight="semibold">{wallet.name}</Text>
                        <Badge colorScheme="green" size="sm">
                          Installed
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.600" textAlign="left">
                        {getWalletDescription(wallet.id)}
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              ))
            ) : (
              <VStack spacing={4} py={8}>
                <Text color="gray.500" textAlign="center">
                  No Stellar wallets found
                </Text>
                <Text fontSize="sm" color="gray.400" textAlign="center">
                  Please install a Stellar wallet to continue:
                </Text>
                <VStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => window.open('https://freighter.app/', '_blank')}
                  >
                    Install Freighter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('https://lobstr.co/', '_blank')}
                  >
                    Install Lobstr
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open('https://hana.money/', '_blank')}
                  >
                    Install Hana
                  </Button>
                </VStack>
              </VStack>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Hook for easy wallet selection
export const useWalletSelector = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    openWalletSelector: onOpen,
    WalletSelectorModal: () => <WalletSelector isOpen={isOpen} onClose={onClose} />,
  };
};
