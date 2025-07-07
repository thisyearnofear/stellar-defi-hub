import { type NextPage } from 'next'
import Head from 'next/head'
import { StellarDEX } from '../components/stellar/StellarDEX'
import { MobileTrade } from '../components/mobile/MobileTrade'
import { useBreakpointValue } from '@chakra-ui/react'

const TradePage: NextPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <>
      <Head>
        <title>Trade - Stellar DeFi Hub</title>
        <meta name="description" content="Trade assets on the Stellar Decentralized Exchange" />
      </Head>

      {isMobile ? <MobileTrade /> : <StellarDEX />}
    </>
  )
}

export default TradePage