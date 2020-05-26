import React from "react";
import {
  GetCommentsOfIssueComponent,
  GetCommentsOfIssueQueryVariables,
  Issue,
  IssueCommentConnection,
  GetCommentsOfIssueQuery,
} from "../../generated/graphql";
import Loading from "../../Loading";
import ErrorMessage from "../../Error";
import CommentItem from "../CommentItem";
import FetchMore from "../../FetchMore";

import "./style.css";

interface CommentsProps {
  repositoryOwner: string;
  repositoryName: string;
  issue: Issue;
}

interface CommentListProps extends GetCommentsOfIssueQueryVariables {
  comments: IssueCommentConnection;
  loading: boolean;
  fetchMore: Function;
}

interface UpdateQueryFn<TData = any> {
  (
    previousQueryResult: TData,
    options: {
      fetchMoreResult?: TData;
    }
  ): TData;
}

const updateQuery: UpdateQueryFn<GetCommentsOfIssueQuery> = (
  previousQueryResult,
  { fetchMoreResult }
) => {
  if (!fetchMoreResult) {
    return previousQueryResult;
  }
  return {
    ...previousQueryResult,
    repository: {
      ...previousQueryResult?.repository,
      issue: {
        ...previousQueryResult?.repository?.issue,
        ...fetchMoreResult?.repository?.issue,
        comments: {
          ...previousQueryResult?.repository?.issue.comments,
          ...fetchMoreResult?.repository?.issue.comments,
          edges: [
            ...previousQueryResult?.repository?.issue.comments.edges,
            ...fetchMoreResult?.repository?.issue.comments.edges,
          ],
        },
      },
    },
  };
};

const Comments: React.FC<CommentsProps> = ({
  repositoryOwner,
  repositoryName,
  issue,
}) => (
  <div className="Comments">
    <GetCommentsOfIssueComponent
      variables={{ repositoryOwner, repositoryName, number: issue.number }}
      notifyOnNetworkStatusChange={true}
    >
      {({ data, loading, error, fetchMore }) => {
        if (error) {
          return <ErrorMessage error={error} />;
        }

        if (
          !data ||
          !data.repository ||
          (loading && (!data || !data.repository))
        ) {
          return <Loading />;
        }

        if (
          !data?.repository?.issue?.comments.edges ||
          !data?.repository?.issue?.comments.edges.length
        ) {
          return <div className="CommentList">No issues...</div>;
        }

        return (
          <CommentList
            comments={
              data?.repository?.issue?.comments as IssueCommentConnection
            }
            loading={loading}
            number={issue.number}
            repositoryOwner={repositoryOwner}
            repositoryName={repositoryName}
            fetchMore={fetchMore}
          />
        );
      }}
    </GetCommentsOfIssueComponent>
  </div>
);

const CommentList: React.FC<CommentListProps> = ({
  comments,
  loading,
  number,
  repositoryOwner,
  repositoryName,
  fetchMore,
}) => {
  if (!comments.edges) {
    return <p>No Issues</p>;
  }
  return (
    <div className="CommentList">
      {comments.edges.map((comment) =>
        comment && comment.node ? (
          <CommentItem key={comment.node.id} comment={comment.node} />
        ) : null
      )}
      <FetchMore
        loading={loading}
        hasNextPage={comments.pageInfo.hasNextPage}
        variables={{
          cursor: comments.pageInfo.endCursor,
          repositoryOwner,
          repositoryName,
          number,
        }}
        updateQuery={updateQuery}
        fetchMore={fetchMore}
      >
        Comments
      </FetchMore>
    </div>
  );
};

export default Comments;
