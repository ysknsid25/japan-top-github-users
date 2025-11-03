import { Octokit } from "https://esm.sh/@octokit/core";

export interface User {
  login: string;
  avatarUrl: string;
  name: string | null;
  location: string | null;
  company: string | null;
  twitterUsername: string | null;
  isGitHubStar: boolean;
  followers: {
    totalCount: number;
  };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
    };
    restrictedContributionsCount: number;
  };
}

interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

interface GraphQLResponse {
  search: {
    edges: {
      node: User;
    }[];
    pageInfo: PageInfo;
  };
}

// fetchGitHubUsers関数の引数の型定義
export interface FetchUsersParams {
  octokit: Octokit;
}

// GraphQLクエリを生成する関数
const getQuery = (cursor: string | null) => {
  const after = cursor ? `"${cursor}"` : null;
  const locations = "location:japan sort:followers-desc followers:>64";
  const numberOfUsers = 10;

  return `query {
    search(type: USER, query:"${locations}", first:${numberOfUsers}, after:${after}) {
      edges {
        node {
          __typename
          ... on User {
            login,
            avatarUrl(size: 72),
            name,
            location,
            company,
            twitterUsername,
            followers {
              totalCount
            }
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
              restrictedContributionsCount
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }`;
};

/**
 * 1秒から5秒のランダムな時間待機する
 */
const randomDelay = () => {
  const randomWaitTime = Math.floor(Math.random() * 4000) + 1000; // 1000ms to 4999ms
  console.log(
    `Waiting for ${randomWaitTime / 1000} seconds before next fetch...`,
  );
  return new Promise((res) => setTimeout(res, randomWaitTime));
};

/**
 * GitHubから全てのユーザー情報を取得する
 * @param params - The parameters for fetching users.
 * @returns 全てのユーザー情報
 */
export async function fetchGitHubUsers({
  octokit,
}: FetchUsersParams): Promise<User[]> {
  let allUsers: User[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;
  let pageCount = 0;

  while (hasNextPage) {
    console.log(`🔖 Fetching page ${pageCount + 1}...`);
    const query = getQuery(cursor);
    const response = await octokit.graphql<GraphQLResponse>(query);

    const users = response.search.edges.map((edge) => edge.node);
    allUsers = allUsers.concat(users);

    hasNextPage = response.search.pageInfo.hasNextPage;
    cursor = response.search.pageInfo.endCursor;

    if (hasNextPage) {
      await randomDelay();
    }
    pageCount++;
  }

  return allUsers;
}
