// @Todo Explore Namespace to avoid Type and Component Name Collisions
type Nullable<T> = T | null;

enum AccountTypeEnum {
  ORGANIZATION = 'ORGANIZATION',
  USER = 'USER',
}

type Account = {
  id: number;
  email?: string;
  username: string;
  // first_name: string;
  // last_name: string;
  photoUrl: string;
  followerCount: number;
  headline: string;
  accountTypeId: number;
  accountType?: AccountType;
}

type AccountType = {
  id: number;
  type: AccountTypeEnum;
}

type ReactionInsights = {
  id?: number;
  account: Account;
  likedBy: number;
  likedOn: Date;
  postId: Nullable<number>;
  commentId: Nullable<number>;
}


type Comment = {
  id: number;
  account: Account;
  body: string;
  createDate: Date;
  createdBy: number;
  reaction: ReactionInsights[]; // includes only reaction where likedBy logged in Account
  parentId: Nullable<number>;
  commentThread?: Comment[];
  depth?: number;
  _count: CommentReactionAggregate;
  postId: number;
}

type Post = {
  id: number;
  title?: string;
  content: string;
  account: Account;
  reaction: ReactionInsights[]; // Reaction Insight From Logged In User If Found
  _count: PostReactionAggregate;
}

type PostReactionAggregate = {
  commentList: number; // total number of comments for this post
  reaction: number; // total number of reactions for this post
}

type CommentReactionAggregate = {
  children: number; // direct replies to comment -- does not include replies that are children of children. Each comment has it's count for replies that are direct descendents
  reaction: number; // total number of reactions for this comment
}

type Article = Post | Comment;

type ModalState = {
  open: boolean;
  item: Nullable<Article>;
}

export type {
  Nullable,
  Account,
  ReactionInsights,
  Comment,
  Post,
  Article,
  ModalState,
}

export { AccountTypeEnum }