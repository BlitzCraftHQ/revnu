import { useState } from "react";
import Head from "next/head";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
// import { useContractWrite } from "wagmi";
// import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
// import { encodeFunctionData } from "viem";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  UserPlusIcon,
  PencilSquareIcon,
  HandThumbUpIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const actionMethods = [
  { id: "like", title: "Like" },
  { id: "comment", title: "Comment" },
  { id: "subscribe", title: "Subscribe" },
];

export default function CreateBounty() {
  const [Loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);

  const [inputs, setInputs] = useState({
    actionId: "",
    actionType: "",
    actionCount: 0,
    reward: 0,
  });

  const handleInput = (event: {
    persist: () => void;
    target: { id: any; value: any };
  }) => {
    event.persist();
    setInputs((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  // const {
  //   data,
  //   isLoading,
  //   isSuccess,
  //   write: registerVehicle,
  // } = useContractWrite({
  //   address: DEPLOYED_CONTRACTS.VEHICLE_LEDGER.address,
  //   abi: DEPLOYED_CONTRACTS.VEHICLE_LEDGER.abi,
  //   functionName: "registerVehicle",
  // });

  // Submit form
  // const handleSubmit = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setShowSuccess(false);
  //   setShowFailed(false);

  //   console.table(inputs);
  //   setLoading(false);

  //   // registerVehicle({
  //   //   args: [
  //   //     inputs.VINNumber,
  //   //     JSON.stringify({
  //   //       name: inputs.name,
  //   //       make: inputs.make,
  //   //       model: inputs.model,
  //   //       idealChargingWattage: inputs.idealChargingWattage,
  //   //     }),
  //   //   ],
  //   // });

  //   // if (isSuccess) {
  //   //   setLoading(false);
  //   //   setShowSuccess(true);
  //   // } else {
  //   //   setLoading(false);
  //   //   setShowSuccess(false);
  //   // }
  // };

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
        customHeader="Create A Bounty"
        // customHeaderDescription="Electra makes it extremely easy for your to charge your EV at virtually any Electra-enabled charging station."
      >
        <div className="rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <form className="space-y-5">
            <div className="rounded-md my-2 px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="name"
                className="block text-xs font-medium text-zinc-900"
              >
                Entity Link
              </label>
              <input
                type="text"
                name="actionId"
                id="actionId"
                onChange={handleInput}
                value={inputs.actionId}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="https://www.youtube.com/watch?v=o5uGF2598w0"
              />
            </div>
            <div>
              <label className="text-base font-semibold text-gray-900">
                Action Type
              </label>
              <fieldset className="mt-1">
                <legend className="sr-only">Action Type</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {actionMethods.map((actionMethod) => (
                    <div key={actionMethod.id} className="flex items-center">
                      <input
                        id="actionType"
                        name="notification-method"
                        type="radio"
                        onChange={handleInput}
                        value={actionMethod.id}
                        defaultChecked={actionMethod.id === "email"}
                        className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                      />
                      <label
                        htmlFor={actionMethod.id}
                        className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                      >
                        {actionMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="rounded-md my-2 px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="actionCount"
                className="block text-xs font-medium text-zinc-900"
              >
                Count
              </label>
              <input
                type="text"
                name="actionCount"
                id="actionCount"
                onChange={handleInput}
                value={inputs.actionCount}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="5"
              />
            </div>

            <div className="rounded-md my-4 px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="reward"
                className="block text-xs font-medium text-zinc-900"
              >
                Reward
              </label>
              <input
                type="text"
                name="reward"
                id="reward"
                onChange={handleInput}
                value={inputs.reward}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Y5NBMBH75HU4GB5JH"
              />
            </div>

            {showSuccess && (
              <div className="mt-6 sm:col-span-2 rounded-md bg-green-600 px-4 py-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-300"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-50">
                      We have received your application!
                    </p>
                  </div>
                </div>
              </div>
            )}
            {showFailed && (
              <div className="mt-6 sm:col-span-2 rounded-md bg-red-600 px-4 py-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-300"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-50">
                      Uh oh! Something went wrong. Please try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="col-span-3 flex justify-end">
              <button
                type="submit"
                className={`rounded-md bg-primary-400 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400" ${
                  Loading && "opacity-50 cursor-progress"
                }`}
                disabled={Loading}
              >
                {Loading ? (
                  "Creating Topic"
                ) : (
                  <span className="flex justify-center gap-x-2">
                    Register <span aria-hidden="true">→</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </ApplicationLayout>
    </>
  );
}
