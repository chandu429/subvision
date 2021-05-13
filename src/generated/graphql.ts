export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: any;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: any;
};

export type Auction = Node & {
  __typename?: 'Auction';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  blockNum: Scalars['Int'];
  status: Scalars['String'];
  leaseStart?: Maybe<Scalars['Int']>;
  slotsStart: Scalars['Int'];
  leaseEnd?: Maybe<Scalars['Int']>;
  slotsEnd: Scalars['Int'];
  closingStart: Scalars['Int'];
  closingEnd: Scalars['Int'];
  resultBlock?: Maybe<Scalars['Int']>;
  ongoing: Scalars['Boolean'];
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
  /** Reads and enables pagination through a set of `Chronicle`. */
  chroniclesByCurAuctionId: ChroniclesConnection;
  /** Reads and enables pagination through a set of `AuctionParachain`. */
  parachains: AuctionParachainsConnection;
  /** Reads and enables pagination through a set of `Bid`. */
  bids: BidsConnection;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
  /** Reads and enables pagination through a set of `Parachain`. */
  parachainsByAuctionParachainAuctionIdAndParachainId: AuctionParachainsByAuctionParachainAuctionIdAndParachainIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Parachain`. */
  parachainsByBidAuctionIdAndParachainId: AuctionParachainsByBidAuctionIdAndParachainIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Crowdloan`. */
  crowdloansByBidAuctionIdAndFundId: AuctionCrowdloansByBidAuctionIdAndFundIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Parachain`. */
  parachainsByWinningBlockAuctionIdAndParachainId: AuctionParachainsByWinningBlockAuctionIdAndParachainIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Bid`. */
  bidsByWinningBlockAuctionIdAndBidId: AuctionBidsByWinningBlockAuctionIdAndBidIdManyToManyConnection;
};


export type AuctionChroniclesByCurAuctionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ChroniclesOrderBy>>;
  filter?: Maybe<ChronicleFilter>;
};


export type AuctionParachainsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionParachainsOrderBy>>;
  filter?: Maybe<AuctionParachainFilter>;
};


export type AuctionBidsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};


export type AuctionWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};


export type AuctionParachainsByAuctionParachainAuctionIdAndParachainIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainsOrderBy>>;
  filter?: Maybe<ParachainFilter>;
};


export type AuctionParachainsByBidAuctionIdAndParachainIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainsOrderBy>>;
  filter?: Maybe<ParachainFilter>;
};


export type AuctionCrowdloansByBidAuctionIdAndFundIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CrowdloansOrderBy>>;
  filter?: Maybe<CrowdloanFilter>;
};


export type AuctionParachainsByWinningBlockAuctionIdAndParachainIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainsOrderBy>>;
  filter?: Maybe<ParachainFilter>;
};


export type AuctionBidsByWinningBlockAuctionIdAndBidIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};

/** A connection to a list of `Bid` values, with data from `WinningBlock`. */
export type AuctionBidsByWinningBlockAuctionIdAndBidIdManyToManyConnection = {
  __typename?: 'AuctionBidsByWinningBlockAuctionIdAndBidIdManyToManyConnection';
  /** A list of `Bid` objects. */
  nodes: Array<Maybe<Bid>>;
  /** A list of edges which contains the `Bid`, info from the `WinningBlock`, and the cursor to aid in pagination. */
  edges: Array<AuctionBidsByWinningBlockAuctionIdAndBidIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Bid` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Bid` edge in the connection, with data from `WinningBlock`. */
export type AuctionBidsByWinningBlockAuctionIdAndBidIdManyToManyEdge = {
  __typename?: 'AuctionBidsByWinningBlockAuctionIdAndBidIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Bid` at the end of the edge. */
  node?: Maybe<Bid>;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
};


/** A `Bid` edge in the connection, with data from `WinningBlock`. */
export type AuctionBidsByWinningBlockAuctionIdAndBidIdManyToManyEdgeWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};

/** A connection to a list of `Crowdloan` values, with data from `Bid`. */
export type AuctionCrowdloansByBidAuctionIdAndFundIdManyToManyConnection = {
  __typename?: 'AuctionCrowdloansByBidAuctionIdAndFundIdManyToManyConnection';
  /** A list of `Crowdloan` objects. */
  nodes: Array<Maybe<Crowdloan>>;
  /** A list of edges which contains the `Crowdloan`, info from the `Bid`, and the cursor to aid in pagination. */
  edges: Array<AuctionCrowdloansByBidAuctionIdAndFundIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Crowdloan` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Crowdloan` edge in the connection, with data from `Bid`. */
export type AuctionCrowdloansByBidAuctionIdAndFundIdManyToManyEdge = {
  __typename?: 'AuctionCrowdloansByBidAuctionIdAndFundIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Crowdloan` at the end of the edge. */
  node?: Maybe<Crowdloan>;
  /** Reads and enables pagination through a set of `Bid`. */
  bidsByFundId: BidsConnection;
};


/** A `Crowdloan` edge in the connection, with data from `Bid`. */
export type AuctionCrowdloansByBidAuctionIdAndFundIdManyToManyEdgeBidsByFundIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};

/** A filter to be used against `Auction` object types. All fields are combined with a logical ‘and.’ */
export type AuctionFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `blockNum` field. */
  blockNum?: Maybe<IntFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<StringFilter>;
  /** Filter by the object’s `leaseStart` field. */
  leaseStart?: Maybe<IntFilter>;
  /** Filter by the object’s `slotsStart` field. */
  slotsStart?: Maybe<IntFilter>;
  /** Filter by the object’s `leaseEnd` field. */
  leaseEnd?: Maybe<IntFilter>;
  /** Filter by the object’s `slotsEnd` field. */
  slotsEnd?: Maybe<IntFilter>;
  /** Filter by the object’s `closingStart` field. */
  closingStart?: Maybe<IntFilter>;
  /** Filter by the object’s `closingEnd` field. */
  closingEnd?: Maybe<IntFilter>;
  /** Filter by the object’s `resultBlock` field. */
  resultBlock?: Maybe<IntFilter>;
  /** Filter by the object’s `ongoing` field. */
  ongoing?: Maybe<BooleanFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<AuctionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<AuctionFilter>>;
  /** Negates the expression. */
  not?: Maybe<AuctionFilter>;
};

export type AuctionParachain = Node & {
  __typename?: 'AuctionParachain';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  auctionId: Scalars['String'];
  parachainId: Scalars['String'];
  blockNum: Scalars['Int'];
  createdAt: Scalars['Datetime'];
  firstSlot: Scalars['Int'];
  lastSlot: Scalars['Int'];
  updatedAt: Scalars['Datetime'];
  /** Reads a single `Auction` that is related to this `AuctionParachain`. */
  auction?: Maybe<Auction>;
  /** Reads a single `Parachain` that is related to this `AuctionParachain`. */
  parachain?: Maybe<Parachain>;
};

/** A filter to be used against `AuctionParachain` object types. All fields are combined with a logical ‘and.’ */
export type AuctionParachainFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `auctionId` field. */
  auctionId?: Maybe<StringFilter>;
  /** Filter by the object’s `parachainId` field. */
  parachainId?: Maybe<StringFilter>;
  /** Filter by the object’s `blockNum` field. */
  blockNum?: Maybe<IntFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `firstSlot` field. */
  firstSlot?: Maybe<IntFilter>;
  /** Filter by the object’s `lastSlot` field. */
  lastSlot?: Maybe<IntFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<AuctionParachainFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<AuctionParachainFilter>>;
  /** Negates the expression. */
  not?: Maybe<AuctionParachainFilter>;
};

