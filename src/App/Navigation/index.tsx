import React from "react";
import { Link, withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

import * as routes from "../../constants/routes";

import "./style.css";
import Button from "../../Button";
import Input from "../../Input";

type NavigationProps = {
  location: {
    pathname: string;
  };
  organizationName: string;
  onOrganizationSearch: (value: string) => void;
};

const Navigation: React.FC<NavigationProps & RouteComponentProps> = ({
  location: { pathname },
  organizationName,
  onOrganizationSearch,
}) => (
  <header className="Navigation">
    <div className="Navigation-link">
      <Link to={routes.PROFILE}>Profile</Link>
    </div>
    <div className="Navigation-link">
      <Link to={routes.ORGANIZATION}>Organization</Link>
    </div>

    {pathname === routes.ORGANIZATION && (
      <OrganizationSearch
        organizationName={organizationName}
        onOrganizationSearch={onOrganizationSearch}
      />
    )}
  </header>
);

type OrganizationSearchProps = {
  organizationName: string;
  onOrganizationSearch: (value: string) => void;
};

type OrganizationSearchState = {
  value: string;
};

class OrganizationSearch extends React.Component<
  OrganizationSearchProps,
  OrganizationSearchState
> {
  state = {
    value: this.props.organizationName,
  };
  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value });
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    this.props.onOrganizationSearch(this.state.value);
    event.preventDefault();
  };

  render() {
    const { value } = this.state;
    return (
      <div className="Navigation-search">
        <form onSubmit={this.onSubmit}>
          <Input
            color={"white"}
            type="text"
            value={value}
            onChange={this.onChange}
          />{" "}
          <Button color={"white"} type="submit">
            Search
          </Button>
        </form>
      </div>
    );
  }
}

export default withRouter(Navigation);
