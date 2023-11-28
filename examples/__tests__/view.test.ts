/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { urls } from "../const";

jest.setTimeout(20 * 1000);

describe.only("View", () => {
  beforeAll(async () => {
    await page.goto(urls.view);
  });

  it('should render the button with "Hello" label', async () => {
    await expect(page).toMatchElement("button", {
      text: "Hello",
    });
  });

  it("should generate the correct code snippet", async () => {
    const codeOutput = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button onClick={() => alert("click")}>Hello</Button>
  );
}`;
    const text = await page.evaluate(
      (el) => el.value,
      await page.$('[data-testid="rv-editor"] textarea'),
    );
    expect(text).toBe(codeOutput);
  });
});
