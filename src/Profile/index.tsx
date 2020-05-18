import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import RepositoryList from "../Repository";
import Loading from "../Loading";
import ErrorMessage from "../Error";

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  {
    viewer {
      repositories(first: 5, orderBy: { direction: DESC, field: STARGAZERS }) {
        edges {
          node {
            id
            name
            url
            descriptionHTML
            primaryLanguage {
              name
            }
            owner {
              login
              url
            }
            stargazers {
              totalCount
            }
            viewerHasStarred
            watchers {
              totalCount
            }
            viewerSubscription
          }
        }
      }
    }
  }
`;

interface Repository {
  id: string;
  name: string;
  url: string;
  descriptionHTML: string;
  primaryLanguage: { name: string };
  owner: { login: string; url: string };
  stargazers: { totalCount: number };
  viewerHasStarred: boolean;
  watchers: { totalCount: number };
  viewerSubscription: string;
}

interface Viewer {
  repositories: {
    edges: Array<{ node: Repository }>;
  };
}

interface Data {
  viewer: Viewer;
}

const Profile = () => (
  <Query<Data, {}> query={GET_REPOSITORIES_OF_CURRENT_USER}>
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
