import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import { XMarkIcon } from "@heroicons/react/20/solid";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState(address);

  const [bounties, setBounties] = useState<any>([]);

  //get last bounty ID

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
          Dashboard - Electra | Democratizing EV Technology using the Blockchain
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
        <style>
          {`
          .map-container {
            height: 500px;
            }
          `}
        </style>
      </Head>

      <ApplicationLayout customHeader="Your Dashboard">
        {/* Tokens Balance Start */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <div>
            <div className="font-black text-zinc-900 text-2xl">
              Earning Balance
            </div>
            <div className="mt-1 font-medium text-gray-500 text-sm">
              Total tokens you have claimed
            </div>
            <div className="mt-5 font-black text-5xl text-gray-900">
              5{" "}
              <span className="text-base text-gray-500 font-medium">RVTK</span>
            </div>
          </div>

          <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div>
              <div className="font-black text-zinc-900 text-2xl">
                Your Balance
              </div>
              <div className="mt-1 font-medium text-gray-500 text-sm">
                Tokens you poses in your account
              </div>
              <div className="mt-5 font-black text-5xl text-gray-900">
                10{" "}
                <span className="text-base text-gray-500 font-medium">
                  RVTK
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Tokens Balance End */}
        <div className="m-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-5 gap-y-5">
            {bounties.map((bounty, index) => (
              <BountyCard bountyId={bounty} key={index} />
            ))}
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}

function BountyCard({ bountyId, key }: any) {
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

  async function handleVerification(actionLink) {
    const myArray = actionLink.split("//");
    const actionId = myArray[1].split("/").slice(-1)[0];
    console.log(actionId);
    const accessToken = localStorage.getItem("token");
    console.log(accessToken);

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/activities",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          part: "snippet",
          mine: true,
          maxResults: 10, // Adjust the number of results as needed
          type: "like",
        },
      }
    );

    console.log(response);
  }

  return isLoading ? (
    "Loading"
  ) : (
    <div key={key} className="bg-white border border-gray-200 rounded-md">
      <div className="px-5 sm:px-6 lg:px-8 pt-5 font-black text-xl">
        Bounty Information
      </div>
      {/* Votes Progress Bar Start */}
      <div className="mt-5 px-5 sm:px-6">
        <p className="mt-1 text-md leading-5 font-bold flex justify-between">
          <span className="text-zinc-700">Action Claims</span>
          <span className="">
            {bounty[5].toString()} out of {bounty[4].toString()}
          </span>
        </p>
        <div className="mt-3 w-full bg-zinc-200 rounded-full h-1">
          <div
            className="bg-green-600 h-1 rounded-full"
            style={{
              width: `${
                (parseFloat(bounty[5]) / parseFloat(bounty[4])) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>
      {/* Votes Progress Bar End */}
      {/* Addresses Start */}
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                Bounty ID
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                {bounty[0].toString()}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                Bounty Creator
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                {bounty[1].toString()}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                Action ID
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                {bounty[2].toString()}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                Action Type
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                {bounty[3].toString()}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                Action Rewards
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                {parseFloat(bounty[6]) / parseFloat(bounty[4])}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Addresses End */}
      <div className="px-5 sm:px-6 pb-5">
        <button
          className="w-full rounded-md bg-primary-400 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
          onClick={() => handleVerification(bounty[2].toString())}
        >
          Validate
        </button>
      </div>
    </div>
  );
}
