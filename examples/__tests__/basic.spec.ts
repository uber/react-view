/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { urls } from "../const";

import { test, expect } from "@playwright/test";

test.describe("Basic knobs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.basic);
    await page.waitForSelector("[data-storyloaded]");
    await page.click('[data-testid="rv-reset"]');
  });
  test("should select size compact, update component and input", async ({
    page,
  }) => {
    const codeOutput = `import * as React from "react";
import { Button, SIZE } from "your-button-component";

export default () => {
  return (
    <Button
      size={SIZE.compact}
      onClick={() => alert("click")}
    >
      Hello
    </Button>
  );
}`;

    await page.click("#size_compact");
    const fontSize = await page.$eval(
      "#example-btn",
      (e) => (e as any).style["font-size"],
    );
    expect(fontSize).toBe("14px");
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  test("should check disabled, update component and input", async ({
    page,
  }) => {
    const codeOutput = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button onClick={() => alert("click")} disabled>
      Hello
    </Button>
  );
}`;
    await page.click("#disabled");
    const isDisabled = await page.$eval(
      "#example-btn",
      (e) => (e as any).disabled,
    );
    expect(isDisabled).toBeTruthy();
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  test("should change the children knob, update component and code", async ({
    page,
  }) => {
    const childrenPropValue = "e2etest";
    const codeOutput = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button onClick={() => alert("click")}>
      e2etest
    </Button>
  );
}`;
    const textareaSelector = '[data-testid="rv-knob-children"] textarea';
    await page.waitForSelector(textareaSelector);
    await page.fill(textareaSelector, childrenPropValue);
    await page.waitForTimeout(300); // waiting for debounce
    const exampleBtn = await page.$("#example-btn");
    await expect(exampleBtn!.textContent()).resolves.toBe(childrenPropValue);
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  test("should change the onClick knob, update component and code", async ({
    page,
  }) => {
    const onClickPropValue = `() => {document.querySelector('h1').innerText = "foo"}`;
    const codeOutput = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button
      onClick={() => {
        document.querySelector("h1").innerText = "foo";
      }}
    >
      Hello
    </Button>
  );
}`;
    await page
      .locator('[data-testid="rv-knob-onClick"] textarea')
      .fill(onClickPropValue);
    await page.waitForTimeout(300); // waiting for debounce
    await page.click("#example-btn");
    const text = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      return h1 ? h1.innerText : "";
    });
    expect(text).toBe("foo");
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const editorText = await page.evaluate(
      (el: any) => el.value,
      editorTextarea,
    );
    expect(editorText).toBe(codeOutput);
  });
});

test.describe("Basic actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.basic);
    await page.waitForSelector("[data-storyloaded]");
    await page.click('[data-testid="rv-reset"]');
  });

  test("should format the code snippet", async ({ page }) => {
    const formattedCode = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button onClick={() => alert("click")}>Hello</Button>
  );
}`;
    const messyCode = `    import * as React from "react";
         import { Button }    from "your-button-component";
    
     export default ()   => {
      return (
              <Button onClick={() => alert("click")}>Hello
        </Button>
      );
}`;
    await page.locator('[data-testid="rv-editor"] textarea').fill(messyCode);
    // for (let i = 0; i < 232; i++) {
    //   await page.keyboard.press("Delete");
    // }
    // await page.keyboard.type(messyCode);
    await page.waitForTimeout(300); // waiting for debounce
    await page.click('[data-testid="rv-format"]');
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el: any) => el.value, editorTextarea);
    expect(text).toBe(formattedCode);
  });
});

test.describe("Basic editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urls.basic);
    await page.waitForSelector("[data-storyloaded]");
    await page.click('[data-testid="rv-reset"]');
  });

  test("should edit the code and update the knob and component", async ({
    page,
  }) => {
    const newCode = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button onClick={() => alert("click")} disabled>Hello</Button>
  );
}`;
    await page.locator('[data-testid="rv-editor"] textarea').fill(newCode);
    await page.waitForTimeout(300); // waiting for debounce
    const isButtonDisabled = await page.$eval(
      "#example-btn",
      (e) => (e as any).disabled,
    );
    expect(isButtonDisabled).toBeTruthy();
    const isDisabledChecked = await page.$eval(
      "#disabled",
      (el) => (el as any).checked,
    );
    expect(isDisabledChecked).toBeTruthy();
  });
});
