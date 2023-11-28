/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { test, expect } from "@playwright/test";
import { urls } from "../const";

test.describe("Modal", () => {
  test("open, close and open the modal", async ({ page }) => {
    await page.goto(urls.modal);
    await page.waitForSelector("[data-storyloaded]");
    await (await page.$("#show"))?.click();
    await page.waitForTimeout(300); // waiting for debounce
    expect((await page.$("#close-modal")) !== null).toBeTruthy();
    (await page.$("#close-modal"))?.click();
    await page.waitForTimeout(500); // waiting for debounce
    expect((await page.$("#close-modal")) !== null).toBeFalsy();
    await (await page.$("#show"))?.click();
    await page.waitForTimeout(300); // waiting for debounce
    expect((await page.$("#close-modal")) !== null).toBeTruthy();
  });
});
