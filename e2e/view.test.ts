import {urls} from './utils';

describe.only('View', () => {
  beforeAll(async () => {
    await page.goto(urls.view);
  });

  it('should render the button with "Hello" label', async () => {
    await expect(page).toMatchElement('button', {
      text: 'Hello',
    });
  });

  it('should generate the correct code snippet', async () => {
    const codeOutput = `import * as React from "react";
import { Button } from "your-button-component";

export default () => {
  return (
    <Button onClick={() => alert("click")}>Hello</Button>
  );
}`;
    const text = await page.evaluate(
      el => el.value,
      await page.$('[data-testid="rv-editor"] textarea')
    );
    expect(text).toBe(codeOutput);
  });
});
