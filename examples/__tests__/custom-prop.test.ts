import {urls} from '../const';

jest.setTimeout(20 * 1000);

describe('Basic knobs', () => {
  beforeAll(async () => {
    await page.goto(urls.customProps);
  });

  beforeEach(async () => {
    await page.click('[data-testid="rv-reset"]');
  });

  it('should output initial code', async () => {
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
    const text = await page.evaluate(el => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  it('should select 4 hearts and update the slider and code', async () => {
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
    await page.click('#heart-4');
    await page.waitFor(300); // debounce time
    const inputValue = await page.$eval('input', e => (e as any).value);
    expect(inputValue).toBe('4');
    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate(el => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });
});
