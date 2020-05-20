import React from "react";
import { Query } from "react-apollo";

import RepositoryList from "../Repository";

import {
  Repository,
  GetRepositoriesOfCurrentUserDocument,
} from "../generated/graphql";

import Loading from "../Loading";
import ErrorMessage from "../Error";

interface Viewer {
  repositories: {
    edges: Array<{ node: Repository }>;
  };
}

interface Data {
  viewer: Viewer;
}

const Profile = () => (
  <Query<Data, {}> query={GetRepositoriesOfCurrentUserDocument}>
    {({ loading, error, data }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }
      if (loading || !data || !data.viewer) {
        return <Loading />;
      }

      return <RepositoryList repositories={data.viewer.repositories} />;
    }}
  </Query>
);

export default Profile;
