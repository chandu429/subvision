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
  parachains (filter: { deregistered: {equalTo: false} }){
    nodes {
      id
      paraId
      manager
      createdAt
      funds (first: 1, orderBy: BLOCK_NUM_DESC) {
        nodes {
          id
        }
      }
      leased (first: 1, orderBy: BLOCK_NUM_DESC){
        nodes {
          firstSlot
          lastSlot
        }
      }
    }
  }
}
`;

export const AUCTION_QUERY = `
query ($auctionStatusFilter: AuctionFilter) {
  parachainLeases {
    nodes {
      id
      parachain {
        paraId
      }
      firstSlot
      lastSlot
      winningAmount
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
      winningBids: bids (filter: {winningAuction: { isNull: false }}) {
        nodes {
          ...bidParachainFields
        }
      }
      loseBids: bids (filter: {winningAuction: {isNull: true }}) {
        nodes {
          ...bidParachainFields
        }
      }
      participateParachain: parachains {
        nodes {
          parachain {
            ...parachainFields
          }
          blockNum
          firstSlot
          lastSlot
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
