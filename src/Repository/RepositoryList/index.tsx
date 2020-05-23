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
};

interface UpdateQueryFn<TData = any> {
  (
    previousQueryResult: TData,
    options: {
      fetchMoreResult?: TData;
    }
  ): TData;
}

const updateQuery: UpdateQueryFn<GetRepositoriesOfCurrentUserQuery> = (
  previousQueryResult,
  { fetchMoreResult }
) => {
  if (!fetchMoreResult) {
    return previousQueryResult;
  }

  return {
    ...previousQueryResult,
    viewer: {
      ...previousQueryResult.viewer,
      repositories: {
        ...previousQueryResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousQueryResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ],
      },
    },
  };
};

const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  fetchMore,
  loading,
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
        updateQuery={updateQuery}
        fetchMore={fetchMore}
      >
        Repositories
      </FetchMore>
    </React.Fragment>
  );
};

export default RepositoryList;