/** A connection to a list of `Parachain` values, with data from `AuctionParachain`. */
export type AuctionParachainsByAuctionParachainAuctionIdAndParachainIdManyToManyConnection = {
  __typename?: 'AuctionParachainsByAuctionParachainAuctionIdAndParachainIdManyToManyConnection';
  /** A list of `Parachain` objects. */
  nodes: Array<Maybe<Parachain>>;
  /** A list of edges which contains the `Parachain`, info from the `AuctionParachain`, and the cursor to aid in pagination. */
  edges: Array<AuctionParachainsByAuctionParachainAuctionIdAndParachainIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Parachain` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Parachain` edge in the connection, with data from `AuctionParachain`. */
export type AuctionParachainsByAuctionParachainAuctionIdAndParachainIdManyToManyEdge = {
  __typename?: 'AuctionParachainsByAuctionParachainAuctionIdAndParachainIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Parachain` at the end of the edge. */
  node?: Maybe<Parachain>;
  /** Reads and enables pagination through a set of `AuctionParachain`. */
  auctionParachains: AuctionParachainsConnection;
};


/** A `Parachain` edge in the connection, with data from `AuctionParachain`. */
export type AuctionParachainsByAuctionParachainAuctionIdAndParachainIdManyToManyEdgeAuctionParachainsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionParachainsOrderBy>>;
  filter?: Maybe<AuctionParachainFilter>;
};

/** A connection to a list of `Parachain` values, with data from `Bid`. */
export type AuctionParachainsByBidAuctionIdAndParachainIdManyToManyConnection = {
  __typename?: 'AuctionParachainsByBidAuctionIdAndParachainIdManyToManyConnection';
  /** A list of `Parachain` objects. */
  nodes: Array<Maybe<Parachain>>;
  /** A list of edges which contains the `Parachain`, info from the `Bid`, and the cursor to aid in pagination. */
  edges: Array<AuctionParachainsByBidAuctionIdAndParachainIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Parachain` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Parachain` edge in the connection, with data from `Bid`. */
export type AuctionParachainsByBidAuctionIdAndParachainIdManyToManyEdge = {
  __typename?: 'AuctionParachainsByBidAuctionIdAndParachainIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Parachain` at the end of the edge. */
  node?: Maybe<Parachain>;
  /** Reads and enables pagination through a set of `Bid`. */
  bids: BidsConnection;
};


/** A `Parachain` edge in the connection, with data from `Bid`. */
export type AuctionParachainsByBidAuctionIdAndParachainIdManyToManyEdgeBidsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};

/** A connection to a list of `Parachain` values, with data from `WinningBlock`. */
export type AuctionParachainsByWinningBlockAuctionIdAndParachainIdManyToManyConnection = {
  __typename?: 'AuctionParachainsByWinningBlockAuctionIdAndParachainIdManyToManyConnection';
  /** A list of `Parachain` objects. */
  nodes: Array<Maybe<Parachain>>;
  /** A list of edges which contains the `Parachain`, info from the `WinningBlock`, and the cursor to aid in pagination. */
  edges: Array<AuctionParachainsByWinningBlockAuctionIdAndParachainIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Parachain` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Parachain` edge in the connection, with data from `WinningBlock`. */
export type AuctionParachainsByWinningBlockAuctionIdAndParachainIdManyToManyEdge = {
  __typename?: 'AuctionParachainsByWinningBlockAuctionIdAndParachainIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Parachain` at the end of the edge. */
  node?: Maybe<Parachain>;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
};


/** A `Parachain` edge in the connection, with data from `WinningBlock`. */
export type AuctionParachainsByWinningBlockAuctionIdAndParachainIdManyToManyEdgeWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};

/** A connection to a list of `AuctionParachain` values. */
export type AuctionParachainsConnection = {
  __typename?: 'AuctionParachainsConnection';
  /** A list of `AuctionParachain` objects. */
  nodes: Array<Maybe<AuctionParachain>>;
  /** A list of edges which contains the `AuctionParachain` and cursor to aid in pagination. */
  edges: Array<AuctionParachainsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `AuctionParachain` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `AuctionParachain` edge in the connection. */
export type AuctionParachainsEdge = {
  __typename?: 'AuctionParachainsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `AuctionParachain` at the end of the edge. */
  node?: Maybe<AuctionParachain>;
};

/** Methods to use when ordering `AuctionParachain`. */
export enum AuctionParachainsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  AuctionIdAsc = 'AUCTION_ID_ASC',
  AuctionIdDesc = 'AUCTION_ID_DESC',
  ParachainIdAsc = 'PARACHAIN_ID_ASC',
  ParachainIdDesc = 'PARACHAIN_ID_DESC',
  BlockNumAsc = 'BLOCK_NUM_ASC',
  BlockNumDesc = 'BLOCK_NUM_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  FirstSlotAsc = 'FIRST_SLOT_ASC',
  FirstSlotDesc = 'FIRST_SLOT_DESC',
  LastSlotAsc = 'LAST_SLOT_ASC',
  LastSlotDesc = 'LAST_SLOT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Auction` values. */
export type AuctionsConnection = {
  __typename?: 'AuctionsConnection';
  /** A list of `Auction` objects. */
  nodes: Array<Maybe<Auction>>;
  /** A list of edges which contains the `Auction` and cursor to aid in pagination. */
  edges: Array<AuctionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Auction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Auction` edge in the connection. */
export type AuctionsEdge = {
  __typename?: 'AuctionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Auction` at the end of the edge. */
  node?: Maybe<Auction>;
};

/** Methods to use when ordering `Auction`. */
export enum AuctionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  BlockNumAsc = 'BLOCK_NUM_ASC',
  BlockNumDesc = 'BLOCK_NUM_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  LeaseStartAsc = 'LEASE_START_ASC',
  LeaseStartDesc = 'LEASE_START_DESC',
  SlotsStartAsc = 'SLOTS_START_ASC',
  SlotsStartDesc = 'SLOTS_START_DESC',
  LeaseEndAsc = 'LEASE_END_ASC',
  LeaseEndDesc = 'LEASE_END_DESC',
  SlotsEndAsc = 'SLOTS_END_ASC',
  SlotsEndDesc = 'SLOTS_END_DESC',
  ClosingStartAsc = 'CLOSING_START_ASC',
  ClosingStartDesc = 'CLOSING_START_DESC',
  ClosingEndAsc = 'CLOSING_END_ASC',
  ClosingEndDesc = 'CLOSING_END_DESC',
  ResultBlockAsc = 'RESULT_BLOCK_ASC',
  ResultBlockDesc = 'RESULT_BLOCK_DESC',
  OngoingAsc = 'ONGOING_ASC',
  OngoingDesc = 'ONGOING_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type Bid = Node & {
  __typename?: 'Bid';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  auctionId: Scalars['String'];
  winningAuction?: Maybe<Scalars['Int']>;
  blockNum: Scalars['Int'];
  parachainId: Scalars['String'];
  isCrowdloan: Scalars['Boolean'];
  amount: Scalars['BigFloat'];
  fundId?: Maybe<Scalars['String']>;
  firstSlot: Scalars['Int'];
  lastSlot: Scalars['Int'];
  bidder?: Maybe<Scalars['String']>;
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
  /** Reads a single `Auction` that is related to this `Bid`. */
  auction?: Maybe<Auction>;
  /** Reads a single `Parachain` that is related to this `Bid`. */
  parachain?: Maybe<Parachain>;
  /** Reads a single `Crowdloan` that is related to this `Bid`. */
  fund?: Maybe<Crowdloan>;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
  /** Reads and enables pagination through a set of `Auction`. */
  auctionsByWinningBlockBidIdAndAuctionId: BidAuctionsByWinningBlockBidIdAndAuctionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Parachain`. */
  parachainsByWinningBlockBidIdAndParachainId: BidParachainsByWinningBlockBidIdAndParachainIdManyToManyConnection;
};


export type BidWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};


export type BidAuctionsByWinningBlockBidIdAndAuctionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionsOrderBy>>;
  filter?: Maybe<AuctionFilter>;
};


export type BidParachainsByWinningBlockBidIdAndParachainIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainsOrderBy>>;
  filter?: Maybe<ParachainFilter>;
};

/** A connection to a list of `Auction` values, with data from `WinningBlock`. */
export type BidAuctionsByWinningBlockBidIdAndAuctionIdManyToManyConnection = {
  __typename?: 'BidAuctionsByWinningBlockBidIdAndAuctionIdManyToManyConnection';
  /** A list of `Auction` objects. */
  nodes: Array<Maybe<Auction>>;
  /** A list of edges which contains the `Auction`, info from the `WinningBlock`, and the cursor to aid in pagination. */
  edges: Array<BidAuctionsByWinningBlockBidIdAndAuctionIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Auction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Auction` edge in the connection, with data from `WinningBlock`. */
export type BidAuctionsByWinningBlockBidIdAndAuctionIdManyToManyEdge = {
  __typename?: 'BidAuctionsByWinningBlockBidIdAndAuctionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Auction` at the end of the edge. */
  node?: Maybe<Auction>;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
};


/** A `Auction` edge in the connection, with data from `WinningBlock`. */
export type BidAuctionsByWinningBlockBidIdAndAuctionIdManyToManyEdgeWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};

