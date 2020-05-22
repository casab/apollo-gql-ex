import React from "react";

import Loading from "../Loading";
import { ButtonUnobstrusive } from "../Button";
import "./style.css";
import { OperationVariables } from "apollo-client";
import { UpdateQueryFn } from "apollo-client/core/watchQueryOptions";

interface FetchMoreProps {
  loading: boolean;
  hasNextPage: boolean;
  children: React.ReactNode;
  variables: OperationVariables;
  updateQuery: UpdateQueryFn;
  fetchMore: Function;
}

const FetchMore: React.FC<FetchMoreProps> = ({
  loading,
  hasNextPage,
  variables,
  updateQuery,
  fetchMore,
  children,
}) => (
  <div className="FetchMore">
    {loading ? (
      <Loading />
    ) : (
      hasNextPage && (
        <ButtonUnobstrusive
          type="button"
          className="FetchMore-button"
          onClick={() => fetchMore({ variables, updateQuery })}
        >
          More {children}
        </ButtonUnobstrusive>
      )
    )}
  </div>
);

export default FetchMore;
