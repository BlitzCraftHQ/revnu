import { useState } from "react";
import Head from "next/head";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useContractWrite } from "wagmi";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import { encodeFunctionData } from "viem";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";

export default function RegisterVehicle() {
  const [Loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);

  const [inputs, setInputs] = useState({
    name: "",
    make: "",
    model: "",
    VINNumber: "",
    idealChargingWattage: "",
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

  const {
    data,
    isLoading,
    isSuccess,
    write: registerVehicle,
  } = useContractWrite({
    address: DEPLOYED_CONTRACTS.VEHICLE_LEDGER.address,
    abi: DEPLOYED_CONTRACTS.VEHICLE_LEDGER.abi,
    functionName: "registerVehicle",
  });

  // Submit form
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);
    setShowFailed(false);

    console.log("Inputs:", [
      inputs.VINNumber,
      JSON.stringify({
        name: inputs.name,
        make: inputs.make,
        model: inputs.model,
        idealChargingWattage: inputs.idealChargingWattage,
      }),
    ]);

    registerVehicle({
      args: [
        inputs.VINNumber,
        JSON.stringify({
          name: inputs.name,
          make: inputs.make,
          model: inputs.model,
          idealChargingWattage: inputs.idealChargingWattage,
        }),
      ],
    });

    if (isSuccess) {
      setLoading(false);
      setShowSuccess(true);
    } else {
      setLoading(false);
      setShowSuccess(false);
    }
  };

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
        customHeader="Register Your Vehicle"
        customHeaderDescription="Electra makes it extremely easy for your to charge your EV at virtually any Electra-enabled charging station."
      >
        <div className="rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8"
            onSubmit={handleSubmit}
          >
            <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="name"
                className="block text-xs font-medium text-zinc-900"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInput}
                value={inputs.name}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="My Primary Car"
              />
            </div>

            <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="make"
                className="block text-xs font-medium text-zinc-900"
              >
                Make
              </label>
              <input
                type="text"
                name="make"
                id="make"
                onChange={handleInput}
                value={inputs.make}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Lucid"
              />
            </div>

            <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="model"
                className="block text-xs font-medium text-zinc-900"
              >
                Model
              </label>
              <input
                type="text"
                name="model"
                id="model"
                onChange={handleInput}
                value={inputs.model}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Air Touring"
              />
            </div>

            <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
                <label
                  htmlFor="VINNumber"
                  className="block text-xs font-medium text-zinc-900"
                >
                  VIN Number
                </label>
                <input
                  type="text"
                  name="VINNumber"
                  id="VINNumber"
                  onChange={handleInput}
                  value={inputs.VINNumber}
                  className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Y5NBMBH75HU4GB5JH"
                />
              </div>

              <div className="relative rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
                <label
                  htmlFor="idealChargingWattage"
                  className="block text-xs font-medium text-zinc-900"
                >
                  Ideal Charging Wattage
                </label>
                <input
                  type="text"
                  name="idealChargingWattage"
                  id="idealChargingWattage"
                  onChange={handleInput}
                  value={inputs.idealChargingWattage}
                  className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="200"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pt-4 pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    kW
                  </span>
                </div>
              </div>
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
