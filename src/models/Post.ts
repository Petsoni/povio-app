import Comment from "./Comment";

export type Post = {
  postId: number,
  title: string,
  description: string,
  author: string,
  lastModifiedBy: string,
  lastModified: string,
  createdDate: string,
  category: string,
  subCategory: string,
  numberOfComments: number,
  numberOfUpVotes: number,
  comments: Comment[],
}

export default Post;
