import {urls} from './utils';

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(urls.basic);
  });

  it('should display "useView" text on page', async () => {
    await expect(page).toMatch('useView');
  });
});
