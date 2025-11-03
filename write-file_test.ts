import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { generateMarkdownTable, TableMetric } from "./write-file.ts";
import { User } from "./octkit.ts";

const createMockUser = (
  login: string,
  followers: number,
  isGitHubStar: boolean,
): User => ({
  login,
  avatarUrl: `https://github.com/${login}.png`,
  name: `Test ${login}`,
  location: "Japan",
  company: "Test Inc.",
  twitterUsername: login,
  isGitHubStar,
  followers: { totalCount: followers },
  contributionsCollection: {
    contributionCalendar: { totalContributions: 0 },
    restrictedContributionsCount: 0,
  },
});

const testUsers: User[] = [
  createMockUser("user1", 100, true),
  createMockUser("user2", 200, false),
];

Deno.test("generateMarkdownTable generates a correct table", () => {
  // Arrange
  const followersMetric: TableMetric = {
    headerName: "Test Followers",
    valueExtractor: (user) => user.followers.totalCount,
  };

  // Act
  const table = generateMarkdownTable(testUsers, followersMetric);

  // Assert
  // ヘッダーが正しく設定されているか
  assertStringIncludes(table, "<th>Test Followers</th>");

  // ユーザーデータが正しく表示されているか
  assertStringIncludes(table, `href="https://github.com/user1"`);
  assertStringIncludes(table, `> user1\n`);
  assertStringIncludes(table, "<td>100</td>");

  assertStringIncludes(table, `href="https://github.com/user2"`);
  assertStringIncludes(table, `> user2\n`);
  assertStringIncludes(table, "<td>200</td>");

  // isGitHubStarが正しく表示されているか
  assertStringIncludes(table, "<td>⭐</td>");

  // 空の配列を渡した場合のテスト
  assertEquals(
    generateMarkdownTable([], followersMetric),
    "<h4>The table is empty</h4>",
  );
});
