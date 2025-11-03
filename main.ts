import { Octokit } from "https://esm.sh/@octokit/core";
import { fetchGitHubUsers } from "./octkit.ts";
import {
  sortByPublicContributions,
  sortByTotalContributions,
} from "./sorter.ts";
import { TableMetric, writeMarkdownFile } from "./write-file.ts";

if (import.meta.main) {
  try {
    const token = Deno.env.get("CUSTOM_TOKEN");
    if (!token) {
      console.error("🚨 Error: CUSTOM_TOKEN is not set.");
      Deno.exit(1);
    }

    const octokit = new Octokit({ auth: token });

    console.log("📶 Fetching GitHub users...");
    const users = await fetchGitHubUsers({ octokit });
    console.log(`Total ${users.length} users found.`);

    // contributionCalendarを持っていないユーザーを除外
    console.log("🔍 Filtering users without contribution data...");
    const filteredUsers = users.filter(
      (user) =>
        user.contributionsCollection &&
        user.contributionsCollection.contributionCalendar,
    );
    console.log(`Filtered down to ${filteredUsers.length} users.`);

    // filteredUsersは最初からフォロワー順なので、そのまま使用
    const sortedByFollowers = filteredUsers;
    const sortedByTotalContributions = sortByTotalContributions(filteredUsers);
    const sortedByPublicContributions = sortByPublicContributions(
      filteredUsers,
    );

    const followersMetric: TableMetric = {
      headerName: "Followers",
      valueExtractor: (user) => user.followers.totalCount,
    };
    const totalContributionsMetric: TableMetric = {
      headerName: "Total Contributions",
      valueExtractor: (user) =>
        user.contributionsCollection.contributionCalendar
          .totalContributions,
    };
    const publicContributionsMetric: TableMetric = {
      headerName: "Public Contributions",
      valueExtractor: (user) =>
        user.contributionsCollection.contributionCalendar
          .totalContributions -
        user.contributionsCollection.restrictedContributionsCount,
    };

    const writePromises = [
      writeMarkdownFile(
        sortedByFollowers,
        followersMetric,
        "docs/followers.md",
      ),
      writeMarkdownFile(
        sortedByTotalContributions,
        totalContributionsMetric,
        "docs/total-contributions.md",
      ),
      writeMarkdownFile(
        sortedByPublicContributions,
        publicContributionsMetric,
        "docs/public-contributions.md",
      ),
    ];

    await Promise.all(writePromises);

    console.log(
      "\n✅ All markdown files have been generated successfully!",
    );
  } catch (error) {
    console.error("An error occurred:", error);
    Deno.exit(1);
  }
}
