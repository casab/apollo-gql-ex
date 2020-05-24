import React from "react";

import RepositoryItem from "../RepositoryItem";
import Issues from "../../Issue";
import FetchMore from "../../FetchMore";
import {
  RepositoryConnection,
  GetRepositoriesOfCurrentUserQuery,
  GetRepositoriesOfOrganizationQuery,
} from "../../generated/graphql";

import "../style.css";

type RepositoryListProps = {
  repositories: RepositoryConnection;
  fetchMore: Function;
  loading: boolean;
  entry: "viewer" | "organization";
};

interface UpdateQueryFn<TData = any> {
  (
    previousQueryResult: TData,
    options: {
      fetchMoreResult?: TData;
    }
  ): TData;
}

const getUpdateQuery = (
  entry: "viewer" | "organization"
): UpdateQueryFn<
  GetRepositoriesOfCurrentUserQuery | GetRepositoriesOfOrganizationQuery
> => (previousQueryResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousQueryResult;
  }

  return {
    ...previousQueryResult,
    [entry]: {
      ...previousQueryResult[entry],
      repositories: {
        ...previousQueryResult[entry].repositories,
        ...fetchMoreResult[entry].repositories,
        edges: [
          ...previousQueryResult[entry].repositories.edges,
          ...fetchMoreResult[entry].repositories.edges,
        ],
      },
    },
  };
};

const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  fetchMore,
  loading,
  entry,
}) => {
  if (!repositories.edges) {
    return <p>No Repositories</p>;
  }
  return (
    <React.Fragment>
      {repositories.edges.map((edge) =>
        edge && edge.node ? (
          <div key={edge.node.id} className="RepositoryItem">
            <RepositoryItem {...edge.node} />

            <Issues
              repositoryName={edge.node.name}
              repositoryOwner={edge.node.owner.login}
            />
          </div>
        ) : null
      )}
      <FetchMore
        loading={loading}
        hasNextPage={repositories.pageInfo.hasNextPage}
        variables={{
          cursor: repositories.pageInfo.endCursor,
        }}
        updateQuery={getUpdateQuery(entry)}
        fetchMore={fetchMore}
      >
        Repositories
      </FetchMore>
    </React.Fragment>
  );
};

export default RepositoryList;