/** A filter to be used against `Bid` object types. All fields are combined with a logical ‘and.’ */
export type BidFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `auctionId` field. */
  auctionId?: Maybe<StringFilter>;
  /** Filter by the object’s `winningAuction` field. */
  winningAuction?: Maybe<IntFilter>;
  /** Filter by the object’s `blockNum` field. */
  blockNum?: Maybe<IntFilter>;
  /** Filter by the object’s `parachainId` field. */
  parachainId?: Maybe<StringFilter>;
  /** Filter by the object’s `isCrowdloan` field. */
  isCrowdloan?: Maybe<BooleanFilter>;
  /** Filter by the object’s `amount` field. */
  amount?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `fundId` field. */
  fundId?: Maybe<StringFilter>;
  /** Filter by the object’s `firstSlot` field. */
  firstSlot?: Maybe<IntFilter>;
  /** Filter by the object’s `lastSlot` field. */
  lastSlot?: Maybe<IntFilter>;
  /** Filter by the object’s `bidder` field. */
  bidder?: Maybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<BidFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<BidFilter>>;
  /** Negates the expression. */
  not?: Maybe<BidFilter>;
};

/** A connection to a list of `Parachain` values, with data from `WinningBlock`. */
export type BidParachainsByWinningBlockBidIdAndParachainIdManyToManyConnection = {
  __typename?: 'BidParachainsByWinningBlockBidIdAndParachainIdManyToManyConnection';
  /** A list of `Parachain` objects. */
  nodes: Array<Maybe<Parachain>>;
  /** A list of edges which contains the `Parachain`, info from the `WinningBlock`, and the cursor to aid in pagination. */
  edges: Array<BidParachainsByWinningBlockBidIdAndParachainIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Parachain` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Parachain` edge in the connection, with data from `WinningBlock`. */
export type BidParachainsByWinningBlockBidIdAndParachainIdManyToManyEdge = {
  __typename?: 'BidParachainsByWinningBlockBidIdAndParachainIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Parachain` at the end of the edge. */
  node?: Maybe<Parachain>;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
};


/** A `Parachain` edge in the connection, with data from `WinningBlock`. */
export type BidParachainsByWinningBlockBidIdAndParachainIdManyToManyEdgeWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};

/** A connection to a list of `Bid` values. */
export type BidsConnection = {
  __typename?: 'BidsConnection';
  /** A list of `Bid` objects. */
  nodes: Array<Maybe<Bid>>;
  /** A list of edges which contains the `Bid` and cursor to aid in pagination. */
  edges: Array<BidsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Bid` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Bid` edge in the connection. */
export type BidsEdge = {
  __typename?: 'BidsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Bid` at the end of the edge. */
  node?: Maybe<Bid>;
};

/** Methods to use when ordering `Bid`. */
export enum BidsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  AuctionIdAsc = 'AUCTION_ID_ASC',
  AuctionIdDesc = 'AUCTION_ID_DESC',
  WinningAuctionAsc = 'WINNING_AUCTION_ASC',
  WinningAuctionDesc = 'WINNING_AUCTION_DESC',
  BlockNumAsc = 'BLOCK_NUM_ASC',
  BlockNumDesc = 'BLOCK_NUM_DESC',
  ParachainIdAsc = 'PARACHAIN_ID_ASC',
  ParachainIdDesc = 'PARACHAIN_ID_DESC',
  IsCrowdloanAsc = 'IS_CROWDLOAN_ASC',
  IsCrowdloanDesc = 'IS_CROWDLOAN_DESC',
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  FundIdAsc = 'FUND_ID_ASC',
  FundIdDesc = 'FUND_ID_DESC',
  FirstSlotAsc = 'FIRST_SLOT_ASC',
  FirstSlotDesc = 'FIRST_SLOT_DESC',
  LastSlotAsc = 'LAST_SLOT_ASC',
  LastSlotDesc = 'LAST_SLOT_DESC',
  BidderAsc = 'BIDDER_ASC',
  BidderDesc = 'BIDDER_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}


/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['BigFloat']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['BigFloat']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['BigFloat']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['BigFloat']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['BigFloat']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['BigFloat']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['BigFloat']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['BigFloat']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['BigFloat']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['BigFloat']>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Boolean']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Boolean']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Boolean']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Boolean']>;
};

export type Chronicle = Node & {
  __typename?: 'Chronicle';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  curAuctionId?: Maybe<Scalars['String']>;
  curBlockNum?: Maybe<Scalars['Int']>;
  curLease?: Maybe<Scalars['Int']>;
  curLeaseStart?: Maybe<Scalars['Int']>;
  curLeaseEnd?: Maybe<Scalars['Int']>;
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
  /** Reads a single `Auction` that is related to this `Chronicle`. */
  curAuction?: Maybe<Auction>;
  /** Reads and enables pagination through a set of `Parachain`. */
  parachains: ParachainsConnection;
};


export type ChronicleParachainsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainsOrderBy>>;
  filter?: Maybe<ParachainFilter>;
};

/** A filter to be used against `Chronicle` object types. All fields are combined with a logical ‘and.’ */
export type ChronicleFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `curAuctionId` field. */
  curAuctionId?: Maybe<StringFilter>;
  /** Filter by the object’s `curBlockNum` field. */
  curBlockNum?: Maybe<IntFilter>;
  /** Filter by the object’s `curLease` field. */
  curLease?: Maybe<IntFilter>;
  /** Filter by the object’s `curLeaseStart` field. */
  curLeaseStart?: Maybe<IntFilter>;
  /** Filter by the object’s `curLeaseEnd` field. */
  curLeaseEnd?: Maybe<IntFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ChronicleFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ChronicleFilter>>;
  /** Negates the expression. */
  not?: Maybe<ChronicleFilter>;
};

