/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { test, expect } from "@playwright/test";
import { urls } from "../const";

test.describe("Live Code Only", () => {
  test("should compile the code and render component", async ({ page }) => {
    await page.goto(urls.liveCodeOnly);
    await page.waitForSelector("[data-storyloaded]");
    const inputCode = `<Button onClick={() => alert("click")}>Hey</Button>`;
    await page.locator("textarea").first().fill(inputCode);
    await page.waitForTimeout(300); // waiting for debounce
    const button = await page.$("button");
    expect(await button!.textContent()).toBe("Hey");
  });
});
