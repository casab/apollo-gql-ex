import React from "react";
import {
  GetRepositoriesOfOrganizationComponent,
  RepositoryConnection,
  GetRepositoriesOfOrganizationQueryVariables,
} from "../generated/graphql";
import ErrorMessage from "../Error";
import RepositoryList from "../Repository";
import Loading from "../Loading";

const Organization: React.FC<GetRepositoriesOfOrganizationQueryVariables> = ({
  organizationName,
}) => (
  <GetRepositoriesOfOrganizationComponent
    variables={{ organizationName }}
    skip={organizationName === ""}
    notifyOnNetworkStatusChange={true}
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }
      if (
        !data ||
        !data.organization ||
        (loading && (!data || !data.organization))
      ) {
        return <Loading />;
      }

      return (
        <RepositoryList
          loading={loading}
          repositories={data.organization.repositories as RepositoryConnection}
          fetchMore={fetchMore}
          entry={"organization"}
        />
      );
    }}
  </GetRepositoriesOfOrganizationComponent>
);

export default Organization;
