/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { urls } from "../const";

jest.setTimeout(20 * 1000);

describe.only("Typescript", () => {
  beforeAll(async () => {
    await page.goto(urls.liveCodeOnly);
  });

  it("should compile the code and render component", async () => {
    const inputCode = `() => {
  const num1: number = 13;
  const num2: number = 4;
  return num1 * num2;
}`;

    await page.focus("textarea");
    for (let i = 0; i < 67; i++) {
      await page.keyboard.press("Delete");
    }
    await page.keyboard.type(inputCode);
    await page.waitFor(300); // waiting for debounce
    await expect(page).toMatch("52");
  });
});
