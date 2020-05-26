import React from "react";
import { IssueComment } from "../../generated/graphql";

import "./style.css";

interface CommentProps {
  comment: IssueComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => (
  <div className="CommentItem">
    <div>{comment?.author?.login}</div>
    &nbsp;
    <div dangerouslySetInnerHTML={{ __html: comment.bodyHTML }} />
  </div>
);

export default Comment;
