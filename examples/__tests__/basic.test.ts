/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { urls } from "../const";

jest.setTimeout(20 * 1000);

describe("Basic knobs", () => {
  beforeAll(async () => {
    await page.goto(urls.basic);
  });

  beforeEach(async () => {
    await page.click('[data-testid="rv-reset"]');
  });

  it("should select size compact, update component and input", async () => {
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
    const text = await page.evaluate((el) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  it("should check disabled, update component and input", async () => {
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
    const text = await page.evaluate((el) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  it("should change the children knob, update component and code", async () => {
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
    await page.focus('[data-testid="rv-knob-children"] textarea');
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Delete");
    }
    await page.keyboard.type(childrenPropValue);
    await expect(page).toMatchElement("#example-btn", {
      text: childrenPropValue,
    });
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el) => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  it("should change the onClick knob, update component and code", async () => {
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
    await page.focus('[data-testid="rv-knob-onClick"] textarea');
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Delete");
    }
    await page.keyboard.type(onClickPropValue);
    await page.waitFor(300); // waiting for debounce
    await page.click("#example-btn");
    const text = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      return h1 ? h1.innerText : "";
    });
    expect(text).toBe("foo");
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const editorText = await page.evaluate((el) => el.value, editorTextarea);
    expect(editorText).toBe(codeOutput);
  });
});

describe("Basic actions", () => {
  beforeAll(async () => {
    await page.goto(urls.basic);
  });

  beforeEach(async () => {
    await page.click('[data-testid="rv-reset"]');
  });

  it("should format the code snippet", async () => {
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
    await page.focus('[data-testid="rv-editor"] textarea');
    for (let i = 0; i < 232; i++) {
      await page.keyboard.press("Delete");
    }
    await page.keyboard.type(messyCode);
    await page.waitFor(300); // waiting for debounce
    await page.click('[data-testid="rv-format"]');
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate((el) => el.value, editorTextarea);
    expect(text).toBe(formattedCode);
  });
});

describe("Basic editor", () => {
  beforeAll(async () => {
    await page.goto(urls.basic);
  });

  beforeEach(async () => {
    await page.click('[data-testid="rv-reset"]');
  });

  it("should edit the code and update the knob and component", async () => {
    const newCode = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button onClick={() => alert("click")} disabled>Hello</Button>
  );
}`;
    await page.focus('[data-testid="rv-editor"] textarea');
    for (let i = 0; i < 232; i++) {
      await page.keyboard.press("Delete");
    }
    await page.keyboard.type(newCode);
    await page.waitFor(300); // waiting for debounce
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
