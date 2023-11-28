/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { test, expect } from "@playwright/test";
import { urls } from "../const";

test.describe("Typescript", () => {
  test("should compile the code and render component", async ({ page }) => {
    await page.goto(urls.liveCodeOnly);
    await page.waitForSelector("[data-storyloaded]");
    const inputCode = `() => {
  const num1: number = 13;
  const num2: number = 4;
  return num1 * num2;
}`;

    await page.locator("textarea").first().fill(inputCode);
    await page.waitForTimeout(300); // waiting for debounce
    expect(await page.textContent("body")).toContain("52");
  });
});
