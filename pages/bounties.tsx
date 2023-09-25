import Head from "next/head";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";

const bounties = [
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

export default function Bounties() {
  return (
    <>
      <Head>
        <title>
          Dashboard - Electra | Democratizing EV Technology using the Blockchain
        </title>
      </Head>

      <ApplicationLayout
        customHeader="Recent Proposals"
        customHeaderDescription="Here's a list of all recent proposals created on the Electra
            DAO."
      ></ApplicationLayout>
    </>
  );
}
