import { RevnuRegistry, RevnuToken } from "../../typechain-types"
import { deployments, ethers } from "hardhat"
import { assert, expect } from "chai"
import {
  FUNC,
  PROPOSAL_DESCRIPTION,
  NEW_STORE_VALUE,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} from "../../helper-hardhat-config"
import { moveBlocks } from "../../utils/move-blocks"
import { moveTime } from "../../utils/move-time"
import { formatEther, parseEther } from "ethers/lib/utils"
import { BigNumber } from "ethers"

describe("Revnu Flow", async () => {
  let revnuToken: RevnuToken
  let revnuRegistry: RevnuRegistry
  let currentBountyId: BigNumber

  beforeEach(async () => {
    await deployments.fixture(["all"])
    revnuToken = await ethers.getContract("RevnuToken")
    revnuRegistry = await ethers.getContract("RevnuRegistry")
  })

  it("Create a bounty", async () => {
    // Approve tokens
    const approveTx = await revnuToken.approve(revnuRegistry.address, parseEther("2"))
    await approveTx.wait(1)

    // Log allowance
    const allowance = await revnuToken.allowance(
      await revnuToken.signer.getAddress(),
      revnuRegistry.address
    )
    console.log(`Allowance: ${formatEther(allowance.toString())}`)

    const res = await revnuRegistry.createBounty(
      "https://www.youtube.com/watch?v=o5uGF259Nw0",
      "Likes",
      1000,
      parseEther("0.1")
    )
    await res.wait(1)
    const bountyId = await revnuRegistry.getLatestBountyId()
    console.log(`Created Bounty ID: ${bountyId}`)
    currentBountyId = bountyId

    let latestBounty = await revnuRegistry.bountyRegistry(bountyId)
    console.log(latestBounty.toString())

    // Log allowance again
    const allowance2 = await revnuToken.allowance(
      await revnuToken.signer.getAddress(),
      revnuRegistry.address
    )
    console.log(`Allowance Checkpoint #2: ${formatEther(allowance2.toString())}`)
  })

  it("Claim a bounty", async () => {
    // Get current bounty
    let latestBountyId = await revnuRegistry.getLatestBountyId()
    console.log(`Current Bounty ID: ${latestBountyId}`)
    let latestBounty = await revnuRegistry.bountyRegistry(latestBountyId)
    console.log("Latest bounty: ", latestBounty.toString())

    const res = await revnuRegistry.claimBounty(
      latestBountyId,
      "asasdaklsd23423ak3242dasda5B38Da6a701c568545dCfcB03FcB875f56beddC4"
    )
    await res.wait(1)
    const claimId = await revnuRegistry.getLatestClaimId()
    console.log(`Claim ID: ${claimId}`)

    let latestClaim = await revnuRegistry.claimRegistry(claimId)
    console.log(latestClaim.toString())
  })
})
