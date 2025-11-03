import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { Octokit } from "https://esm.sh/@octokit/core";
import { fetchGitHubUsers, User } from "./octkit.ts";

// deno-lint-ignore no-explicit-any
const createMockOctokit = (responses: any[]) => {
  let callCount = 0;
  const octokit = new Octokit();
  // deno-lint-ignore no-explicit-any
  (octokit as any).graphql = async (
    query: string,
    options?: any,
  ): Promise<any> => {
    console.log(`MockOctokit.graphql call #${callCount + 1}`);
    const responseOrError = responses[callCount];
    callCount++;
    if (responseOrError instanceof Error) {
      return Promise.reject(responseOrError);
    }
    return Promise.resolve(responseOrError);
  };
  return octokit;
};

Deno.test(
  "fetchGitHubUsers - should return all users when there is a next page",
  async () => {
    // Arrange
    const mockResponses = [
      {
        search: {
          edges: [{ node: { login: "user1" } }],
          pageInfo: { endCursor: "cursor-1", hasNextPage: true },
        },
      },
      {
        search: {
          edges: [{ node: { login: "user2" } }],
          pageInfo: { endCursor: "cursor-2", hasNextPage: false },
        },
      },
    ];
    const mockOctokit = createMockOctokit(mockResponses);

    // Act
    const users: User[] = await fetchGitHubUsers({ octokit: mockOctokit });

    // Assert
    assertEquals(users.length, 2);
    assertEquals(users[0].login, "user1");
    assertEquals(users[1].login, "user2");
  },
);

Deno.test(
  "fetchGitHubUsers - should return users from a single page when there is no next page",
  async () => {
    // Arrange
    const mockResponses = [
      {
        search: {
          edges: [{ node: { login: "user1" } }],
          pageInfo: { endCursor: "cursor-1", hasNextPage: false },
        },
      },
    ];
    const mockOctokit = createMockOctokit(mockResponses);

    // Act
    const users: User[] = await fetchGitHubUsers({ octokit: mockOctokit });

    // Assert
    assertEquals(users.length, 1);
    assertEquals(users[0].login, "user1");
  },
);

Deno.test("fetchGitHubUsers - should retry on failure and succeed", async () => {
  // Arrange
  const mockResponses = [
    new Error("502 Bad Gateway"), // 1回目の呼び出しは失敗
    { // 2回目の呼び出しで成功
      search: {
        edges: [{ node: { login: "user1" } }],
        pageInfo: { endCursor: "cursor-1", hasNextPage: false },
      },
    },
  ];
  const mockOctokit = createMockOctokit(mockResponses);

  // Act
  const users: User[] = await fetchGitHubUsers({ octokit: mockOctokit });

  // Assert
  assertEquals(users.length, 1);
  assertEquals(users[0].login, "user1");
});
