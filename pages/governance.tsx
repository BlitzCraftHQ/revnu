import Head from "next/head";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import ProposalList from "@/components/Utilities/ProposalList";
import { gql } from "@apollo/client";
import { client } from "@/utilities/graphql";
import { useEffect, useState } from "react";
import axios from "axios";

const proposals = [
  {
    id: "2tjnj2g",
    name: "Add 0xetre....jkn3 to the list of available charging units in the Los Angeles area.",
    status: "active",
    timeRemaining: "3h remaining",
    for: 75000,
    against: 2000,
  },
  {
    id: "2tjnjdb",
    name: "Remove faulty charging unit belonging to 0xetre....jkn3 in the downtown Manhattan area.",
    status: "active",
    timeRemaining: "3h remaining",
    for: 75000,
    against: 2000,
  },
  {
    id: "2t34j2g",
    name: "Add 0xetre....jkn3 to the list of available charging units in the Los Angeles area.",
    status: "active",
    timeRemaining: "3h remaining",
    for: 75000,
    against: 2000,
  },
  {
    id: "2tjr2g",
    name: "Add 0xetre....jkn3 to the list of available charging units in the Los Angeles area.",
    status: "failed",
    timeRemaining: "3h remaining",
    for: 75000,
    against: 2000,
  },
  {
    id: "2tnj2g",
    name: "Add 0xetre....jkn3 to the list of available charging units in the Los Angeles area.",
    status: "completed",
    timeRemaining: "3h remaining",
    for: 75000,
    against: 2000,
  },
];

function timeDiff(tstart: number, tend: number) {
  var diff = Math.floor((tend - tstart) / 1000),
    units = [
      { d: 60, l: "seconds" },
      { d: 60, l: "minutes" },
      { d: 24, l: "hours" },
      { d: 7, l: "days" },
    ];

  var s = "";
  for (var i = 0; i < units.length; ++i) {
    s = (diff % units[i].d) + " " + units[i].l + " " + s;
    diff = Math.floor(diff / units[i].d);
  }
  return s;
}

export default function Governance() {
  let [data, setData] = useState<any>();

  //get all proposals
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios
          .get("/api/proposals")
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            console.log(err);
          });
        console.log("Result:", result);
        if (result.proposals) {
          let proposalsMod: any[] = [];
          result.proposals.forEach(
            (element: { [x: string]: any }, index: any) => {
              let bigNumb = BigInt(element["args"][0]._hex);

              // Get remaining time
              let createdTime = new Date(
                parseInt(element["_id"].substring(0, 8), 16) * 1000
              ).getTime();
              console.log("created time for ", index, " is: ", createdTime);
              let endTime = Math.floor(+createdTime / 1000) + 3 * 24 * 60 * 60;
              console.log("end time for ", index, " is: ", endTime);

              let currTime = Date.now();
              let remTime = timeDiff(currTime, endTime);

              proposalsMod.push({
                id: bigNumb.toString(10),
                description: JSON.parse(element["args"][8]),
                remainingTime: remTime,
              });
            }
          );
          setData(proposalsMod);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

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
        customHeader="Recent Proposals"
        customHeaderDescription="Here's a list of all recent proposals created on the Electra
            DAO."
      >
        <div className="rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <div className="font-black text-zinc-900 text-2xl"></div>
          {/* Recent Proposals Start */}
          {/* <div className="mt-8">
            <ul role="list" className="divide-y divide-zinc-100">
              {proposals.map((proposal, index) => (
                <li key={index} className="space-x-6">
                  <Link
                    className="px-5 py-5 grid grid-cols-12 hover:bg-zinc-50 rounded-sm border-l-2 border-white hover:border-primary-600"
                    href={`/proposals/${proposal.id}`}
                  >
                    <div className="col-span-10 flex items-center min-w-0 gap-x-4">
                      <div className="h-3 w-3">
                        {proposal.status === "active" && (
                          <div className="relative flex items-center h-3 w-3 bg-primary-600 rounded-full">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-medium leading-6 text-zinc-900 line-clamp-2 text-ellipsis">
                          {proposal.name}
                        </p>
                        <div className="mt-3 flex items-center gap-x-5">
                          <div className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-900 ring-1 ring-inset ring-zinc-200 capitalize">
                            <svg
                              className={`h-1.5 w-1.5 ${
                                proposal.status === "active"
                                  ? "fill-yellow-500"
                                  : proposal.status === "failed"
                                  ? "fill-red-500"
                                  : "fill-green-500"
                              }`}
                              viewBox="0 0 6 6"
                              aria-hidden="true"
                            >
                              <circle cx={3} cy={3} r={3} />
                            </svg>
                            {proposal.status}
                          </div>
                          {proposal.timeRemaining && (
                            <div className="mt-1 text-xs leading-5 text-zinc-500">
                              <time dateTime={proposal.timeRemaining}>
                                {proposal.timeRemaining}
                              </time>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      {proposal.status === "active" ? (
                        <>
                          <div className="w-full">
                            <p className="mt-1 text-xs leading-5 text-zinc-500 flex justify-between">
                              <span>
                                {proposal.for} out of{" "}
                                {proposal.for + proposal.against}
                              </span>
                              <span className="font-medium text-zinc-700">
                                For
                              </span>
                            </p>
                            <div className="w-full bg-zinc-200 rounded-full h-1">
                              <div
                                className="bg-green-600 h-1 rounded-full"
                                style={{
                                  width: `${
                                    (proposal.for /
                                      (proposal.for + proposal.against)) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="mt-3 w-full">
                            <p className="mt-1 text-xs leading-5 text-zinc-500 flex justify-between">
                              <span>
                                {proposal.against} out of{" "}
                                {proposal.for + proposal.against}
                              </span>
                              <span className="font-medium text-zinc-700">
                                Against
                              </span>
                            </p>
                            <div className="w-full bg-zinc-200 rounded-full h-1">
                              <div
                                className="bg-red-600 h-1 rounded-full"
                                style={{
                                  width: `${
                                    (proposal.against /
                                      (proposal.for + proposal.against)) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </>
                      ) : proposal.status === "failed" ? (
                        <div className="flex items-center gap-x-1">
                          <span className="text-sm font-medium">Failed</span>
                          <XCircleIcon
                            className="text-red-600 group-hover:text-white h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-x-1">
                          <span className="text-sm font-medium">Executed</span>
                          <CheckBadgeIcon
                            className="text-green-600 group-hover:text-white h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
          <div>
            <ul role="list" className="divide-y divide-zinc-100">
              {data &&
                data.map((proposal: { id: any }, index: any) => (
                  <ProposalList
                    proposal={proposal}
                    key={index}
                    proposalId={proposal.id}
                  />
                ))}
            </ul>
          </div>
          {/* Recent Proposals End */}
        </div>
      </ApplicationLayout>
    </>
  );
}
