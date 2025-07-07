import { type NextPage } from 'next'
import Head from 'next/head'
import { CenterBody } from '@/components/layout/CenterBody'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { ClientOnlyGreeter } from '@/components/web3/ClientOnlyGreeter'
import 'twin.macro'

const DemoPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Soroban Demo | Stellar Bridge Hub</title>
        <meta name="description" content="Original Soroban contract demo" />
      </Head>

      <CenterBody tw="mt-20 mb-10 px-5">
        {/* Title */}
        <div tw="flex flex-col items-center text-center font-mono">
          <h1 tw="font-black text-[2.5rem]">Soroban Demo</h1>
          <h1 tw="font-black text-[2.5rem] text-gray-500">Original Contract</h1>
          <p tw="mt-1 text-gray-600 text-sm">
            Test the original greeting contract functionality
          </p>
          <div tw="mt-6">
            <ConnectButton />
          </div>
        </div>

        {/* Soroban Components - Client Side Only */}
        <ClientOnlyGreeter />
      </CenterBody>
    </>
  )
}

export default DemoPage