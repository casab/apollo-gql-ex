import React from "react";
import { Mutation } from "react-apollo";

import Link from "../../Link";
import Button from "../../Button";

import "../style.css";

import {
  STAR_REPOSITORY,
  UNSTAR_REPOSITORY,
  WATCH_REPOSITORY,
} from "../mutations";

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: "SUBSCRIBED",
  UNSUBSCRIBED: "UNSUBSCRIBED",
};

const isWatch = (viewerSubscription: string): boolean =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

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

const RepositoryItem: React.FC<Repository> = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => (
  <div>
    <div className="RepositoryItem-title">
      <h2>
        <Link href={url}>{name}</Link>
      </h2>

      <div className="RepositoryItem-title-action">
        <Mutation<Repository, { id: string; viewerSubscription: string }>
          mutation={WATCH_REPOSITORY}
          variables={{
            id,
            viewerSubscription: isWatch(viewerSubscription)
              ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
              : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
          }}
        >
          {(updateSubscription, { data, loading, error }) => (
            <Button
              className="RepositoryItem-title-action"
              data-test-id="updateSubscription"
              onClick={updateSubscription as any}
            >
              {watchers.totalCount}{" "}
              {isWatch(viewerSubscription) ? "Unwatch" : "Watch"}
            </Button>
          )}
        </Mutation>
        {!viewerHasStarred ? (
          <Mutation<Repository, { id: string }>
            mutation={STAR_REPOSITORY}
            variables={{ id }}
          >
            {(addStar, { data, loading, error }) => (
              <Button
                className={"RepositoryItem-title-action"}
                onClick={addStar as any}
              >
                {stargazers.totalCount} Stars
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation<Repository, { id: string }>
            mutation={UNSTAR_REPOSITORY}
            variables={{ id }}
          >
            {(removeStar, { data, loading, error }) => (
              <Button
                className={"RepositoryItem-title-action"}
                onClick={removeStar as any}
              >
                {stargazers.totalCount} Unstar
              </Button>
            )}
          </Mutation>
        )}

        {/* Here comes your updateSubscription mutation */}
      </div>
    </div>

    <div className="RepositoryItem-description">
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />
      <div className="RepositoryItem-description-details">
        <div>
          {primaryLanguage && <span>Language: {primaryLanguage.name}</span>}
        </div>
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
