import RepositoryList from "./RepositoryList";
import REPOSITORY_FRAGMENT from "./fragments";

export { REPOSITORY_FRAGMENT };

/*
export type Repository = {
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
};
*/

export default RepositoryList;
