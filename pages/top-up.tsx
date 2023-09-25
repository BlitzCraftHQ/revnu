import Head from "next/head";
import { useAccount, useContractWrite, useContractRead } from "wagmi";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { format } from "path";

const ViewBalance = ({ vin }) => {
  const { data, isLoading, isSuccess } = useContractRead({
    address: DEPLOYED_CONTRACTS.VEHICLE_LEDGER.address,
    abi: DEPLOYED_CONTRACTS.VEHICLE_LEDGER.abi,
    functionName: "getBalance",
    args: [vin],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isSuccess) {
    return <div>{formatEther(data)}</div>;
  }

  return <div>0</div>;
};

export default function TopUp() {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState(address);
  const [vin, setVin] = useState("");
  const [amount, setAmount] = useState(0);

  const {
    data,
    isLoading,
    isSuccess,
    write: topUp,
  } = useContractWrite({
    address: DEPLOYED_CONTRACTS.VEHICLE_LEDGER.address,
    abi: DEPLOYED_CONTRACTS.VEHICLE_LEDGER.abi,
    functionName: "topUpBalance",
  });

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
      </Head>

      <ApplicationLayout
        customHeader="Top Up VIN Balance"
        customHeaderDescription="Top Up your Electra wallet to continue enjoying automated payments wherever you go."
      >
        {/* Earnings Stats Start */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <div className="mt-4 flex-shrink-0 w-full">
            <div className="mt-2 flex">
              <div className="min-w-full">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Vehicle Identification Number (VIN)
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="98JA98I8NASD9AUSN"
                  defaultValue={vin}
                  onChange={(e) => setVin(e.target.value)}
                  aria-describedby="vin"
                />
                <ViewBalance vin={vin} />
              </div>
              <div className="ml-4 min-w-full">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="1000000"
                  defaultValue={1000000}
                  onChange={(e) => setAmount(e.target.value)}
                  aria-describedby="amount"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                topUp({
                  args: [vin],
                  value: BigInt(amount),
                })
              }
              className="relative mt-2 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Stake Wallet
            </button>
          </div>
          {/* Recent Proposals Start */}

          {/* Recent Proposals End */}
        </div>
        {/* Earnings Stats End */}
      </ApplicationLayout>
    </>
  );
}
