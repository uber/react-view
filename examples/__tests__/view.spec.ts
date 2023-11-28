/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { test, expect } from "@playwright/test";
import { urls } from "../const";

test.describe("View", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.view);
    await page.waitForSelector("[data-storyloaded]");
  });

  test('should render the button with "Hello" label', async ({ page }) => {
    expect(await page.textContent("button")).toContain("Hello");
  });

  test("should generate the correct code snippet", async ({ page }) => {
    const codeOutput = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button onClick={() => alert("click")}>Hello</Button>
  );
}`;
    const text = await page.evaluate(
      (el: any) => el.value,
      await page.$('[data-testid="rv-editor"] textarea'),
    );
    expect(text).toBe(codeOutput);
  });
});
