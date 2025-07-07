import 'twin.macro'
import {useSorobanReact} from "./StellarProvider"

import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiChevronDown } from 'react-icons/fi'
import { AiOutlineCheckCircle, AiOutlineDisconnect } from 'react-icons/ai'
import toast from 'react-hot-toast'
// Removed soroban-react dependency - using stellar-wallets-kit instead
type WalletChain = { name: string; networkPassphrase: string; networkUrl: string; sorobanRpcUrl: string }

export const ConnectButton = () => {
    // Connect Button
    const sorobanContext = useSorobanReact()

    const {activeChain, address, disconnect, connect} = sorobanContext;
    const activeAccount = address;

    // Mock data for compatibility - these would come from stellar-wallets-kit
    const browserWallets = [{ name: 'Freighter' }, { name: 'Hana' }, { name: 'Lobstr' }];
    const supportedChains = [{ name: 'Mainnet' }, { name: 'Testnet' }];

  const handleContractInteraction = (chain: WalletChain) => {
    if (!chain.name || chain.name.toLowerCase() === 'standalone') {
      toast.error('Please deploy the contract before proceeding when using the standalone chain..');
    } else {
      // Chain switching would be handled by the wallet extension
      toast.success(`Please switch to ${chain.name} in your wallet extension`);
    }
  };

    if (!activeAccount)
      return (
        <Menu>
          <MenuButton
            as={Button}
            // isLoading={isConnecting}
            size="md"
            rightIcon={<FiChevronDown size={22} />}
            py={6}
            fontWeight="bold"
            rounded="2xl"
            colorScheme="purple"
          >
            Connect Wallet
          </MenuButton>

          <MenuList 
            bgColor="white" 
            borderColor="gray.200" 
            border="1px solid"
            rounded="xl"
            shadow="lg"
          >
            {/* Installed Wallets */}
            {!activeAccount &&
              browserWallets.map((w) => 
                  <MenuItem
                    key={w.name}
                    onClick={() => {
                      connect()
                    }}
                    bg="transparent"
                    _hover={{ bg: 'gray.50' }}
                    color="gray.800"
                  >
                    {w.name}
                  </MenuItem>
              )}
          </MenuList>
        </Menu>
      )
      

    // Account Menu & Disconnect Button
    return (
      <Menu matchWidth>
        <HStack>
          {/* Account Name, Address, and AZNS-Domain (if assigned) */}
          <MenuButton
            as={Button}
            rightIcon={<FiChevronDown size={22} />}
            hidden={false}
            py={6}
            pl={5}
            rounded="xl"
            fontWeight="bold"
            bg="gray.800"
            color="white"
            _hover={{ bg: 'gray.700' }}
            _active={{ bg: 'gray.900' }}
            border="1px solid"
            borderColor="gray.300"
          >
            <VStack spacing={0.5}>
              {/* <AccountName account={activeAccount} /> */}
              <Text>{activeChain?.name}</Text>
              <Text fontSize="xs" fontWeight="normal" opacity={0.75}>
                {address}
              </Text>
            </VStack>
          </MenuButton>
        </HStack>

        <MenuList
          bgColor="white"
          borderColor="gray.200"
          border="1px solid"
          rounded="xl"
          maxHeight="40vh"
          shadow="lg"
        >
          {/* Supported Chains */}
          {/* Commented this as changing chain with the setActiveChain from soroban-react 
          is not working well - should change chain in the browser extension */}
          {/* {supportedChains.map((chain) => (
            <MenuItem
              key={chain.name}
              // isDisabled={chain.network === activeChain?.network}
              onClick={() => {
                // toast.error(`Not implemented yet. Please switch chain via the wallet extension.`)
                handleContractInteraction(chain)
              }}
              tw="bg-transparent hocus:bg-gray-800"
            >
              <VStack align="start" spacing={0}>
                <HStack>
                  <Text>{chain.name}</Text>
                  {chain.network === activeChain?.network && <AiOutlineCheckCircle size={16} />}
                </HStack>
              </VStack>
            </MenuItem>
          ))} */}

          {/* Disconnect Button */}
          <MenuDivider />
          <MenuItem
            onClick={async () => {console.log("Disconnecting"); await disconnect()}}
            icon={<AiOutlineDisconnect size={18} />}
            bg="transparent"
            _hover={{ bg: 'gray.50' }}
            color="gray.800"
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
    )
  }