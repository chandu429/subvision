export const CHRONICLE_QUERY = `
query {
  chronicle(id: "ChronicleKey"){
    curAuctionId
    curBlockNum
    updatedAt
  }
}
`;

export const PARACHAIN_QUERY = `
query {
  parachains (filter: { deregistered: {equalTo: false} }, orderBy: UPDATED_AT_DESC){
    nodes {
      id
      paraId
      manager
      createdAt
      funds (first: 1, orderBy: UPDATED_AT_DESC) {
        nodes {
          id
        }
      }
      leases (filter: { hasWon: { equalTo: true } }, orderBy: FIRST_LEASE_ASC){
        nodes {
          firstLease
          lastLease
          winningResultBlock
          winningAmount
          winningResultBlock
        }
      }
    }
  }
}
`;

export const AUCTION_QUERY = `
query ($auctionStatusFilter: AuctionFilter) {
  parachainLeases (filter: { hasWon: {equalTo: true}}) {
    nodes {
      id
      parachain {
        ...parachainFields
      }
      firstLease
      lastLease
      winningAmount
      winningResultBlock
    }
  }

  auctions (filter: $auctionStatusFilter, first: 1) {
    nodes {
      id
      blockNum
      slotsStart
      slotsEnd
      status
      leaseStart
      leaseEnd
      closingEnd
      closingStart
      latestBids: bids (orderBy: BLOCK_NUM_DESC) {
        nodes {
          ...bidParachainFields
        }
      }
      parachainLeases (filter: {activeForAuction: {isNull: false}}){
        nodes {
          id
          paraId
          leaseRange
          numBlockWon
          firstLease
          lastLease
          latestBidAmount
          winningAmount
          winningResultBlock
          wonBidFrom
        }
      }
    }
  }
}

fragment bidParachainFields on Bid {
  id
  bidder
  firstSlot
  lastSlot
  amount
  parachain {
    ...parachainFields
  }
  isCrowdloan
  createdAt
}

fragment parachainFields on Parachain {
  id
  manager
  paraId
  deposit
  creationBlock
  createdAt
}
`;

export const CROWDLOAN_QUERY = `
query {
  crowdloans(orderBy: BLOCK_NUM_DESC) {
    nodes {
      id
      parachain {
        paraId
        manager
      }
      retiring
      depositor
      verifier
      cap
      raised
      firstSlot
      lastSlot
      lockExpiredBlock
      blockNum
      createdAt
    }
  }
}
`;

export const CONTRIBUTORS_QUERY = `
query ($fundId: String!, $contributionFilter: ContributionFilter!, $after: Cursor, $before: Cursor) {
  crowdloan (id: $fundId) {
    id
    cap
    raised
    lockExpiredBlock,
    retiring
  }
	contributions (filter: $contributionFilter, orderBy: BLOCK_NUM_DESC, first: 20, after: $after, before: $before) {
    nodes {
      id
      account
      amount
      createdAt
      blockNum
      parachain {
        paraId
        manager
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
`;
