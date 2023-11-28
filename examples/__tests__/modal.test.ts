/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { urls } from "../const";

jest.setTimeout(20 * 1000);

describe.only("Modal", () => {
  beforeAll(async () => {
    await page.goto(urls.modal);
  });

  it("open, close and open the modal", async () => {
    await (await page.$("#show"))?.click();
    await page.waitFor(300); // waiting for debounce
    expect((await page.$("#close-modal")) !== null).toBeTruthy();
    (await page.$("#close-modal"))?.click();
    await page.waitFor(500); // waiting for debounce
    expect((await page.$("#close-modal")) !== null).toBeFalsy();
    await (await page.$("#show"))?.click();
    await page.waitFor(300); // waiting for debounce
    expect((await page.$("#close-modal")) !== null).toBeTruthy();
  });
});