/** A connection to a list of `Chronicle` values. */
export type ChroniclesConnection = {
  __typename?: 'ChroniclesConnection';
  /** A list of `Chronicle` objects. */
  nodes: Array<Maybe<Chronicle>>;
  /** A list of edges which contains the `Chronicle` and cursor to aid in pagination. */
  edges: Array<ChroniclesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Chronicle` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Chronicle` edge in the connection. */
export type ChroniclesEdge = {
  __typename?: 'ChroniclesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Chronicle` at the end of the edge. */
  node?: Maybe<Chronicle>;
};

/** Methods to use when ordering `Chronicle`. */
export enum ChroniclesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CurAuctionIdAsc = 'CUR_AUCTION_ID_ASC',
  CurAuctionIdDesc = 'CUR_AUCTION_ID_DESC',
  CurBlockNumAsc = 'CUR_BLOCK_NUM_ASC',
  CurBlockNumDesc = 'CUR_BLOCK_NUM_DESC',
  CurLeaseAsc = 'CUR_LEASE_ASC',
  CurLeaseDesc = 'CUR_LEASE_DESC',
  CurLeaseStartAsc = 'CUR_LEASE_START_ASC',
  CurLeaseStartDesc = 'CUR_LEASE_START_DESC',
  CurLeaseEndAsc = 'CUR_LEASE_END_ASC',
  CurLeaseEndDesc = 'CUR_LEASE_END_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type Contribution = Node & {
  __typename?: 'Contribution';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  account: Scalars['String'];
  parachainId: Scalars['String'];
  fundId: Scalars['String'];
  amount: Scalars['BigFloat'];
  blockNum: Scalars['Int'];
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
  /** Reads a single `Parachain` that is related to this `Contribution`. */
  parachain?: Maybe<Parachain>;
  /** Reads a single `Crowdloan` that is related to this `Contribution`. */
  fund?: Maybe<Crowdloan>;
};

/** A filter to be used against `Contribution` object types. All fields are combined with a logical ‘and.’ */
export type ContributionFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `account` field. */
  account?: Maybe<StringFilter>;
  /** Filter by the object’s `parachainId` field. */
  parachainId?: Maybe<StringFilter>;
  /** Filter by the object’s `fundId` field. */
  fundId?: Maybe<StringFilter>;
  /** Filter by the object’s `amount` field. */
  amount?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `blockNum` field. */
  blockNum?: Maybe<IntFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ContributionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ContributionFilter>>;
  /** Negates the expression. */
  not?: Maybe<ContributionFilter>;
};

/** A connection to a list of `Contribution` values. */
export type ContributionsConnection = {
  __typename?: 'ContributionsConnection';
  /** A list of `Contribution` objects. */
  nodes: Array<Maybe<Contribution>>;
  /** A list of edges which contains the `Contribution` and cursor to aid in pagination. */
  edges: Array<ContributionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Contribution` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Contribution` edge in the connection. */
export type ContributionsEdge = {
  __typename?: 'ContributionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Contribution` at the end of the edge. */
  node?: Maybe<Contribution>;
};

/** Methods to use when ordering `Contribution`. */
export enum ContributionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  AccountAsc = 'ACCOUNT_ASC',
  AccountDesc = 'ACCOUNT_DESC',
  ParachainIdAsc = 'PARACHAIN_ID_ASC',
  ParachainIdDesc = 'PARACHAIN_ID_DESC',
  FundIdAsc = 'FUND_ID_ASC',
  FundIdDesc = 'FUND_ID_DESC',
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  BlockNumAsc = 'BLOCK_NUM_ASC',
  BlockNumDesc = 'BLOCK_NUM_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type Crowdloan = Node & {
  __typename?: 'Crowdloan';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  parachainId: Scalars['String'];
  retiring: Scalars['Boolean'];
  depositor: Scalars['String'];
  verifier?: Maybe<Scalars['String']>;
  cap: Scalars['BigFloat'];
  raised: Scalars['BigFloat'];
  lockExpiredBlock: Scalars['Int'];
  blockNum?: Maybe<Scalars['Int']>;
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
  /** Reads a single `Parachain` that is related to this `Crowdloan`. */
  parachain?: Maybe<Parachain>;
  /** Reads and enables pagination through a set of `Bid`. */
  bidsByFundId: BidsConnection;
  /** Reads and enables pagination through a set of `Contribution`. */
  contributionsByFundId: ContributionsConnection;
  /** Reads and enables pagination through a set of `Auction`. */
  auctionsByBidFundIdAndAuctionId: CrowdloanAuctionsByBidFundIdAndAuctionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Parachain`. */
  parachainsByBidFundIdAndParachainId: CrowdloanParachainsByBidFundIdAndParachainIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Parachain`. */
  parachainsByContributionFundIdAndParachainId: CrowdloanParachainsByContributionFundIdAndParachainIdManyToManyConnection;
};


export type CrowdloanBidsByFundIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};


export type CrowdloanContributionsByFundIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContributionsOrderBy>>;
  filter?: Maybe<ContributionFilter>;
};


export type CrowdloanAuctionsByBidFundIdAndAuctionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionsOrderBy>>;
  filter?: Maybe<AuctionFilter>;
};


export type CrowdloanParachainsByBidFundIdAndParachainIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainsOrderBy>>;
  filter?: Maybe<ParachainFilter>;
};


export type CrowdloanParachainsByContributionFundIdAndParachainIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainsOrderBy>>;
  filter?: Maybe<ParachainFilter>;
};

/** A connection to a list of `Auction` values, with data from `Bid`. */
export type CrowdloanAuctionsByBidFundIdAndAuctionIdManyToManyConnection = {
  __typename?: 'CrowdloanAuctionsByBidFundIdAndAuctionIdManyToManyConnection';
  /** A list of `Auction` objects. */
  nodes: Array<Maybe<Auction>>;
  /** A list of edges which contains the `Auction`, info from the `Bid`, and the cursor to aid in pagination. */
  edges: Array<CrowdloanAuctionsByBidFundIdAndAuctionIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Auction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Auction` edge in the connection, with data from `Bid`. */
export type CrowdloanAuctionsByBidFundIdAndAuctionIdManyToManyEdge = {
  __typename?: 'CrowdloanAuctionsByBidFundIdAndAuctionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Auction` at the end of the edge. */
  node?: Maybe<Auction>;
  /** Reads and enables pagination through a set of `Bid`. */
  bids: BidsConnection;
};


/** A `Auction` edge in the connection, with data from `Bid`. */
export type CrowdloanAuctionsByBidFundIdAndAuctionIdManyToManyEdgeBidsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};

/** A filter to be used against `Crowdloan` object types. All fields are combined with a logical ‘and.’ */
export type CrowdloanFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `parachainId` field. */
  parachainId?: Maybe<StringFilter>;
  /** Filter by the object’s `retiring` field. */
  retiring?: Maybe<BooleanFilter>;
  /** Filter by the object’s `depositor` field. */
  depositor?: Maybe<StringFilter>;
  /** Filter by the object’s `verifier` field. */
  verifier?: Maybe<StringFilter>;
  /** Filter by the object’s `cap` field. */
  cap?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `raised` field. */
  raised?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `lockExpiredBlock` field. */
  lockExpiredBlock?: Maybe<IntFilter>;
  /** Filter by the object’s `blockNum` field. */
  blockNum?: Maybe<IntFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<CrowdloanFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<CrowdloanFilter>>;
  /** Negates the expression. */
  not?: Maybe<CrowdloanFilter>;
};

/** A connection to a list of `Parachain` values, with data from `Bid`. */
export type CrowdloanParachainsByBidFundIdAndParachainIdManyToManyConnection = {
  __typename?: 'CrowdloanParachainsByBidFundIdAndParachainIdManyToManyConnection';
  /** A list of `Parachain` objects. */
  nodes: Array<Maybe<Parachain>>;
  /** A list of edges which contains the `Parachain`, info from the `Bid`, and the cursor to aid in pagination. */
  edges: Array<CrowdloanParachainsByBidFundIdAndParachainIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Parachain` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Parachain` edge in the connection, with data from `Bid`. */
export type CrowdloanParachainsByBidFundIdAndParachainIdManyToManyEdge = {
  __typename?: 'CrowdloanParachainsByBidFundIdAndParachainIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Parachain` at the end of the edge. */
  node?: Maybe<Parachain>;
  /** Reads and enables pagination through a set of `Bid`. */
  bids: BidsConnection;
};


/** A `Parachain` edge in the connection, with data from `Bid`. */
export type CrowdloanParachainsByBidFundIdAndParachainIdManyToManyEdgeBidsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};

