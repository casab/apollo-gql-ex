import React from "react";

import RepositoryItem from "../RepositoryItem";

import "../style.css";

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

interface RepositoryListProps {
  repositories: {
    edges: Array<{ node: Repository }>;
  };
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => (
  <React.Fragment>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
      </div>
    ))}
  </React.Fragment>
);

export default RepositoryList;
