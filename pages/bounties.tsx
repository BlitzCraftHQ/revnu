import Head from "next/head";
import ApplicationLayout from "@/components/Utilities/ApplicationLayout";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";
import { useState, useEffect } from "react";
import { useContractRead, useContractWrite } from "wagmi";
import axios from "axios";

export default function Bounties() {
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
      </Head>

      <ApplicationLayout
        customHeader="Bounties"
        // customHeaderDescription="Here's a list of all recent proposals created on the Electra
        //     DAO."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-5 gap-y-5">
          {bounties.map((bounty, index) => (
            <BountyCard bountyId={bounty} key={index} />
          ))}
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

  const {
    data: claimData,
    isClaimLoading,
    isClaimSuccess,
    write: claimBounty,
  }: any = useContractWrite({
    address: DEPLOYED_CONTRACTS.REVNU_REGISTRY.address,
    abi: DEPLOYED_CONTRACTS.REVNU_REGISTRY.abi,
    functionName: "claimBounty",
  });

  async function handleVerification(actionLink, actionType, verifiedBountyId) {
    // actionLink = "https://www.youtube.com/channel/UCeMcCNtvQe6ecVnm_RrWzng";
    let myArray = actionLink.split("//");
    let actionId = myArray[1].split("/").slice(-1)[0];
    const accessToken = localStorage.getItem("token");

    switch (actionType) {
      case "like":
        console.log("like or comment");
        let videoId = actionId.split("=")[1];
        console.log("video id:", videoId);

        try {
          // Make a GET request to fetch the user's rating (like/dislike) for the video
          const ratingResponse = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos/getRating",
            {
              params: {
                key: "AIzaSyD2wZfkQuijKkXhKD_CGjeP986xkm7dY-8",
                id: videoId,
                access_token: accessToken,
              },
            }
          );
          const userRating = ratingResponse.data.items[0]; // Assuming there's only one item

          if (userRating) {
            if (userRating.rating === "like") {
              console.log("The user has liked the video.");
              claimBounty({
                args: [verifiedBountyId],
              });
            } else {
              console.log("The user has not rated the video.");
            }
          } else {
            console.log("User rating information not found.");
          }
        } catch (error) {
          console.error("Error:", error.message);
        }
        break;
      case "subscribe":
        console.log("subscribe");
        console.log("channel id:", actionId);
        const subcribersResponse = await axios.get(
          "https://www.googleapis.com/youtube/v3/subscriptions",
          {
            params: {
              key: "AIzaSyD2wZfkQuijKkXhKD_CGjeP986xkm7dY-8",
              part: "snippet",
              forChannelId: actionId,
              mine: true,
              access_token: accessToken,
              maxResults: 6,
            },
          }
        );
        if (subcribersResponse.data.items[0] != undefined) {
          const subscribedChannelId =
            subcribersResponse.data.items[0].snippet.resourceId.channelId;
          if (subscribedChannelId == actionId) {
            console.log("user has subscribed");
            claimBounty({
              args: [verifiedBountyId],
            });
          }
        } else {
          console.log("you have not subscribed");
        }
        break;
      case "comment":
        console.log("comment");
        try {
          let videoId = actionId.split("=")[1];
          console.log("video id:", videoId);
          const channelRespose = await axios.get(
            "https://www.googleapis.com/youtube/v3/channels",
            {
              params: {
                key: "AIzaSyD2wZfkQuijKkXhKD_CGjeP986xkm7dY-8",
                part: "snippet",
                mine: true, // Get the channel for the authenticated user
                access_token: accessToken,
              },
            }
          );
          console.log(channelRespose.data.items);
          if (channelRespose.data.items != undefined) {
            const channel = channelRespose.data.items[0];
            console.log(channel.id);

            if (channel) {
              console.log("The user has a channel.");

              const apiUrl =
                "https://www.googleapis.com/youtube/v3/commentThreads";

              // Make a GET request to fetch comment threads for the video
              axios
                .get(apiUrl, {
                  params: {
                    key: "AIzaSyD2wZfkQuijKkXhKD_CGjeP986xkm7dY-8",
                    part: "snippet",
                    videoId: videoId,
                    access_token: accessToken,
                  },
                })
                .then((response) => {
                  // Handle the API response here
                  const commentThreads = response.data.items;

                  if (commentThreads) {
                    // Check if the authenticated user's comment is among the comment threads
                    const userHasCommented = commentThreads.some((thread) => {
                      if (thread.snippet.topLevelComment) {
                        const commentUserId =
                          thread.snippet.topLevelComment.snippet.authorChannelId
                            .value;

                        // Optionally, you can check if the comment was made by the authenticated user
                        if (channel.id && commentUserId === channel.id) {
                          return true;
                        }
                      }
                      return false;
                    });

                    if (userHasCommented) {
                      console.log("The user has commented on the video.");
                      claimBounty({
                        args: [verifiedBountyId],
                      });
                    } else {
                      console.log("The user has not commented on the video.");
                    }
                  } else {
                    console.log("No comment threads found for the video.");
                  }
                })
                .catch((error) => {
                  // Handle errors
                  console.error("Error fetching comment threads:", error);
                });
            } else {
              console.log("The user does not have a channel.");
            }
          } else {
            console.log("no channel");
          }
        } catch (error) {
          console.log(error);
        }

        break;
      default:
        break;
    }
  }

  return isLoading ? (
    "Loading"
  ) : (
    <div key={key} className="bg-white border border-gray-200 rounded-md">
      <div className="px-5 sm:px-6 lg:px-8 pt-5 font-black text-xl">
        Bounty Information
        {bounty[5] == bounty[4] && (
          <div className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-900 ring-1 ring-inset ring-zinc-200 capitalize">
            <svg
              className={`h-1.5 w-1.5 fill-green-500
                    }`}
              viewBox="0 0 6 6"
              aria-hidden="true"
            >
              <circle cx={3} cy={3} r={3} />
            </svg>
            Claimed
          </div>
        )}
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
      {/* {bounty[5] === bounty[4] && (
        <div className="px-5 sm:px-6 pb-5">
          <button
            className="w-full rounded-md bg-primary-400 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            onClick={() =>
              handleVerification(bounty[2].toString(), bounty[3].toString())
            }
          >
            Validate
          </button>
        </div>
      )} */}
      <div className="px-5 sm:px-6 pb-5">
        <button
          className="w-full rounded-md bg-primary-400 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
          onClick={() =>
            handleVerification(
              bounty[2].toString(),
              bounty[3].toString(),
              bounty[0]
            )
          }
        >
          Validate
        </button>
      </div>
    </div>
  );
}
