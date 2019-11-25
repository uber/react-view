import {urls} from '../const';

jest.setTimeout(20 * 1000);

describe.only('Live Code Only', () => {
  beforeAll(async () => {
    await page.goto(urls.liveCodeOnly);
  });

  it('should compile the code and render component', async () => {
    const inputCode = `<Button onClick={() => alert("click")}>Hey</Button>`;

    await page.focus('textarea');
    for (let i = 0; i < 98; i++) {
      await page.keyboard.press('Delete');
    }
    await page.keyboard.type(inputCode);
    await page.waitFor(300); // waiting for debounce

    await expect(page).toMatchElement('button', {
      text: 'Hey',
    });
  });
});
