import React from "react";
import { withState } from "recompose";

import {
  GetIssuesOfRepositoryQueryVariables,
  GetIssuesOfRepositoryComponent,
  IssueConnection,
  IssueState as IssueState2,
  GetIssuesOfRepositoryQuery,
  GetIssuesOfRepositoryDocument,
} from "../../generated/graphql";

import "./style.css";
import ErrorMessage from "../../Error";
import Loading from "../../Loading";
import IssueItem from "../IssueItem";
import { ButtonUnobstrusive } from "../../Button";
import FetchMore from "../../FetchMore";
import { ApolloConsumer } from "react-apollo";
import ApolloClient from "apollo-client";

enum IssueState {
  NONE = "NONE",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

type IssueStateType = IssueState | IssueState2;

interface UpdateQueryFn<TData = any> {
  (
    previousQueryResult: TData,
    options: {
      fetchMoreResult?: TData;
    }
  ): TData;
}

interface IssuesProps extends GetIssuesOfRepositoryQueryVariables {
  onChangeIssueState: (s: IssueState) => IssueState;
}

interface IssueListProps extends GetIssuesOfRepositoryQueryVariables {
  issues: IssueConnection;
  loading: boolean;
  fetchMore: Function;
}

const TRANSITION_LABELS = {
  [IssueState.NONE]: "Show Open Issues",
  [IssueState.OPEN]: "Show Closed Issues",
  [IssueState.CLOSED]: "Hide Issues",
};

const TRANSITION_STATE = {
  [IssueState.NONE]: IssueState.OPEN,
  [IssueState.OPEN]: IssueState.CLOSED,
  [IssueState.CLOSED]: IssueState.NONE,
};

const isShow = (issueState: IssueStateType) => issueState !== IssueState.NONE;

const updateQuery: UpdateQueryFn<GetIssuesOfRepositoryQuery> = (
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
      issues: {
        ...previousQueryResult?.repository?.issues,
        ...fetchMoreResult?.repository?.issues,
        edges: [
          ...previousQueryResult?.repository?.issues.edges,
          ...fetchMoreResult?.repository?.issues.edges,
        ],
      },
    },
  };
};

const prefetchIssues = (
  client: ApolloClient<GetIssuesOfRepositoryQuery>,
  repositoryOwner: string,
  repositoryName: string,
  issueState: IssueStateType
) => {
  const nextIssueState = TRANSITION_STATE[issueState];

  if (isShow(nextIssueState)) {
    client.query({
      query: GetIssuesOfRepositoryDocument,
      variables: {
        repositoryOwner,
        repositoryName,
        issueState: nextIssueState,
      },
    });
  }
};

const Issues: React.FC<IssuesProps> = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState,
}) => (
  <div className="Issues">
    <IssueFilter
      repositoryOwner={repositoryOwner}
      repositoryName={repositoryName}
      issueState={issueState}
      onChangeIssueState={onChangeIssueState}
    />
    {isShow(issueState) && (
      <GetIssuesOfRepositoryComponent
        variables={{ repositoryOwner, repositoryName, issueState }}
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

          const filteredRepository = {
            issues: {
              edges:
                data.repository.issues.edges &&
                data.repository.issues.edges.length
                  ? data.repository.issues.edges.filter((issue) =>
                      issue && issue.node
                        ? issue.node.state === (issueState as string)
                        : null
                    )
                  : null,
            },
          };

          if (
            !filteredRepository.issues.edges ||
            !filteredRepository.issues.edges.length
          ) {
            return <div className="IssueList">No issues...</div>;
          }

          return (
            <IssueList
              issues={data.repository.issues as IssueConnection}
              loading={loading}
              repositoryOwner={repositoryOwner}
              repositoryName={repositoryName}
              issueState={issueState}
              fetchMore={fetchMore}
            />
          );
        }}
      </GetIssuesOfRepositoryComponent>
    )}
  </div>
);

const IssueFilter: React.FC<IssuesProps> = ({
  repositoryOwner,
  repositoryName,
  issueState,
  onChangeIssueState,
}) => (
  <ApolloConsumer>
    {(client) => (
      <ButtonUnobstrusive
        onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
        onMouseOver={() =>
          prefetchIssues(client, repositoryOwner, repositoryName, issueState)
        }
      >
        {TRANSITION_LABELS[issueState]}
      </ButtonUnobstrusive>
    )}
  </ApolloConsumer>
);

const IssueList: React.FC<IssueListProps> = ({
  issues,
  loading,
  repositoryOwner,
  repositoryName,
  issueState,
  fetchMore,
}) => {
  if (!issues.edges) {
    return <p>No Issues</p>;
  }
  return (
    <div className="IssueList">
      {issues.edges.map((issue) =>
        issue && issue.node ? (
          <IssueItem
            key={issue.node.id}
            issue={issue.node}
            repositoryName={repositoryName}
            repositoryOwner={repositoryOwner}
          />
        ) : null
      )}
      <FetchMore
        loading={loading}
        hasNextPage={issues.pageInfo.hasNextPage}
        variables={{
          cursor: issues.pageInfo.endCursor,
          repositoryOwner,
          repositoryName,
          issueState,
        }}
        updateQuery={updateQuery}
        fetchMore={fetchMore}
      >
        Issues
      </FetchMore>
    </div>
  );
};

export default withState(
  "issueState",
  "onChangeIssueState",
  IssueState.NONE as IssueStateType
)(Issues);
