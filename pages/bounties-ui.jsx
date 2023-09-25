import Head from "next/head";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";

const bounties = [
  {
    bountyId: "2tjnj2g",
    actionId: "wglnrwp",
    actionType: "Like",
    actionCount: 75000,
    actionClaims: 2000,
    actionRewards: 2000,
  },
  {
    bountyId: "2tjnj2g",
    actionId: "wglnrwp",
    actionType: "Like",
    actionCount: 75000,
    actionClaims: 2000,
    actionRewards: 2000,
  },
  {
    bountyId: "2tjnj2g",
    actionId: "wglnrwp",
    actionType: "Like",
    actionCount: 75000,
    actionClaims: 2000,
    actionRewards: 2000,
  },
  {
    bountyId: "2tjnj2g",
    actionId: "wglnrwp",
    actionType: "Like",
    actionCount: 75000,
    actionClaims: 2000,
    actionRewards: 2000,
  },
  {
    bountyId: "2tjnj2g",
    actionId: "wglnrwp",
    actionType: "Like",
    actionCount: 75000,
    actionClaims: 2000,
    actionRewards: 2000,
  },
];

export default function Bounties() {
  return (
    <>
      <Head>
        <title>
          Dashboard - Electra | Democratizing EV Technology using the Blockchain
        </title>
      </Head>

      <ApplicationLayout
        customHeader="Bounties"
        // customHeaderDescription="Here's a list of all recent proposals created on the Electra
        //     DAO."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
          {bounties.map((bounty, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md"
            >
              <div className="px-5 sm:px-6 lg:px-8 pt-5 font-black text-xl">
                Bounty Information
              </div>
              {/* Votes Progress Bar Start */}
              <div className="mt-5 px-5 sm:px-6">
                <p className="mt-1 text-md leading-5 font-bold flex justify-between">
                  <span className="text-zinc-700">Action Claims</span>
                  <span className="">
                    {bounty.actionClaims} out of {bounty.actionCount}
                  </span>
                </p>
                <div className="mt-3 w-full bg-zinc-200 rounded-full h-1">
                  <div
                    className="bg-green-600 h-1 rounded-full"
                    style={{
                      width: `${
                        (bounty.actionClaims / bounty.actionCount) * 100
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
                        {bounty.bountyId}
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        Action ID
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                        {bounty.actionId}
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        Action Type
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                        {bounty.actionType}
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        Action Rewards
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                        {bounty.actionRewards}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Addresses End */}
              <div className="px-5 sm:px-6 pb-5">
                <button className="w-full rounded-md bg-primary-400 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400">
                  Validate
                </button>
              </div>
            </div>
          ))}
        </div>
      </ApplicationLayout>
    </>
  );
}
