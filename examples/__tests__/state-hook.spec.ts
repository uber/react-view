/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { test, expect } from "@playwright/test";
import { urls } from "../const";

test.describe("State hook", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.stateHook);
    await page.waitForSelector("[data-storyloaded]");
    await page.click('[data-testid="rv-reset"]');
  });

  test("should update the input and sync the knob and code", async ({
    page,
  }) => {
    const codeOutput = `import * as React from "react";
import { Input } from "your-input-component";

export default () => {
  const [value, setValue] = React.useState("HelloFoo");
  return (
    <Input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}`;

    await page.locator("#example-input").fill("HelloFoo");
    await page.waitForTimeout(300); // waiting for debounce

    const valueKnob = await page.$('[data-testid="rv-knob-value"] textarea');
    const valueText = await page.evaluate((el: any) => el.value, valueKnob);
    expect(valueText).toBe("HelloFoo");

    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  test("should update the value knob and sync with component and code", async ({
    page,
  }) => {
    const codeOutput = `import * as React from "react";
import { Input } from "your-input-component";

export default () => {
  const [value, setValue] = React.useState("HelloFoo");
  return (
    <Input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}`;

    await page
      .locator('[data-testid="rv-knob-value"] textarea')
      .fill("HelloFoo");
    await page.waitForTimeout(300); // waiting for debounce

    const input = await page.$("#example-input");
    const inputValue = await page.evaluate((el: any) => el.value, input);
    expect(inputValue).toBe("HelloFoo");

    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  test("should respect the default boolean value, uncheck editable and update component and input", async ({
    page,
  }) => {
    const initialCode = `import * as React from "react";
import { Input } from "your-input-component";

export default () => {
  const [value, setValue] = React.useState("Hello");
  return (
    <Input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}`;
    const resultCode = `import * as React from "react";
import { Input } from "your-input-component";

export default () => {
  const [value, setValue] = React.useState("Hello");
  return (
    <Input
      value={value}
      onChange={e => setValue(e.target.value)}
      editable={false}
    />
  );
}`;
    const initialEditor = await page.evaluate(
      (el: any) => el.value,
      await page.$('[data-testid="rv-editor"] textarea'),
    );
    expect(initialEditor).toBe(initialCode);

    await page.click("#editable");
    const isDisabled = await page.$eval(
      "#example-input",
      (e: any) => (e as any).disabled,
    );
    expect(isDisabled).toBeTruthy();
    const resultEditor = await page.evaluate(
      (el: any) => el.value,
      await page.$('[data-testid="rv-editor"] textarea'),
    );
    expect(resultEditor).toBe(resultCode);
  });
});