/** A connection to a list of `Parachain` values, with data from `Contribution`. */
export type CrowdloanParachainsByContributionFundIdAndParachainIdManyToManyConnection = {
  __typename?: 'CrowdloanParachainsByContributionFundIdAndParachainIdManyToManyConnection';
  /** A list of `Parachain` objects. */
  nodes: Array<Maybe<Parachain>>;
  /** A list of edges which contains the `Parachain`, info from the `Contribution`, and the cursor to aid in pagination. */
  edges: Array<CrowdloanParachainsByContributionFundIdAndParachainIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Parachain` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Parachain` edge in the connection, with data from `Contribution`. */
export type CrowdloanParachainsByContributionFundIdAndParachainIdManyToManyEdge = {
  __typename?: 'CrowdloanParachainsByContributionFundIdAndParachainIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Parachain` at the end of the edge. */
  node?: Maybe<Parachain>;
  /** Reads and enables pagination through a set of `Contribution`. */
  contributions: ContributionsConnection;
};


/** A `Parachain` edge in the connection, with data from `Contribution`. */
export type CrowdloanParachainsByContributionFundIdAndParachainIdManyToManyEdgeContributionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContributionsOrderBy>>;
  filter?: Maybe<ContributionFilter>;
};

export type CrowdloanSequence = Node & {
  __typename?: 'CrowdloanSequence';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  curIndex: Scalars['Int'];
  bumpAt?: Maybe<Scalars['String']>;
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
};

/** A filter to be used against `CrowdloanSequence` object types. All fields are combined with a logical ‘and.’ */
export type CrowdloanSequenceFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `curIndex` field. */
  curIndex?: Maybe<IntFilter>;
  /** Filter by the object’s `bumpAt` field. */
  bumpAt?: Maybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<CrowdloanSequenceFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<CrowdloanSequenceFilter>>;
  /** Negates the expression. */
  not?: Maybe<CrowdloanSequenceFilter>;
};

/** A connection to a list of `CrowdloanSequence` values. */
export type CrowdloanSequencesConnection = {
  __typename?: 'CrowdloanSequencesConnection';
  /** A list of `CrowdloanSequence` objects. */
  nodes: Array<Maybe<CrowdloanSequence>>;
  /** A list of edges which contains the `CrowdloanSequence` and cursor to aid in pagination. */
  edges: Array<CrowdloanSequencesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CrowdloanSequence` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `CrowdloanSequence` edge in the connection. */
export type CrowdloanSequencesEdge = {
  __typename?: 'CrowdloanSequencesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `CrowdloanSequence` at the end of the edge. */
  node?: Maybe<CrowdloanSequence>;
};

/** Methods to use when ordering `CrowdloanSequence`. */
export enum CrowdloanSequencesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CurIndexAsc = 'CUR_INDEX_ASC',
  CurIndexDesc = 'CUR_INDEX_DESC',
  BumpAtAsc = 'BUMP_AT_ASC',
  BumpAtDesc = 'BUMP_AT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Crowdloan` values. */
export type CrowdloansConnection = {
  __typename?: 'CrowdloansConnection';
  /** A list of `Crowdloan` objects. */
  nodes: Array<Maybe<Crowdloan>>;
  /** A list of edges which contains the `Crowdloan` and cursor to aid in pagination. */
  edges: Array<CrowdloansEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Crowdloan` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Crowdloan` edge in the connection. */
export type CrowdloansEdge = {
  __typename?: 'CrowdloansEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Crowdloan` at the end of the edge. */
  node?: Maybe<Crowdloan>;
};

/** Methods to use when ordering `Crowdloan`. */
export enum CrowdloansOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ParachainIdAsc = 'PARACHAIN_ID_ASC',
  ParachainIdDesc = 'PARACHAIN_ID_DESC',
  RetiringAsc = 'RETIRING_ASC',
  RetiringDesc = 'RETIRING_DESC',
  DepositorAsc = 'DEPOSITOR_ASC',
  DepositorDesc = 'DEPOSITOR_DESC',
  VerifierAsc = 'VERIFIER_ASC',
  VerifierDesc = 'VERIFIER_DESC',
  CapAsc = 'CAP_ASC',
  CapDesc = 'CAP_DESC',
  RaisedAsc = 'RAISED_ASC',
  RaisedDesc = 'RAISED_DESC',
  LockExpiredBlockAsc = 'LOCK_EXPIRED_BLOCK_ASC',
  LockExpiredBlockDesc = 'LOCK_EXPIRED_BLOCK_DESC',
  BlockNumAsc = 'BLOCK_NUM_ASC',
  BlockNumDesc = 'BLOCK_NUM_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}



/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Datetime']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Datetime']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Datetime']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Datetime']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Datetime']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Datetime']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Datetime']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Datetime']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Datetime']>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Int']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Int']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Int']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Int']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Int']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Int']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Int']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Int']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Int']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Int']>;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
};

export type Parachain = Node & {
  __typename?: 'Parachain';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  paraId: Scalars['Int'];
  createdAt?: Maybe<Scalars['Datetime']>;
  creationBlock?: Maybe<Scalars['Int']>;
  deregistered: Scalars['Boolean'];
  deposit: Scalars['BigFloat'];
  manager: Scalars['String'];
  chronicleId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Datetime'];
  /** Reads a single `Chronicle` that is related to this `Parachain`. */
  chronicle?: Maybe<Chronicle>;
  /** Reads and enables pagination through a set of `Crowdloan`. */
  funds: CrowdloansConnection;
  /** Reads and enables pagination through a set of `ParachainLeased`. */
  leased: ParachainLeasedsConnection;
  /** Reads and enables pagination through a set of `AuctionParachain`. */
  auctionParachains: AuctionParachainsConnection;
  /** Reads and enables pagination through a set of `Bid`. */
  bids: BidsConnection;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
  /** Reads and enables pagination through a set of `Contribution`. */
  contributions: ContributionsConnection;
  /** Reads and enables pagination through a set of `Auction`. */
  auctionsByAuctionParachainParachainIdAndAuctionId: ParachainAuctionsByAuctionParachainParachainIdAndAuctionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Auction`. */
  auctionsByBidParachainIdAndAuctionId: ParachainAuctionsByBidParachainIdAndAuctionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Crowdloan`. */
  crowdloansByBidParachainIdAndFundId: ParachainCrowdloansByBidParachainIdAndFundIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Auction`. */
  auctionsByWinningBlockParachainIdAndAuctionId: ParachainAuctionsByWinningBlockParachainIdAndAuctionIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Bid`. */
  bidsByWinningBlockParachainIdAndBidId: ParachainBidsByWinningBlockParachainIdAndBidIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Crowdloan`. */
  crowdloansByContributionParachainIdAndFundId: ParachainCrowdloansByContributionParachainIdAndFundIdManyToManyConnection;
};


export type ParachainFundsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CrowdloansOrderBy>>;
  filter?: Maybe<CrowdloanFilter>;
};


export type ParachainLeasedArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainLeasedsOrderBy>>;
  filter?: Maybe<ParachainLeasedFilter>;
};


export type ParachainAuctionParachainsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionParachainsOrderBy>>;
  filter?: Maybe<AuctionParachainFilter>;
};


export type ParachainBidsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};


export type ParachainWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};


export type ParachainContributionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContributionsOrderBy>>;
  filter?: Maybe<ContributionFilter>;
};


export type ParachainAuctionsByAuctionParachainParachainIdAndAuctionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionsOrderBy>>;
  filter?: Maybe<AuctionFilter>;
};


export type ParachainAuctionsByBidParachainIdAndAuctionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionsOrderBy>>;
  filter?: Maybe<AuctionFilter>;
};


export type ParachainCrowdloansByBidParachainIdAndFundIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CrowdloansOrderBy>>;
  filter?: Maybe<CrowdloanFilter>;
};


export type ParachainAuctionsByWinningBlockParachainIdAndAuctionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionsOrderBy>>;
  filter?: Maybe<AuctionFilter>;
};


export type ParachainBidsByWinningBlockParachainIdAndBidIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};


export type ParachainCrowdloansByContributionParachainIdAndFundIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CrowdloansOrderBy>>;
  filter?: Maybe<CrowdloanFilter>;
};

/** A connection to a list of `Auction` values, with data from `AuctionParachain`. */
export type ParachainAuctionsByAuctionParachainParachainIdAndAuctionIdManyToManyConnection = {
  __typename?: 'ParachainAuctionsByAuctionParachainParachainIdAndAuctionIdManyToManyConnection';
  /** A list of `Auction` objects. */
  nodes: Array<Maybe<Auction>>;
  /** A list of edges which contains the `Auction`, info from the `AuctionParachain`, and the cursor to aid in pagination. */
  edges: Array<ParachainAuctionsByAuctionParachainParachainIdAndAuctionIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Auction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Auction` edge in the connection, with data from `AuctionParachain`. */
export type ParachainAuctionsByAuctionParachainParachainIdAndAuctionIdManyToManyEdge = {
  __typename?: 'ParachainAuctionsByAuctionParachainParachainIdAndAuctionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Auction` at the end of the edge. */
  node?: Maybe<Auction>;
  /** Reads and enables pagination through a set of `AuctionParachain`. */
  parachains: AuctionParachainsConnection;
};


/** A `Auction` edge in the connection, with data from `AuctionParachain`. */
export type ParachainAuctionsByAuctionParachainParachainIdAndAuctionIdManyToManyEdgeParachainsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionParachainsOrderBy>>;
  filter?: Maybe<AuctionParachainFilter>;
};

