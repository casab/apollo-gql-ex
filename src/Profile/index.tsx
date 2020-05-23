import React from "react";

import RepositoryList from "../Repository";

import {
  GetRepositoriesOfCurrentUserComponent,
  RepositoryConnection,
} from "../generated/graphql";

import Loading from "../Loading";
import ErrorMessage from "../Error";

const Profile = () => (
  <GetRepositoriesOfCurrentUserComponent notifyOnNetworkStatusChange={true}>
    {({ loading, error, data, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }
      if (!data || (loading && (!data || !data.viewer))) {
        return <Loading />;
      }

      return (
        <RepositoryList
          loading={loading}
          repositories={data.viewer.repositories as RepositoryConnection}
          fetchMore={fetchMore}
          entry={"viewer"}
        />
      );
    }}
  </GetRepositoriesOfCurrentUserComponent>
);

export default Profile;
