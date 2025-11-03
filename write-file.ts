import { User } from "./octkit.ts";
import * as formatMarkdown from "./format-markdown.ts";

/**
 * テーブルの指標を定義するオブジェクトの型
 * headerName: テーブルのヘッダーに表示する名前
 * valueExtractor: Userオブジェクトから表示する値を抽出する関数
 */
export type TableMetric = {
  headerName: string;
  valueExtractor: (user: User) => string | number;
};

/**
 * ユーザーデータからMarkdownテーブル（HTML形式）を生成する
 * @param users - ユーザー情報の配列
 * @param metric - テーブルの指標を定義するオブジェクト
 * @returns 生成されたMarkdownテーブルの文字列
 */
export function generateMarkdownTable(
  users: User[],
  metric: TableMetric,
): string {
  if (!users || users.length === 0) {
    return "<h4>The table is empty</h4>";
  }

  let table = `<table>\n`;
  table += `\t<tr>\n`;
  table += `\t\t<th>#</th>\n`;
  table += `\t\t<th>Name</th>\n`;
  table += `\t\t<th>Company</th>\n`;
  table += `\t\t<th>GitHub Stars</th>\n`;
  table += `\t\t<th>Twitter Username</th>\n`;
  table += `\t\t<th>Location</th>\n`;
  table += `\t\t<th>${metric.headerName}</th>\n`;
  table += `\t</tr>\n`;

  for (const [index, user] of users.entries()) {
    if (index >= 1000) break;

    const valueCell = metric.valueExtractor(user);

    table += `\t<tr>\n`;
    table += `\t\t<td>${index + 1}</td>\n`;
    table += `\t\t<td>\n`;
    table += `\t\t\t<a href="https://github.com/${user.login}">\n`;
    table +=
      `\t\t\t\t<img src="${user.avatarUrl}" width="24" alt="Avatar of ${user.login}"> ${user.login}\n`;
    table += `\t\t\t</a><br/>\n`;
    table += `\t\t\t${formatMarkdown.getName(user.name)}\n`;
    table += `\t\t</td>\n`;
    table += `\t\t<td>${formatMarkdown.getCompany(user.company)}</td>\n`;
    table += `\t\t<td>${user.isGitHubStar ? "⭐" : ""}</td>\n`;
    table += `\t\t<td>${
      formatMarkdown.getTwitterUsername(
        user.twitterUsername,
      )
    }</td>\n`;
    table += `\t\t<td>${user.location}</td>\n`;
    table += `\t\t<td>${valueCell}</td>\n`;
    table += `\t</tr>\n`;
  }

  table += `</table>\n\n`;
  return table;
}

/**
 * 指定された情報で単一のMarkdownファイルを書き出す
 * @param users - 書き出すユーザー情報の配列
 * @param metric - テーブルの指標
 * @param filename - 出力するファイル名
 */
export async function writeMarkdownFile(
  users: User[],
  metric: TableMetric,
  filename: string,
): Promise<void> {
  console.log(`Generating ${filename}...`);
  const timestamp = new Date().toLocaleString("ja-JP");
  const header =
    `一定以上のフォロワー数を持つ日本のGitHubユーザーの${timestamp}時点でのランキングです。`;
  const tableContent = generateMarkdownTable(users, metric);
  const finalContent = `${header}\n\n${tableContent}`;
  await Deno.writeTextFile(filename, finalContent);
  console.log(`🖋 ${filename} has been written.`);
}
