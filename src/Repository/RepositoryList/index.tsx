import React from "react";

import RepositoryItem from "../RepositoryItem";
import { Repository } from "../../generated/graphql";

import "../style.css";

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
