import {urls} from './utils';

describe.only('State hook', () => {
  beforeAll(async () => {
    await page.goto(urls.stateHook);
  });

  beforeEach(async () => {
    await page.click('[data-testid="rv-reset"]');
  });

  it('should update the input and sync the knob and code', async () => {
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

    await page.focus('#example-input');
    await page.keyboard.type('Foo');
    await page.waitFor(300); // waiting for debounce

    const valueKnob = await page.$('[data-testid="rv-knob-value"] textarea');
    const valueText = await page.evaluate(el => el.value, valueKnob);
    expect(valueText).toBe('HelloFoo');

    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate(el => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });

  it('should update the value knob and sync with component and code', async () => {
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

    await page.focus('[data-testid="rv-knob-value"] textarea');
    await page.keyboard.type('Foo');
    await page.waitFor(300); // waiting for debounce

    const input = await page.$('#example-input');
    const inputValue = await page.evaluate(el => el.value, input);
    expect(inputValue).toBe('HelloFoo');

    const editorTextarea = await page.$('[data-testid="rv-editor"] textarea');
    const text = await page.evaluate(el => el.value, editorTextarea);
    expect(text).toBe(codeOutput);
  });
});
