/**
 * nullまたは空の文字列をチェックし、空文字を返す
 * @param name - The name to format.
 * @returns The formatted name.
 */
export function getName(name: string | null): string {
  return name || "";
}

/**
 * nullまたは空の文字列をチェックし、空文字を返す
 * @param company - The company to format.
 * @returns The formatted company.
 */
export function getCompany(company: string | null): string {
  return company || "";
}

/**
 * Twitterのユーザー名をMarkdownリンク形式に変換する
 * @param twitterUsername - The Twitter username.
 * @returns The formatted Twitter username as a Markdown link.
 */
export function getTwitterUsername(twitterUsername: string | null): string {
  if (!twitterUsername) {
    return "";
  }
  return `[@${twitterUsername}](https://twitter.com/${twitterUsername})`;
}