/** A connection to a list of `Auction` values, with data from `Bid`. */
export type ParachainAuctionsByBidParachainIdAndAuctionIdManyToManyConnection = {
  __typename?: 'ParachainAuctionsByBidParachainIdAndAuctionIdManyToManyConnection';
  /** A list of `Auction` objects. */
  nodes: Array<Maybe<Auction>>;
  /** A list of edges which contains the `Auction`, info from the `Bid`, and the cursor to aid in pagination. */
  edges: Array<ParachainAuctionsByBidParachainIdAndAuctionIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Auction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Auction` edge in the connection, with data from `Bid`. */
export type ParachainAuctionsByBidParachainIdAndAuctionIdManyToManyEdge = {
  __typename?: 'ParachainAuctionsByBidParachainIdAndAuctionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Auction` at the end of the edge. */
  node?: Maybe<Auction>;
  /** Reads and enables pagination through a set of `Bid`. */
  bids: BidsConnection;
};


/** A `Auction` edge in the connection, with data from `Bid`. */
export type ParachainAuctionsByBidParachainIdAndAuctionIdManyToManyEdgeBidsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};

/** A connection to a list of `Auction` values, with data from `WinningBlock`. */
export type ParachainAuctionsByWinningBlockParachainIdAndAuctionIdManyToManyConnection = {
  __typename?: 'ParachainAuctionsByWinningBlockParachainIdAndAuctionIdManyToManyConnection';
  /** A list of `Auction` objects. */
  nodes: Array<Maybe<Auction>>;
  /** A list of edges which contains the `Auction`, info from the `WinningBlock`, and the cursor to aid in pagination. */
  edges: Array<ParachainAuctionsByWinningBlockParachainIdAndAuctionIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Auction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Auction` edge in the connection, with data from `WinningBlock`. */
export type ParachainAuctionsByWinningBlockParachainIdAndAuctionIdManyToManyEdge = {
  __typename?: 'ParachainAuctionsByWinningBlockParachainIdAndAuctionIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Auction` at the end of the edge. */
  node?: Maybe<Auction>;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
};


/** A `Auction` edge in the connection, with data from `WinningBlock`. */
export type ParachainAuctionsByWinningBlockParachainIdAndAuctionIdManyToManyEdgeWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};

/** A connection to a list of `Bid` values, with data from `WinningBlock`. */
export type ParachainBidsByWinningBlockParachainIdAndBidIdManyToManyConnection = {
  __typename?: 'ParachainBidsByWinningBlockParachainIdAndBidIdManyToManyConnection';
  /** A list of `Bid` objects. */
  nodes: Array<Maybe<Bid>>;
  /** A list of edges which contains the `Bid`, info from the `WinningBlock`, and the cursor to aid in pagination. */
  edges: Array<ParachainBidsByWinningBlockParachainIdAndBidIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Bid` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Bid` edge in the connection, with data from `WinningBlock`. */
export type ParachainBidsByWinningBlockParachainIdAndBidIdManyToManyEdge = {
  __typename?: 'ParachainBidsByWinningBlockParachainIdAndBidIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Bid` at the end of the edge. */
  node?: Maybe<Bid>;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks: WinningBlocksConnection;
};


/** A `Bid` edge in the connection, with data from `WinningBlock`. */
export type ParachainBidsByWinningBlockParachainIdAndBidIdManyToManyEdgeWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};

/** A connection to a list of `Crowdloan` values, with data from `Bid`. */
export type ParachainCrowdloansByBidParachainIdAndFundIdManyToManyConnection = {
  __typename?: 'ParachainCrowdloansByBidParachainIdAndFundIdManyToManyConnection';
  /** A list of `Crowdloan` objects. */
  nodes: Array<Maybe<Crowdloan>>;
  /** A list of edges which contains the `Crowdloan`, info from the `Bid`, and the cursor to aid in pagination. */
  edges: Array<ParachainCrowdloansByBidParachainIdAndFundIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Crowdloan` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Crowdloan` edge in the connection, with data from `Bid`. */
export type ParachainCrowdloansByBidParachainIdAndFundIdManyToManyEdge = {
  __typename?: 'ParachainCrowdloansByBidParachainIdAndFundIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Crowdloan` at the end of the edge. */
  node?: Maybe<Crowdloan>;
  /** Reads and enables pagination through a set of `Bid`. */
  bidsByFundId: BidsConnection;
};


/** A `Crowdloan` edge in the connection, with data from `Bid`. */
export type ParachainCrowdloansByBidParachainIdAndFundIdManyToManyEdgeBidsByFundIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};

/** A connection to a list of `Crowdloan` values, with data from `Contribution`. */
export type ParachainCrowdloansByContributionParachainIdAndFundIdManyToManyConnection = {
  __typename?: 'ParachainCrowdloansByContributionParachainIdAndFundIdManyToManyConnection';
  /** A list of `Crowdloan` objects. */
  nodes: Array<Maybe<Crowdloan>>;
  /** A list of edges which contains the `Crowdloan`, info from the `Contribution`, and the cursor to aid in pagination. */
  edges: Array<ParachainCrowdloansByContributionParachainIdAndFundIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Crowdloan` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Crowdloan` edge in the connection, with data from `Contribution`. */
export type ParachainCrowdloansByContributionParachainIdAndFundIdManyToManyEdge = {
  __typename?: 'ParachainCrowdloansByContributionParachainIdAndFundIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Crowdloan` at the end of the edge. */
  node?: Maybe<Crowdloan>;
  /** Reads and enables pagination through a set of `Contribution`. */
  contributionsByFundId: ContributionsConnection;
};


/** A `Crowdloan` edge in the connection, with data from `Contribution`. */
export type ParachainCrowdloansByContributionParachainIdAndFundIdManyToManyEdgeContributionsByFundIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContributionsOrderBy>>;
  filter?: Maybe<ContributionFilter>;
};

