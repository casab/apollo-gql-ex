import React from "react";

import Link from "../../Link";
import Button from "../../Button";

import "../style.css";

import {
  Repository,
  UnstarRepositoryMutation,
  WatchRepositoryMutation,
  StarRepositoryMutation,
  WatchRepositoryComponent,
  StarRepositoryComponent,
  UnstarRepositoryComponent,
  SubscriptionState,
  RepositoryFragmentDoc,
} from "../../generated/graphql";

import { MutationUpdaterFn } from "apollo-client";
import { DataProxy } from "apollo-cache";

const isWatch = (viewerSubscription: SubscriptionState): boolean =>
  viewerSubscription === "SUBSCRIBED";

const updateWatch: MutationUpdaterFn<WatchRepositoryMutation> = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id, viewerSubscription },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: RepositoryFragmentDoc,
  }) as Repository;

  let { totalCount } = repository.watchers;

  totalCount =
    viewerSubscription === "SUBSCRIBED" ? totalCount + 1 : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: RepositoryFragmentDoc,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
      },
    },
  });
};

const updateAddStar: MutationUpdaterFn<StarRepositoryMutation> = (
  client,
  {
    data: {
      addStar: {
        starrable: { id, viewerHasStarred },
      },
    },
  }
) => {
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: RepositoryFragmentDoc,
    data: getUpdatedStarData(client, id, viewerHasStarred),
  });
};

const updateRemoveStar: MutationUpdaterFn<UnstarRepositoryMutation> = (
  client,
  {
    data: {
      removeStar: {
        starrable: { id, viewerHasStarred },
      },
    },
  }
) => {
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: RepositoryFragmentDoc,
    data: getUpdatedStarData(client, id, viewerHasStarred),
  });
};

const getUpdatedStarData = (
  client: DataProxy,
  id: string,
  viewerHasStarred: boolean
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: RepositoryFragmentDoc,
  }) as Repository;

  let { totalCount } = repository.stargazers;
  totalCount = viewerHasStarred ? totalCount + 1 : totalCount - 1;

  return {
    ...repository,
    stargazers: {
      ...repository.stargazers,
      totalCount,
    },
  };
};

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
        <WatchRepositoryComponent
          variables={{
            id,
            viewerSubscription: (isWatch(
              viewerSubscription as SubscriptionState
            )
              ? "UNSUBSCRIBED"
              : "SUBSCRIBED") as SubscriptionState,
          }}
          optimisticResponse={{
            updateSubscription: {
              __typename: "UpdateSubscriptionPayload",
              subscribable: {
                __typename: "Repository",
                id,
                viewerSubscription: (isWatch(
                  viewerSubscription as SubscriptionState
                )
                  ? "UNSUBSCRIBED"
                  : "SUBSCRIBED") as SubscriptionState,
              },
            },
          }}
          update={updateWatch}
        >
          {(updateSubscription, { data, loading, error }) => (
            <Button
              className="RepositoryItem-title-action"
              data-test-id="updateSubscription"
              onClick={updateSubscription as any}
            >
              {watchers.totalCount}{" "}
              {isWatch(viewerSubscription as SubscriptionState)
                ? "Unwatch"
                : "Watch"}
            </Button>
          )}
        </WatchRepositoryComponent>
        {!viewerHasStarred ? (
          <StarRepositoryComponent
            variables={{ id }}
            optimisticResponse={{
              addStar: {
                __typename: "AddStarPayload",
                starrable: {
                  __typename: "Repository",
                  id,
                  viewerHasStarred: !viewerHasStarred,
                },
              },
            }}
            update={updateAddStar}
          >
            {(addStar, { data, loading, error }) => (
              <Button
                className={"RepositoryItem-title-action"}
                onClick={addStar as any}
              >
                {stargazers.totalCount} Stars
              </Button>
            )}
          </StarRepositoryComponent>
        ) : (
          <UnstarRepositoryComponent
            variables={{ id }}
            optimisticResponse={{
              removeStar: {
                __typename: "RemoveStarPayload",
                starrable: {
                  __typename: "Repository",
                  id,
                  viewerHasStarred: !viewerHasStarred,
                },
              },
            }}
            update={updateRemoveStar}
          >
            {(removeStar, { data, loading, error }) => (
              <Button
                className={"RepositoryItem-title-action"}
                onClick={removeStar as any}
              >
                {stargazers.totalCount} Unstar
              </Button>
            )}
          </UnstarRepositoryComponent>
        )}
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
