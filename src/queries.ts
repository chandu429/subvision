import { gql } from '@apollo/client';

export const CHRONICLE_QUERY = `
query {
  chronicle(id: "ChronicleKey"){
    curAuctionId
    curBlockNum
    updatedAt
  }
}
`;

export const AUCTION_QUERY = `
query ($auctionStatusFilter: AuctionFilter) {
  parachainLeaseds {
    nodes {
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
      lockExpiredBlock
      blockNum
      createdAt
    }
  }
}
`;

export const CONTRIBUTORS_QUERY = `
query ($fundId: String!, $fundIdFilter: ContributionFilter!) {
  crowdloan (id: $fundId) {
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
    lockExpiredBlock
    createdAt
  }
	contributions (filter: $fundIdFilter, orderBy: BLOCK_NUM_DESC) {
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
