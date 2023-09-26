import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import Head from "next/head";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import { useEffect } from "react";
import {
  useContractInfiniteReads,
  useContractRead,
  useContractReads,
} from "wagmi";
import { useState } from "react";

const revnuContractConfig = {
  address: DEPLOYED_CONTRACTS.REVNU_REGISTRY.address,
  abi: DEPLOYED_CONTRACTS.REVNU_REGISTRY.abi,
  functionName: "bountyRegistry",
};

export default function Bounties() {
  const [bounties, setBounties] = useState<any>([]);
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

  const range: any = (n: number) =>
    Array.from(Array(n).keys()).map((n) => n + 1);

  useEffect(() => {
    if (lastBountyId) {
      let bounties = range(parseInt(lastBountyId));
      setBounties(bounties);
      console.log("Last Bounty", bounties);
    }
  }, [lastBountyId]);

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
              <div>
                {bounties.map((bountyId: any, i: number) => (
                  <BountyCard bountyId={bountyId} key={i} />
                ))}
              </div>
            ) : (
              <p>Error</p>
            )}
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}

function BountyCard({ bountyId }: any) {
  const {
    data: bounty,
    isError,
    isLoading,
    isSuccess,
  }: any = useContractRead({
    address: DEPLOYED_CONTRACTS.REVNU_REGISTRY.address,
    abi: DEPLOYED_CONTRACTS.REVNU_REGISTRY.abi,
    functionName: "bountyRegistry",
    args: [bountyId],
  });

  return (
    <div>
      {isLoading ? (
        "Loading"
      ) : (
        <div className="mt-5">
          Bounty ID: {bounty[0].toString()}
          <br />
          Bounty Creator: {bounty[1].toString()}
          <br />
          Action ID: {bounty[2].toString()}
          <br />
          Action Type: {bounty[3].toString()}
          <br />
          Action Count: {bounty[4].toString()}
          <br />
          Action Claims: {bounty[5].toString()}
          <br />
          {/* Reward for that action */}
          Reward: {parseFloat(bounty[6]) / parseFloat(bounty[4])}
        </div>
      )}
    </div>
  );
}