/** A filter to be used against `Parachain` object types. All fields are combined with a logical ‘and.’ */
export type ParachainFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `paraId` field. */
  paraId?: Maybe<IntFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `creationBlock` field. */
  creationBlock?: Maybe<IntFilter>;
  /** Filter by the object’s `deregistered` field. */
  deregistered?: Maybe<BooleanFilter>;
  /** Filter by the object’s `deposit` field. */
  deposit?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `manager` field. */
  manager?: Maybe<StringFilter>;
  /** Filter by the object’s `chronicleId` field. */
  chronicleId?: Maybe<StringFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ParachainFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ParachainFilter>>;
  /** Negates the expression. */
  not?: Maybe<ParachainFilter>;
};

export type ParachainLeased = Node & {
  __typename?: 'ParachainLeased';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  parachainId: Scalars['String'];
  firstSlot: Scalars['Int'];
  lastSlot: Scalars['Int'];
  blockNum: Scalars['Int'];
  winningAmount: Scalars['BigFloat'];
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
  /** Reads a single `Parachain` that is related to this `ParachainLeased`. */
  parachain?: Maybe<Parachain>;
};

/** A filter to be used against `ParachainLeased` object types. All fields are combined with a logical ‘and.’ */
export type ParachainLeasedFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `parachainId` field. */
  parachainId?: Maybe<StringFilter>;
  /** Filter by the object’s `firstSlot` field. */
  firstSlot?: Maybe<IntFilter>;
  /** Filter by the object’s `lastSlot` field. */
  lastSlot?: Maybe<IntFilter>;
  /** Filter by the object’s `blockNum` field. */
  blockNum?: Maybe<IntFilter>;
  /** Filter by the object’s `winningAmount` field. */
  winningAmount?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ParachainLeasedFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ParachainLeasedFilter>>;
  /** Negates the expression. */
  not?: Maybe<ParachainLeasedFilter>;
};

