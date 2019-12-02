/*
Copyright (c) 2019 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import {urls} from '../const';

jest.setTimeout(20 * 1000);

const initialCode = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return <Button>Hello</Button>;
}`;

describe('Theming', () => {
  beforeAll(async () => {
    await page.goto(urls.theming);
  });

  it('should change the theme, add provider and update the component', async () => {
    await page.click('[data-testid="rv-reset"]');
    const hotpinkCode = `import * as React from "react";
import { Button } from "your-button-component";
import { ThemeProvider } from "your-component-library";

export default () => {
  return (
    <ThemeProvider colors={{ background: "hotpink" }}>
      <Button>Hello</Button>
    </ThemeProvider>
  );
}`;
    const initialEditor = await page.evaluate(
      el => el.value,
      await page.$('[data-testid="rv-editor"] textarea')
    );
    expect(initialEditor).toBe(initialCode);
    await page.click('[data-testid="background"] textarea', {clickCount: 3});
    await page.keyboard.press('Delete');
    await page.keyboard.type('hotpink');
    await page.waitFor(
      () =>
        (document.querySelector('#example-btn') as any).style['background'] ===
        'hotpink'
    );
    const hotpinkEditor = await page.evaluate(
      el => el.value,
      await page.$('[data-testid="rv-editor"] textarea')
    );
    expect(hotpinkEditor).toBe(hotpinkCode);
  });

  it('should reset provider values and get the initial state of code and component', async () => {
    await page.click('[data-testid="rv-reset"]');
    const editor = await page.evaluate(
      el => el.value,
      await page.$('[data-testid="rv-editor"] textarea')
    );
    expect(editor).toBe(initialCode);
    const background = await page.$eval(
      '#example-btn',
      e => (e as any).style['background']
    );
    expect(background).toBe('rgb(39, 110, 241)');
  });
});
