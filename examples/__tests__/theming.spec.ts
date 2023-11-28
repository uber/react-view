/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { test, expect } from "@playwright/test";
import { urls } from "../const";

const initialCode = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return <Button>Hello</Button>;
}`;

test.describe("Theming", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.theming);
    await page.waitForSelector("[data-storyloaded]");
  });

  test("should change the theme, add provider and update the component", async ({
    page,
  }) => {
    await page.click('[data-testid="rv-reset"]');
    const hotpinkCode = `import * as React from "react";
import { Button } from "your-button-component";
import { ThemeProvider } from "your-component-library";

export default () => {
  return (
    <ThemeProvider
      colors={{
        background: "hotpink"
      }}
    >
      <Button>Hello</Button>
    </ThemeProvider>
  );
}`;
    const initialEditor = await page.evaluate(
      (el: any) => el.value,
      await page.$('[data-testid="rv-editor"] textarea'),
    );
    expect(initialEditor).toBe(initialCode);
    await page.locator('[data-testid="background"] textarea').fill("hotpink");
    await page.waitForTimeout(600); // waiting for debounce

    const exampleBtn = await page.$("#example-btn");
    expect(await exampleBtn!.evaluate((e: any) => e.style["background"])).toBe(
      "hotpink",
    );
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(hotpinkCode);
  });

  test("should reset provider values and get the initial state of code and component", async ({
    page,
  }) => {
    await page.click('[data-testid="rv-reset"]');
    const editor = await page.evaluate(
      (el: any) => el.value,
      await page.$('[data-testid="rv-editor"] textarea'),
    );
    expect(editor).toBe(initialCode);
    const background = await page.$eval(
      "#example-btn",
      (e) => (e as any).style["background"],
    );
    expect(background).toBe("rgb(39, 110, 241)");
  });
});
