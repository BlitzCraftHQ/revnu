import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import { XMarkIcon } from "@heroicons/react/20/solid";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import { formatEther } from "viem";
import { GeolocateControl, Map, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const markersData = [
  {
    firstName: "Daniel",
    lastName: "Mark",
    address: "Kilpauk, Chennai, Chennai, Tamil Nadu, India",
    latitude: 13.083215,
    longitude: 80.237986,
    chargerCapacity: "120",
    title:
      "New Charging Station At Kilpauk, Chennai, Chennai, Tamil Nadu, India",
  },
  {
    firstName: "Daniel",
    lastName: "Mark",
    address:
      "Aspiran Garden Colony, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
    latitude: 13.085186,
    longitude: 80.237952,
    chargerCapacity: "150",
    title:
      "New Charging Station At Aspiran Garden Colony, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
  },
  {
    firstName: "Fabian",
    lastName: "Ferno",
    address:
      "Mandapam Road, Aspiran Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
    latitude: 13.0845332,
    longitude: 80.2358215,
    chargerCapacity: "200",
    title:
      "New Charging Station At Mandapam Road, Aspiran Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
  },
  {
    firstName: "Richard",
    lastName: "Hendricks",
    address:
      "Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
    latitude: 13.0849401,
    longitude: 80.2339489,
    chargerCapacity: "200",
    title:
      "New Charging Station At Central Street, Kilpauk Garden Colony, 600010, Kilpauk, Chennai, Chennai, Tamil Nadu, India",
  },
];

export default function Home() {
  const { address } = useAccount();
  const [location, setLocation] = useState([]);
  const [addressOnMap, setAddressOnMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [PopUpData, setPopUpData] = useState({});
  const [walletAddress, setWalletAddress] = useState(address);
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: DEPLOYED_CONTRACTS.ELECTRA_TOKEN.address,
    abi: DEPLOYED_CONTRACTS.ELECTRA_TOKEN.abi,
    functionName: "delegate",
    args: [walletAddress],
  });

  const { data: VotingTokens } = useContractRead({
    address: DEPLOYED_CONTRACTS.ELECTRA_TOKEN.address,
    abi: DEPLOYED_CONTRACTS.ELECTRA_TOKEN.abi,
    functionName: "getVotes",
    args: [address],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(retrieveMarkers, error);
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  function retrieveMarkers(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation([latitude, longitude]);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // Make API call to MapBox
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        var addressTemp = data.features.filter((item) =>
          item.place_type.includes("address")
        )[0];
        setAddressOnMap(addressTemp.place_name);
      })
      .then(() => {
        // Get markers
        axios
          .get("/api/proposals")
          .then((res) => {
            console.log(
              res.data.proposals.map((item) => JSON.parse(item["args"][8]))
            );
            setMarkers(
              res.data.proposals.map((item) => JSON.parse(item["args"][8]))
            );
            console.log(markers);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => console.log(error));
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

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
        {/* Votes Delegation Start */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <div>
            <div className="font-black text-zinc-900 text-2xl">
              Voting Power
            </div>
            <div className="mt-1 font-medium text-gray-500 text-sm">
              Total Votes you posses
            </div>
            <div className="mt-5 font-black text-5xl text-gray-900">
              {VotingTokens ? formatEther(VotingTokens).toString() : "0"}{" "}
              <span className="text-base text-gray-500 font-medium">votes</span>
            </div>
          </div>
          <div>
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Delegate voting power
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your delegate&apos;s performance impacts your onchain
                  reputation. Delegate to someone who is aligned with your goals
                  and actively participates.
                </p>
              </div>
            </div>

            <div className="mt-4 flex-shrink-0">
              <div className="mt-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="0x00000000000000000000000000000000"
                  defaultValue={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  aria-describedby="address"
                />
              </div>
              <button
                type="button"
                onClick={() => write()}
                className="mt-4 relative inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Delegate Votes
              </button>
            </div>
          </div>
        </div>
        {/* Votes Delegation End */}
        {/* Map Start */}
        <div className="mt-8 rounded-md bg-white px-5 py-6 shadow sm:px-6">
          <div className="font-semibold text-2xl text-gray-900">
            EV Charging Stations Near Your Location
          </div>
          <div>
            {addressOnMap === null ? (
              <div className="mt-2 font-medium text-gray-500 text-sm">
                Retrieving your current location...
              </div>
            ) : (
              <div className="mt-2 font-medium text-gray-500 text-sm">
                {addressOnMap}
              </div>
            )}
          </div>
          <div className="mt-5 col-span-2 overflow-hidden rounded-md">
            {markers.length > 0 && (
              <Map
                // mapLib={import("mapbox-gl")}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
                attributionControl={false}
                initialViewState={{
                  latitude: location[0],
                  longitude: location[1],
                  zoom: 15,
                }}
                style={{ height: 500 }}
                // mapStyle="mapbox://styles/mapbox/navigation-day-v1"
                mapStyle="mapbox://styles/mapbox/streets-v9"
                className="relative map-container"
              >
                <GeolocateControl />
                <NavigationControl />
                {markers.map((marker) => (
                  <Marker
                    key={`${marker.latitude}-${marker.longitude}`}
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    anchor="bottom"
                    onClick={() => {
                      setPopUpData(marker);
                      setShowPopUp(true);
                    }}
                  />
                ))}
                {showPopUp && (
                  <div className="absolute top-3 left-3 bg-white px-5 py-3 rounded-md shadow-lg border border-gray-100">
                    <XMarkIcon
                      className="h-6 w-6 text-gray-400 absolute top-3 right-3 cursor-pointer"
                      aria-hidden="true"
                      onClick={() => setShowPopUp(false)}
                    />
                    <div className="font-semibold text-gray-900 tracking-tight text-xl pr-8 max-w-lg">
                      {PopUpData.address}
                    </div>
                    <div className="text-gray-500 text-sm">
                      Owned by {PopUpData.firstName} {PopUpData.lastName}
                    </div>

                    <div className="mt-3 text-gray-500 text-sm">
                      Latitude: {PopUpData.latitude}
                    </div>
                    <div className="mt-0 text-gray-500 text-sm">
                      Longitude: {PopUpData.longitude}
                    </div>

                    <div className="mt-5 flex items-center gap-x-2 font-medium text-gray-500 text-lg">
                      <Image
                        src="/logos/logo.png"
                        width={512}
                        height={512}
                        alt="Logo"
                        className="h-6 w-6"
                      />
                      <span>
                        {PopUpData.chargerCapacity} kW Charging Station
                      </span>
                    </div>

                    <div className="mt-8 mb-5">
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${PopUpData.latitude}%2C${PopUpData.longitude}`}
                        target="_blank"
                        passHref={true}
                        className="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      >
                        Locate on Google Maps
                      </Link>
                    </div>
                  </div>
                )}
              </Map>
            )}
          </div>
        </div>
        {/* Map End */}
      </ApplicationLayout>
    </>
  );
}
