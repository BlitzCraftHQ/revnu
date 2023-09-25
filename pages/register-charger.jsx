import { useEffect, useState } from "react";
import Head from "next/head";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useAccount, useContractWrite } from "wagmi";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import { encodeFunctionData } from "viem";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import useInput from "@/components/Utilities/useInput";

export default function RegisterCharger() {
  const { address: currentWalletAddress } = useAccount();
  const [Loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [center, setCenter] = useState([]);
  const [location, setLocation] = useState("");
  const address = useInput("");

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    address: "",
    latitude: center[1],
    longitude: center[0],
    chargingFee: 1000000,
    chargerCapacity: "",
  });

  const handleInput = (event) => {
    event.persist();
    setInputs((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      address: location,
    }));
  }, [location]);

  useEffect(() => {
    setInputs((prev) => ({
      ...prev,
      latitude: center[1],
      longitude: center[0],
    }));
  }, [center]);

  const {
    data,
    isLoading,
    isSuccess,
    write: propose,
  } = useContractWrite({
    address: DEPLOYED_CONTRACTS.GOVERNOR.address,
    abi: DEPLOYED_CONTRACTS.GOVERNOR.abi,
    functionName: "propose",
  });

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);
    setShowFailed(false);

    let metadata = JSON.stringify({
      ...inputs,
      owner: currentWalletAddress,
      title: `Proposal: New Charging Station At ${inputs.address}`,
      description: `A new charging station has been added to the Electra Registry at ${inputs.address}. 
        **Owner:** ${inputs.firstName} ${inputs.lastName}
        **Charging Fee:** ${inputs.chargingFee} wei
        **Charger Capacity:** ${inputs.chargerCapacity} kW
        **Location:** ${inputs.address}
        **Latitude:** ${inputs.latitude}
        **Longitude:** ${inputs.longitude} 
        Please vote on this proposal to add this charging station to the Electra Registry.`,
    });

    const encodedCallData = encodeFunctionData({
      abi: DEPLOYED_CONTRACTS.STATION_REGISTRY.abi,
      functionName: "addChargingStation",
      args: [currentWalletAddress, metadata, inputs.chargingFee],
    });

    console.log("Metadata: ", metadata);
    console.log("Encoded Call Data: ", encodedCallData);

    propose({
      args: [
        [DEPLOYED_CONTRACTS.STATION_REGISTRY.address], // targets
        [0], // values
        [encodedCallData], // addChargingStation
        metadata, // description
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

        <style>
          {`
          .map-container {
            height: 500px;
            width: 100%;
            }
          `}
        </style>
      </Head>

      <ApplicationLayout
        customHeader="Register Charging Station"
        customHeaderDescription="Once you add your charging station to our TCR, you can start receiving automated Machine-to-Machine payments to your Electra wallet when other users charge their electric vehicles using your station."
      >
        <div className="rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-8"
            onSubmit={handleSubmit}
          >
            <div className="col-span-3 grid grid-cols-1: md:grid-cols-3 gap-x-5">
              <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
                <label
                  htmlFor="firstName"
                  className="block text-xs font-medium text-zinc-900"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  onChange={handleInput}
                  value={inputs.firstName}
                  className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Richard"
                />
              </div>

              <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
                <label
                  htmlFor="lastName"
                  className="block text-xs font-medium text-zinc-900"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  onChange={handleInput}
                  value={inputs.lastName}
                  className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Hendricks"
                />
              </div>
              <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
                <label
                  htmlFor="Charging Fee"
                  className="block text-xs font-medium text-zinc-900"
                >
                  Charging Fee
                </label>
                <input
                  type="text"
                  name="chargingFee"
                  id="chargingFee"
                  onChange={handleInput}
                  value={inputs.chargingFee}
                  className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="1000000 (in wei)"
                />
              </div>
            </div>

            <div className="col-span-3 rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="address"
                className="block text-xs font-medium text-zinc-900"
              >
                Location
              </label>
              <input
                {...address}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Type your address..."
              />
              <div className="mt-5 font-semibold text-xs text-gray-400">
                Addresses that match your search...
              </div>
              {address.suggestions?.length > 0 && (
                <div className="mt-2 block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6">
                  {address.suggestions.map((suggestion, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          address.setValue(suggestion.place_name);
                          setCenter(suggestion.center);
                          address.setSuggestions([]);
                          setLocation(suggestion.place_name);
                        }}
                        className="px-2 py-2 hover:bg-primary-400 cursor-pointer rounded-sm"
                      >
                        {suggestion.place_name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="longitude"
                className="block text-xs font-medium text-zinc-900"
              >
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                id="longitude"
                onChange={handleInput}
                value={center[0]}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                disabled={true}
                placeholder="80.2335256"
              />
            </div>

            <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="latitude"
                className="block text-xs font-medium text-zinc-900"
              >
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                id="latitude"
                onChange={handleInput}
                value={center[1]}
                disabled={true}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="17.0834863"
              />
            </div>

            <div className="relative rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-300 focus-within:ring-2 focus-within:ring-primary-400">
              <label
                htmlFor="chargerCapacity"
                className="block text-xs font-medium text-zinc-900"
              >
                Charger Capacity
              </label>
              <input
                type="text"
                name="chargerCapacity"
                id="chargerCapacity"
                onChange={handleInput}
                value={inputs.chargerCapacity}
                className="block w-full border-0 p-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="100"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pt-4 pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  kW
                </span>
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
                      We have successfully added your charging station to our
                      TCR.
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
                  "Registering Charging Station..."
                ) : (
                  <span className="flex justify-center gap-x-2">
                    Propose Registration <span aria-hidden="true">→</span>
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
