import { gql } from '@apollo/client';

export const AUCTION_QUERY = `
query ($auctionStatusFilter: AuctionFilter) {
  chronicle(id: "ChronicleKey"){
    curAuctionId
    curBlockNum
  }
  auctions (filter: $auctionStatusFilter, first: 1) {
    nodes {
      id
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
