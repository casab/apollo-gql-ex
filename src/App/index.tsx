import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "./Navigation";
import Profile from "../Profile";
import Organization from "../Organization";

import * as routes from "../constants/routes";

type AppState = {
  organizationName: string;
};
class App extends React.Component<{}, AppState> {
  state = {
    organizationName: "the-road-to-learn-react",
  };

  onOrganizationSearch = (value: string) => {
    this.setState({ organizationName: value });
  };
  render() {
    const { organizationName } = this.state;
    return (
      <Router>
        <div className="App">
          <Navigation
            organizationName={organizationName}
            onOrganizationSearch={this.onOrganizationSearch}
          />
          <div className="App-main">
            <Route
              exact
              path={routes.ORGANIZATION}
              component={() => (
                <div className="App-content_large-header">
                  <Organization organizationName={organizationName} />
                </div>
              )}
            />
            <Route
              exact
              path={routes.PROFILE}
              component={() => (
                <div className="App-content_large-header">
                  <Profile />
                </div>
              )}
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
