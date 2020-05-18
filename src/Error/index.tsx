import React from "react";

import "./style.css";
import { ApolloError } from "apollo-client";

interface ErrorMessageProps {
  error: ApolloError;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="ErrorMessage">
    <small>{error.toString()}</small>
  </div>
);

export default ErrorMessage;
