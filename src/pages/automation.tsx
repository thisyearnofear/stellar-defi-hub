import { type NextPage } from 'next';
import Head from 'next/head';
import { AutomationDashboard } from '../components/automation/AutomationDashboard';

const AutomationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Automation - Stellar DeFi Hub</title>
        <meta name="description" content="Automate your Stellar DeFi strategies" />
      </Head>

      <AutomationDashboard />
    </>
  );
};

export default AutomationPage;
