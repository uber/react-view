/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

import { test, expect } from "@playwright/test";
import { urls } from "../const";

test.describe("Basic knobs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.customProps);
    await page.waitForSelector("[data-storyloaded]");
    await page.click('[data-testid="rv-reset"]');
  });

  test("should output initial code", async ({ page }) => {
    const codeOutput = `import * as React from "react";
import { Rating } from "your-rating-component";

export default () => {
  const [value, setValue] = React.useState(3);
  return (
    <Rating
      value={value}
      onChange={value => setValue(value)}
    />
  );
}`;
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  test("should select 4 hearts and update the slider and code", async ({
    page,
  }) => {
    const codeOutput = `import * as React from "react";
import { Rating } from "your-rating-component";

export default () => {
  const [value, setValue] = React.useState(4);
  return (
    <Rating
      value={value}
      onChange={value => setValue(value)}
    />
  );
}`;
    await page.click("#heart-4");
    await page.waitForTimeout(300); // debounce time
    const inputValue = await page.$eval("input", (e) => (e as any).value);
    expect(inputValue).toBe("4");
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });
});
