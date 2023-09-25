import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import Head from "next/head";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import { useEffect } from "react";
import {
  useContractInfiniteReads,
  useContractRead,
  useContractReads,
} from "wagmi";

const revnuContractConfig = {
  address: DEPLOYED_CONTRACTS.REVNU_REGISTRY.address,
  abi: DEPLOYED_CONTRACTS.REVNU_REGISTRY.abi,
  functionName: "bountyRegistry",
};

export default function Bounties() {
  const {
    data: lastBountyId,
    isError,
    isLoading,
    isSuccess,
  }: any = useContractRead({
    address: DEPLOYED_CONTRACTS.REVNU_REGISTRY.address,
    abi: DEPLOYED_CONTRACTS.REVNU_REGISTRY.abi,
    functionName: "getLatestBountyId",
  });

  useEffect(() => {
    if (lastBountyId) {
      console.log("Last Bounty", lastBountyId);
    }
  }, [lastBountyId]);

  //   if (isError) return <div className="text-black">Error</div>;
  //   if (isLoading) return <div className="text-black">Loading</div>;
  //   if (isSuccess)
  return (
    <>
      <Head>
        <title>
          Dashboard - Revnu | Democratizing EV Technology using the Blockchain
        </title>
        <meta
          name="title"
          content="Notifications - Electra | Push Notification Service for the Neo Blockchain"
        />
        <meta
          name="description"
          content="Stay informed and in-the-know with real-time push
            notifications on transactions, smart contracts, and network
            developments. Empower your Neo experience with Electra's
            timely alerts, ensuring you never miss a beat on the Neo
            Blockchain."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://neocast.blitzcrafthq.com" />
        <meta
          property="og:title"
          content="Notifications - Electra | Push Notification Service for the Neo Blockchain"
        />
        <meta
          property="og:description"
          content="Stay informed and in-the-know with real-time push
            notifications on transactions, smart contracts, and network
            developments. Empower your Neo experience with Electra's
            timely alerts, ensuring you never miss a beat on the Neo
            Blockchain."
        />
        <meta property="og:image" content="/meta-image.jpg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://neocast.blitzcrafthq.com/"
        />
        <meta
          property="twitter:title"
          content="Notifications - Electra | Push Notification Service for the Neo Blockchain"
        />
        <meta
          property="twitter:description"
          content="Stay informed and in-the-know with real-time push
            notifications on transactions, smart contracts, and network
            developments. Empower your Neo experience with Electra's
            timely alerts, ensuring you never miss a beat on the Neo
            Blockchain."
        />
        <meta property="twitter:image" content="/meta-image.jpg" />
      </Head>

      <ApplicationLayout
        customHeader="Bounties"
        customHeaderDescription="Electra makes it extremely easy for your to charge your EV at virtually any Electra-enabled charging station."
      >
        <div className="rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <div className="container">
            {isLoading ? (
              <p>Loading</p>
            ) : isSuccess ? (
              <GetBounties lastBountyId={lastBountyId} />
            ) : (
              <p>Error</p>
            )}
            Test
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}

function GetBounties({ lastBountyId }: any) {
  const range: any = (n: number) => Array.from(Array(n).keys());

  let contracts = range(parseInt(lastBountyId)).map((bountyId: any) => [
    {
      ...revnuContractConfig,
      args: [bountyId + 1],
    },
  ]);

  const { data, isError, isSuccess, isLoading } = useContractRead({
    contracts,
  });

  useEffect(() => {
    console.log("Test: ", contracts);
    console.log("Data: ", data);
    console.log("Loading: ", isLoading);
  }, [data, isLoading]);

  return (
    <div>
      {isLoading
        ? "Loading"
        : isSuccess
        ? JSON.stringify(data)
        : JSON.stringify(isError)}
    </div>
  );
}