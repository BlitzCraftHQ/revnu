import Head from "next/head";
import { useAccount, useContractWrite } from "wagmi";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import { useState } from "react";

export default function Home() {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState(address);
  const [amount, setAmount] = useState(0);
  // const { data, isLoading, isSuccess, write } = useContractWrite({
  //   address: DEPLOYED_CONTRACTS.ELECTRA_TOKEN.address,
  //   abi: DEPLOYED_CONTRACTS.ELECTRA_TOKEN.abi,
  //   functionName: "stake",
  //   args: [walletAddress, amount],
  // });

  return (
    <>
      <Head>
        <title>
          Dashboard - Revnu | Like, Comment & Subscribe to earn Pego tokens
        </title>
      </Head>

      <ApplicationLayout customHeader="">
        {/* Earnings Stats Start */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <div>
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Stake AltheaCoins to get Electra Tokens
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Perform governance actions on the Althea Network
                </p>
              </div>
            </div>

            <div className="mt-4 flex-shrink-0 w-full">
              <div className="mt-2 flex">
                <div className="min-w-full">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder="0x00000000000000000000000000000000"
                    defaultValue={address}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    aria-describedby="address"
                  />
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
                // onClick={() => write()}
                className="relative mt-2 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Stake Wallet
              </button>
            </div>
          </div>
          {/* Recent Proposals Start */}

          {/* Recent Proposals End */}
        </div>
        {/* Earnings Stats End */}
      </ApplicationLayout>
    </>
  );
}
