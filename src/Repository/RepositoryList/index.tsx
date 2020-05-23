import React from "react";

import RepositoryItem from "../RepositoryItem";
import FetchMore from "../../FetchMore";
import {
  RepositoryConnection,
  GetRepositoriesOfCurrentUserQuery,
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
): UpdateQueryFn<GetRepositoriesOfCurrentUserQuery> => (
  previousQueryResult,
  { fetchMoreResult }
) => {
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
      {repositories.edges.map(({ node }) => (
        <div key={node.id} className="RepositoryItem">
          <RepositoryItem {...node} />
        </div>
      ))}
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
