import React from "react";
import { withState } from "recompose";

import Button from "../../Button";
import Comments from "../../Comments";
import Link from "../../Link";

import "./style.css";
import {
  Issue,
  GetCommentsOfIssueDocument,
  GetCommentsOfIssueQuery,
} from "../../generated/graphql";
import { ApolloConsumer } from "react-apollo";
import ApolloClient from "apollo-client";

interface IssueItemProps {
  issue: Issue;
  repositoryOwner: string;
  repositoryName: string;
  isShowComments: boolean;
  onShowComments: (s: boolean) => boolean;
}
const prefetchComments = (
  client: ApolloClient<GetCommentsOfIssueQuery>,
  repositoryOwner: string,
  repositoryName: string,
  issue: Issue
) => {
  client.query({
    query: GetCommentsOfIssueDocument,
    variables: {
      repositoryOwner,
      repositoryName,
      number: issue.number,
    },
  });
};
const IssueItem: React.FC<IssueItemProps> = ({
  issue,
  repositoryOwner,
  repositoryName,
  isShowComments,
  onShowComments,
}) => (
  <div className="IssueItem">
    <ApolloConsumer>
      {(client) => (
        <Button
          onClick={() => onShowComments(!isShowComments)}
          onMouseOver={() =>
            prefetchComments(client, repositoryOwner, repositoryName, issue)
          }
        >
          {isShowComments ? "-" : "+"}
        </Button>
      )}
    </ApolloConsumer>
    <div className="IssueItem-content">
      <h3>
        <Link href={issue.url}>{issue.title}</Link>
      </h3>
      <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />
      {isShowComments && (
        <Comments
          repositoryOwner={repositoryOwner}
          repositoryName={repositoryName}
          issue={issue}
        />
      )}
    </div>
  </div>
);

export default withState("isShowComments", "onShowComments", false)(IssueItem);
