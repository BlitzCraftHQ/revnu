import { useContractRead, useContractWrite } from "wagmi";
import DEPLOYED_CONTRACTS from "@/utilities/contractDetails";

import { encodeFunctionData, toHex, keccak256 } from "viem";

export function QueueButton({ proposalData }) {
  const {
    data: queueData,
    isLoading: isQueueLoading,
    isSuccess: isQueueSuccess,
    isError: isQueueError,
    write: queueProposal,
  } = useContractWrite({
    address: DEPLOYED_CONTRACTS.GOVERNOR.address,
    abi: DEPLOYED_CONTRACTS.GOVERNOR.abi,
    functionName: "queue",
  });

  const encodedCallData = encodeFunctionData({
    abi: DEPLOYED_CONTRACTS.STATION_REGISTRY.abi,
    functionName: "addChargingStation",
    args: [
      JSON.parse(proposalData.args[8]).owner,
      proposalData.args[8],
      JSON.parse(proposalData.args[8]).chargingFee,
    ],
  });

  const queueArgs = [
    [DEPLOYED_CONTRACTS.STATION_REGISTRY.address],
    [0],
    [encodedCallData],
    keccak256(toHex(proposalData.args[8])),
  ];

  return (
    <div className="flex m-2">
      <button
        type="button"
        className="flex-1 rounded-md bg-yellow-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => {
          queueProposal({
            args: queueArgs,
          });
        }}
      >
        {isQueueLoading
          ? "Queueing"
          : isQueueSuccess
          ? "Queued"
          : isQueueError
          ? "Error in Queueing"
          : "Queue"}
      </button>
    </div>
  );
}

export function ExecuteButton({ proposalData }) {
  const {
    data: executeData,
    isLoading: isExecuteLoading,
    isSuccess: isExecuteSuccess,
    isError: isExecuteError,
    write: executeProposal,
  } = useContractWrite({
    address: DEPLOYED_CONTRACTS.GOVERNOR.address,
    abi: DEPLOYED_CONTRACTS.GOVERNOR.abi,
    functionName: "execute",
  });

  const encodedCallData = encodeFunctionData({
    abi: DEPLOYED_CONTRACTS.STATION_REGISTRY.abi,
    functionName: "addChargingStation",
    args: [
      JSON.parse(proposalData.args[8]).owner,
      proposalData.args[8],
      JSON.parse(proposalData.args[8]).chargingFee,
    ],
  });

  const executeArgs = [
    [DEPLOYED_CONTRACTS.STATION_REGISTRY.address],
    [0],
    [encodedCallData],
    keccak256(toHex(proposalData.args[8])),
  ];

  return (
    <div className="flex m-2">
      <button
        type="button"
        className="flex-1 rounded-md bg-yellow-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => {
          executeProposal({
            args: executeArgs,
          });
        }}
      >
        {isExecuteLoading
          ? "Executing"
          : isExecuteSuccess
          ? "Executed"
          : isExecuteError
          ? "Error in Executing"
          : "Execute"}
      </button>
    </div>
  );
}