/** A connection to a list of `ParachainLeased` values. */
export type ParachainLeasedsConnection = {
  __typename?: 'ParachainLeasedsConnection';
  /** A list of `ParachainLeased` objects. */
  nodes: Array<Maybe<ParachainLeased>>;
  /** A list of edges which contains the `ParachainLeased` and cursor to aid in pagination. */
  edges: Array<ParachainLeasedsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ParachainLeased` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ParachainLeased` edge in the connection. */
export type ParachainLeasedsEdge = {
  __typename?: 'ParachainLeasedsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ParachainLeased` at the end of the edge. */
  node?: Maybe<ParachainLeased>;
};

/** Methods to use when ordering `ParachainLeased`. */
export enum ParachainLeasedsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ParachainIdAsc = 'PARACHAIN_ID_ASC',
  ParachainIdDesc = 'PARACHAIN_ID_DESC',
  FirstSlotAsc = 'FIRST_SLOT_ASC',
  FirstSlotDesc = 'FIRST_SLOT_DESC',
  LastSlotAsc = 'LAST_SLOT_ASC',
  LastSlotDesc = 'LAST_SLOT_DESC',
  BlockNumAsc = 'BLOCK_NUM_ASC',
  BlockNumDesc = 'BLOCK_NUM_DESC',
  WinningAmountAsc = 'WINNING_AMOUNT_ASC',
  WinningAmountDesc = 'WINNING_AMOUNT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Parachain` values. */
export type ParachainsConnection = {
  __typename?: 'ParachainsConnection';
  /** A list of `Parachain` objects. */
  nodes: Array<Maybe<Parachain>>;
  /** A list of edges which contains the `Parachain` and cursor to aid in pagination. */
  edges: Array<ParachainsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Parachain` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Parachain` edge in the connection. */
export type ParachainsEdge = {
  __typename?: 'ParachainsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Parachain` at the end of the edge. */
  node?: Maybe<Parachain>;
};

/** Methods to use when ordering `Parachain`. */
export enum ParachainsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ParaIdAsc = 'PARA_ID_ASC',
  ParaIdDesc = 'PARA_ID_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  CreationBlockAsc = 'CREATION_BLOCK_ASC',
  CreationBlockDesc = 'CREATION_BLOCK_DESC',
  DeregisteredAsc = 'DEREGISTERED_ASC',
  DeregisteredDesc = 'DEREGISTERED_DESC',
  DepositAsc = 'DEPOSIT_ASC',
  DepositDesc = 'DEPOSIT_DESC',
  ManagerAsc = 'MANAGER_ASC',
  ManagerDesc = 'MANAGER_DESC',
  ChronicleIdAsc = 'CHRONICLE_ID_ASC',
  ChronicleIdDesc = 'CHRONICLE_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Reads and enables pagination through a set of `AuctionParachain`. */
  auctionParachains?: Maybe<AuctionParachainsConnection>;
  /** Reads and enables pagination through a set of `Auction`. */
  auctions?: Maybe<AuctionsConnection>;
  /** Reads and enables pagination through a set of `Bid`. */
  bids?: Maybe<BidsConnection>;
  /** Reads and enables pagination through a set of `Chronicle`. */
  chronicles?: Maybe<ChroniclesConnection>;
  /** Reads and enables pagination through a set of `Contribution`. */
  contributions?: Maybe<ContributionsConnection>;
  /** Reads and enables pagination through a set of `CrowdloanSequence`. */
  crowdloanSequences?: Maybe<CrowdloanSequencesConnection>;
  /** Reads and enables pagination through a set of `Crowdloan`. */
  crowdloans?: Maybe<CrowdloansConnection>;
  /** Reads and enables pagination through a set of `ParachainLeased`. */
  parachainLeaseds?: Maybe<ParachainLeasedsConnection>;
  /** Reads and enables pagination through a set of `Parachain`. */
  parachains?: Maybe<ParachainsConnection>;
  /** Reads and enables pagination through a set of `Subquery`. */
  subqueries?: Maybe<SubqueriesConnection>;
  /** Reads and enables pagination through a set of `WinningBlock`. */
  winningBlocks?: Maybe<WinningBlocksConnection>;
  auctionParachain?: Maybe<AuctionParachain>;
  auction?: Maybe<Auction>;
  bid?: Maybe<Bid>;
  chronicle?: Maybe<Chronicle>;
  contribution?: Maybe<Contribution>;
  crowdloanSequence?: Maybe<CrowdloanSequence>;
  crowdloan?: Maybe<Crowdloan>;
  parachainLeased?: Maybe<ParachainLeased>;
  parachain?: Maybe<Parachain>;
  subquery?: Maybe<Subquery>;
  subqueryByName?: Maybe<Subquery>;
  winningBlock?: Maybe<WinningBlock>;
  /** Reads a single `AuctionParachain` using its globally unique `ID`. */
  auctionParachainByNodeId?: Maybe<AuctionParachain>;
  /** Reads a single `Auction` using its globally unique `ID`. */
  auctionByNodeId?: Maybe<Auction>;
  /** Reads a single `Bid` using its globally unique `ID`. */
  bidByNodeId?: Maybe<Bid>;
  /** Reads a single `Chronicle` using its globally unique `ID`. */
  chronicleByNodeId?: Maybe<Chronicle>;
  /** Reads a single `Contribution` using its globally unique `ID`. */
  contributionByNodeId?: Maybe<Contribution>;
  /** Reads a single `CrowdloanSequence` using its globally unique `ID`. */
  crowdloanSequenceByNodeId?: Maybe<CrowdloanSequence>;
  /** Reads a single `Crowdloan` using its globally unique `ID`. */
  crowdloanByNodeId?: Maybe<Crowdloan>;
  /** Reads a single `ParachainLeased` using its globally unique `ID`. */
  parachainLeasedByNodeId?: Maybe<ParachainLeased>;
  /** Reads a single `Parachain` using its globally unique `ID`. */
  parachainByNodeId?: Maybe<Parachain>;
  /** Reads a single `Subquery` using its globally unique `ID`. */
  subqueryByNodeId?: Maybe<Subquery>;
  /** Reads a single `WinningBlock` using its globally unique `ID`. */
  winningBlockByNodeId?: Maybe<WinningBlock>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAuctionParachainsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionParachainsOrderBy>>;
  filter?: Maybe<AuctionParachainFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAuctionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AuctionsOrderBy>>;
  filter?: Maybe<AuctionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryBidsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<BidsOrderBy>>;
  filter?: Maybe<BidFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryChroniclesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ChroniclesOrderBy>>;
  filter?: Maybe<ChronicleFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryContributionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContributionsOrderBy>>;
  filter?: Maybe<ContributionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCrowdloanSequencesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CrowdloanSequencesOrderBy>>;
  filter?: Maybe<CrowdloanSequenceFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCrowdloansArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CrowdloansOrderBy>>;
  filter?: Maybe<CrowdloanFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryParachainLeasedsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainLeasedsOrderBy>>;
  filter?: Maybe<ParachainLeasedFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryParachainsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ParachainsOrderBy>>;
  filter?: Maybe<ParachainFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySubqueriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<SubqueriesOrderBy>>;
  filter?: Maybe<SubqueryFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryWinningBlocksArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WinningBlocksOrderBy>>;
  filter?: Maybe<WinningBlockFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAuctionParachainArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAuctionArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryBidArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChronicleArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryContributionArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCrowdloanSequenceArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCrowdloanArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryParachainLeasedArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryParachainArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySubqueryArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySubqueryByNameArgs = {
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWinningBlockArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAuctionParachainByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAuctionByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryBidByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChronicleByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryContributionByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCrowdloanSequenceByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCrowdloanByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryParachainLeasedByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryParachainByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySubqueryByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWinningBlockByNodeIdArgs = {
  nodeId: Scalars['ID'];
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['String']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['String']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Contains the specified string (case-sensitive). */
  includes?: Maybe<Scalars['String']>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: Maybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: Maybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: Maybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Subquery` values. */
export type SubqueriesConnection = {
  __typename?: 'SubqueriesConnection';
  /** A list of `Subquery` objects. */
  nodes: Array<Maybe<Subquery>>;
  /** A list of edges which contains the `Subquery` and cursor to aid in pagination. */
  edges: Array<SubqueriesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Subquery` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Subquery` edge in the connection. */
export type SubqueriesEdge = {
  __typename?: 'SubqueriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Subquery` at the end of the edge. */
  node?: Maybe<Subquery>;
};

/** Methods to use when ordering `Subquery`. */
export enum SubqueriesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  DbSchemaAsc = 'DB_SCHEMA_ASC',
  DbSchemaDesc = 'DB_SCHEMA_DESC',
  VersionAsc = 'VERSION_ASC',
  VersionDesc = 'VERSION_DESC',
  HashAsc = 'HASH_ASC',
  HashDesc = 'HASH_DESC',
  NextBlockHeightAsc = 'NEXT_BLOCK_HEIGHT_ASC',
  NextBlockHeightDesc = 'NEXT_BLOCK_HEIGHT_DESC',
  NetworkAsc = 'NETWORK_ASC',
  NetworkDesc = 'NETWORK_DESC',
  NetworkGenesisAsc = 'NETWORK_GENESIS_ASC',
  NetworkGenesisDesc = 'NETWORK_GENESIS_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type Subquery = Node & {
  __typename?: 'Subquery';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name: Scalars['String'];
  dbSchema: Scalars['String'];
  version: Scalars['Int'];
  hash: Scalars['String'];
  nextBlockHeight: Scalars['Int'];
  network?: Maybe<Scalars['String']>;
  networkGenesis?: Maybe<Scalars['String']>;
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
};

/** A filter to be used against `Subquery` object types. All fields are combined with a logical ‘and.’ */
export type SubqueryFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `dbSchema` field. */
  dbSchema?: Maybe<StringFilter>;
  /** Filter by the object’s `version` field. */
  version?: Maybe<IntFilter>;
  /** Filter by the object’s `hash` field. */
  hash?: Maybe<StringFilter>;
  /** Filter by the object’s `nextBlockHeight` field. */
  nextBlockHeight?: Maybe<IntFilter>;
  /** Filter by the object’s `network` field. */
  network?: Maybe<StringFilter>;
  /** Filter by the object’s `networkGenesis` field. */
  networkGenesis?: Maybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<SubqueryFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<SubqueryFilter>>;
  /** Negates the expression. */
  not?: Maybe<SubqueryFilter>;
};

export type WinningBlock = Node & {
  __typename?: 'WinningBlock';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  auctionId: Scalars['String'];
  parachainId: Scalars['String'];
  blockNum: Scalars['Int'];
  bidId: Scalars['String'];
  firstSlot: Scalars['Int'];
  lastSlot: Scalars['Int'];
  createdAt: Scalars['Datetime'];
  updatedAt: Scalars['Datetime'];
  /** Reads a single `Auction` that is related to this `WinningBlock`. */
  auction?: Maybe<Auction>;
  /** Reads a single `Parachain` that is related to this `WinningBlock`. */
  parachain?: Maybe<Parachain>;
  /** Reads a single `Bid` that is related to this `WinningBlock`. */
  bid?: Maybe<Bid>;
};

/** A filter to be used against `WinningBlock` object types. All fields are combined with a logical ‘and.’ */
export type WinningBlockFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `auctionId` field. */
  auctionId?: Maybe<StringFilter>;
  /** Filter by the object’s `parachainId` field. */
  parachainId?: Maybe<StringFilter>;
  /** Filter by the object’s `blockNum` field. */
  blockNum?: Maybe<IntFilter>;
  /** Filter by the object’s `bidId` field. */
  bidId?: Maybe<StringFilter>;
  /** Filter by the object’s `firstSlot` field. */
  firstSlot?: Maybe<IntFilter>;
  /** Filter by the object’s `lastSlot` field. */
  lastSlot?: Maybe<IntFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<WinningBlockFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<WinningBlockFilter>>;
  /** Negates the expression. */
  not?: Maybe<WinningBlockFilter>;
};

/** A connection to a list of `WinningBlock` values. */
export type WinningBlocksConnection = {
  __typename?: 'WinningBlocksConnection';
  /** A list of `WinningBlock` objects. */
  nodes: Array<Maybe<WinningBlock>>;
  /** A list of edges which contains the `WinningBlock` and cursor to aid in pagination. */
  edges: Array<WinningBlocksEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WinningBlock` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `WinningBlock` edge in the connection. */
export type WinningBlocksEdge = {
  __typename?: 'WinningBlocksEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `WinningBlock` at the end of the edge. */
  node?: Maybe<WinningBlock>;
};

/** Methods to use when ordering `WinningBlock`. */
export enum WinningBlocksOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  AuctionIdAsc = 'AUCTION_ID_ASC',
  AuctionIdDesc = 'AUCTION_ID_DESC',
  ParachainIdAsc = 'PARACHAIN_ID_ASC',
  ParachainIdDesc = 'PARACHAIN_ID_DESC',
  BlockNumAsc = 'BLOCK_NUM_ASC',
  BlockNumDesc = 'BLOCK_NUM_DESC',
  BidIdAsc = 'BID_ID_ASC',
  BidIdDesc = 'BID_ID_DESC',
  FirstSlotAsc = 'FIRST_SLOT_ASC',
  FirstSlotDesc = 'FIRST_SLOT_DESC',
  LastSlotAsc = 'LAST_SLOT_ASC',
  LastSlotDesc = 'LAST_SLOT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}
