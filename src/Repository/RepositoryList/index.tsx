import React from "react";

import RepositoryItem from "../RepositoryItem";
import FetchMore from "../../FetchMore";
import {
  RepositoryConnection,
  GetRepositoriesOfCurrentUserQuery,
} from "../../generated/graphql";

import "../style.css";
import { UpdateQueryFn } from "apollo-client/core/watchQueryOptions";

type RepositoryListProps = {
  repositories: RepositoryConnection;
  fetchMore: any;
  loading: boolean;
};

const updateQuery: UpdateQueryFn<GetRepositoriesOfCurrentUserQuery> = (
  previousResult,
  options
) => {
  const { subscriptionData } = options;
  if (!subscriptionData) {
    return previousResult;
  }

  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...subscriptionData.data.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...subscriptionData.data.viewer.repositories.edges,
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
