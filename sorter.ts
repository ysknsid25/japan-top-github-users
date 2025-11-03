import { User } from "./octkit.ts";

/**
 * ユーザーを Public Contributions の降順でソートする
 * @param users - ソート対象のユーザー配列
 * @returns ソート済みの新しいユーザー配列
 */
export function sortByPublicContributions(users: User[]): User[] {
  const sortedUsers = [...users]; // 副作用を防ぐために配列をコピー
  sortedUsers.sort((a, b) => {
    const publicContributionsA = a.contributionsCollection.contributionCalendar
      .totalContributions -
      a.contributionsCollection.restrictedContributionsCount;
    const publicContributionsB = b.contributionsCollection.contributionCalendar
      .totalContributions -
      b.contributionsCollection.restrictedContributionsCount;
    return publicContributionsB - publicContributionsA;
  });
  return sortedUsers;
}

/**
 * ユーザーを Total Contributions の降順でソートする
 * @param users - ソート対象のユーザー配列
 * @returns ソート済みの新しいユーザー配列
 */
export function sortByTotalContributions(users: User[]): User[] {
  const sortedUsers = [...users]; // 副作用を防ぐために配列をコピー
  sortedUsers.sort((a, b) => {
    const totalContributionsA =
      a.contributionsCollection.contributionCalendar.totalContributions;
    const totalContributionsB =
      b.contributionsCollection.contributionCalendar.totalContributions;
    return totalContributionsB - totalContributionsA;
  });
  return sortedUsers;
}
