import React from "react";

import {
  GetIssuesOfRepositoryQueryVariables,
  GetIssuesOfRepositoryComponent,
  IssueConnection,
} from "../../generated/graphql";

import "./style.css";
import ErrorMessage from "../../Error";
import Loading from "../../Loading";
import IssueItem from "../IssueItem";
import { ButtonUnobstrusive } from "../../Button";

enum IssueState {
  NONE = "NONE",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

const TRANSITION_LABELS = {
  [IssueState.NONE]: "Show Open Issues",
  [IssueState.OPEN]: "Show Closed Issues",
  [IssueState.CLOSED]: "Hide Issues",
};

const TRANSITION_STATE = {
  [IssueState.NONE]: IssueState.OPEN,
  [IssueState.OPEN]: IssueState.CLOSED,
  [IssueState.CLOSED]: IssueState.NONE,
};

const isShow = (issueState: IssueState) => issueState !== IssueState.NONE;

class Issues extends React.Component<
  GetIssuesOfRepositoryQueryVariables,
  { issueState: IssueState }
> {
  state = {
    issueState: IssueState.NONE,
  };

  onChangeIssueState = (nextIssueState: IssueState) => {
    this.setState({ issueState: nextIssueState });
  };

  render() {
    const { issueState } = this.state;
    const { repositoryOwner, repositoryName } = this.props;

    return (
      <div className="Issues">
        <ButtonUnobstrusive
          onClick={() => this.onChangeIssueState(TRANSITION_STATE[issueState])}
        >
          {TRANSITION_LABELS[issueState]}
        </ButtonUnobstrusive>
        {isShow(issueState) && (
          <GetIssuesOfRepositoryComponent
            variables={{ repositoryOwner, repositoryName }}
          >
            {({ data, loading, error }) => {
              if (error) {
                return <ErrorMessage error={error} />;
              }

              if (
                !data ||
                !data.repository ||
                (loading && (!data || !data.repository))
              ) {
                return <Loading />;
              }

              const filteredRepository = {
                issues: {
                  edges:
                    data.repository.issues.edges &&
                    data.repository.issues.edges.length
                      ? data.repository.issues.edges.filter((issue) =>
                          issue && issue.node
                            ? issue.node.state === (issueState as string)
                            : null
                        )
                      : null,
                },
              };

              if (
                !filteredRepository.issues.edges ||
                !filteredRepository.issues.edges.length
              ) {
                return <div className="IssueList">No issues...</div>;
              }

              return (
                <IssueList
                  issues={filteredRepository.issues as IssueConnection}
                />
              );
            }}
          </GetIssuesOfRepositoryComponent>
        )}
      </div>
    );
  }
}

const IssueList: React.FC<{ issues: IssueConnection }> = ({ issues }) => {
  if (!issues.edges) {
    return <p>No Issues</p>;
  }
  return (
    <div className="IssueList">
      {issues.edges.map((issue) =>
        issue && issue.node ? (
          <IssueItem key={issue.node.id} issue={issue.node} />
        ) : null
      )}
    </div>
  );
};

export default Issues;
