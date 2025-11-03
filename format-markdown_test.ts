import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { getCompany, getName, getTwitterUsername } from "./format-markdown.ts";

Deno.test("getName returns the name if it exists", () => {
  assertEquals(getName("Test User"), "Test User");
});

Deno.test("getName returns an empty string for null or empty input", () => {
  assertEquals(getName(null), "");
  assertEquals(getName(""), "");
});

Deno.test("getCompany returns the company if it exists", () => {
  assertEquals(getCompany("Test Inc."), "Test Inc.");
});

Deno.test("getCompany returns an empty string for null or empty input", () => {
  assertEquals(getCompany(null), "");
  assertEquals(getCompany(""), "");
});

Deno.test("getTwitterUsername returns a formatted markdown link if username exists", () => {
  assertEquals(
    getTwitterUsername("testuser"),
    "[@testuser](https://twitter.com/testuser)",
  );
});

Deno.test("getTwitterUsername returns an empty string for null or empty input", () => {
  assertEquals(getTwitterUsername(null), "");
  assertEquals(getTwitterUsername(""), "");
});
