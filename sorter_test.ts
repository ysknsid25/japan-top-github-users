import {
  assertEquals,
  assertNotStrictEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  sortByPublicContributions,
  sortByTotalContributions,
} from "./sorter.ts";
import { User } from "./octkit.ts";

const createMockUser = (
  login: string,
  totalContributions: number,
  restrictedContributionsCount: number,
): User => ({
  login,
  avatarUrl: "",
  name: "",
  location: "",
  company: "",
  twitterUsername: "",
  isGitHubStar: false,
  followers: { totalCount: 0 },
  contributionsCollection: {
    contributionCalendar: { totalContributions },
    restrictedContributionsCount,
  },
});

const userA = createMockUser("userA", 100, 20); // public: 80
const userB = createMockUser("userB", 120, 50); // public: 70
const userC = createMockUser("userC", 90, 0); // public: 90

const unsortedUsers: User[] = [userA, userB, userC];

Deno.test(
  "sortByPublicContributions sorts users by public contributions descending",
  () => {
    // Arrange
    const originalUsers = [...unsortedUsers];

    // Act
    const sortedUsers = sortByPublicContributions(originalUsers);

    // Assert
    assertEquals(
      sortedUsers.map((u) => u.login),
      ["userC", "userA", "userB"],
    );
    assertEquals(originalUsers, unsortedUsers);
    assertNotStrictEquals(sortedUsers, originalUsers);
  },
);

Deno.test(
  "sortByTotalContributions sorts users by total contributions descending",
  () => {
    // Arrange
    const originalUsers = [...unsortedUsers];

    // Act
    const sortedUsers = sortByTotalContributions(originalUsers);

    // Assert
    assertEquals(
      sortedUsers.map((u) => u.login),
      ["userB", "userA", "userC"],
    );
    assertEquals(originalUsers, unsortedUsers);
    assertNotStrictEquals(sortedUsers, originalUsers);
  },
);
