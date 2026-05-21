import { test, expect, Page, FrameLocator } from '@playwright/test';

const WP_URL = 'http://localhost:8082';

// REST API でテスト用投稿を作成してエディタを開く
// WordPress 6.1+ はエディタキャンバスが iframe 内なので frameLocator を返す
async function openEditorWithTable(page: Page): Promise<FrameLocator> {
  // wp-admin から REST API nonce を取得
  await page.goto(`${WP_URL}/wp-admin/`);
  const nonce = await page.evaluate(() => (window as any).wpApiSettings?.nonce ?? '');

  const res = await page.request.post(`${WP_URL}/wp-json/wp/v2/posts`, {
    headers: { 'X-WP-Nonce': nonce },
    data: {
      title: 'Table TH Tool Test',
      content: [
        '<!-- wp:table -->',
        '<figure class="wp-block-table">',
        '<table>',
        '<thead><tr><td>Header 1</td><td>Header 2</td></tr></thead>',
        '<tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody>',
        '</table>',
        '</figure>',
        '<!-- /wp:table -->',
      ].join(''),
      status: 'draft',
    },
  });
  const post = await res.json();
  await page.goto(`${WP_URL}/wp-admin/post.php?post=${post.id}&action=edit`);

  // ウェルカムモーダルを閉じる
  const modal = page.locator('.components-modal__screen-overlay');
  if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
    await page.keyboard.press('Escape');
  }

  // エディタキャンバス（iframe）のロードを待つ
  const canvas = page.frameLocator('iframe[name="editor-canvas"]');
  await canvas.locator('.wp-block-table').waitFor({ timeout: 15000 });

  return canvas;
}

// テーブルブロックを選択してサイドバーを「ブロック」タブに切り替える
async function selectTableAndOpenSidebar(page: Page, canvas: FrameLocator) {
  // iframe 内のテーブルをクリックして選択
  await canvas.locator('.wp-block-table').click();

  // サイドバーが閉じていれば開く（サイドバーはメインページ側）
  const sidebar = page.locator('.interface-interface-skeleton__sidebar');
  if (!(await sidebar.isVisible({ timeout: 2000 }).catch(() => false))) {
    await page.getByRole('button', { name: /Settings/ }).first().click();
    await sidebar.waitFor();
  }

  // 「ブロック」タブを選択
  const blockTab = page.getByRole('tab', { name: 'ブロック' }).or(page.getByRole('tab', { name: 'Block' }));
  if (await blockTab.isVisible({ timeout: 2000 }).catch(() => false)) {
    await blockTab.click();
  }

  // 再度テーブルをクリックして選択状態を確定
  await canvas.locator('.wp-block-table').click();
}

// Table Headers パネルを開く（サイドバーはメインページ側）
async function openTableHeadersPanel(page: Page) {
  // 日本語・英語どちらでも対応
  const panelTitle = page.getByText('テーブルヘッダー').or(page.getByText('Table Headers'));
  await expect(panelTitle.first()).toBeVisible({ timeout: 10000 });
}

// ブロックエディタの状態からテーブル属性を取得
async function getTableAttributes(page: Page) {
  return page.evaluate(() => {
    const blocks = (window as any).wp?.data
      ?.select('core/block-editor')
      ?.getBlocks();
    const table = blocks?.find((b: any) => b.name === 'core/table');
    return table?.attributes ?? null;
  });
}

// -------- テスト --------

test.describe('Table TH Tool', () => {
  test('Table Headers パネルがサイドバーに表示される', async ({ page }) => {
    const canvas = await openEditorWithTable(page);
    await selectTableAndOpenSidebar(page, canvas);

    const panel = page.getByText('テーブルヘッダー').or(page.getByText('Table Headers'));
    await expect(panel.first()).toBeVisible({ timeout: 10000 });
  });

  test('先頭行を TH に切り替えられる', async ({ page }) => {
    const canvas = await openEditorWithTable(page);
    await selectTableAndOpenSidebar(page, canvas);
    await openTableHeadersPanel(page);

    const toggle = page.getByLabel('先頭行をヘッダーにする').or(page.getByLabel('First Row as Header'));
    await expect(toggle.first()).toBeVisible();

    // 初期状態を確認（thead のセルが td）
    const before = await getTableAttributes(page);
    const firstRow = before?.head?.[0] ?? before?.body?.[0];
    expect(firstRow?.cells.every((c: any) => c.tag === 'td')).toBe(true);

    await toggle.first().click();

    const after = await getTableAttributes(page);
    const firstRowAfter = after?.head?.[0] ?? after?.body?.[0];
    expect(firstRowAfter?.cells.every((c: any) => c.tag === 'th')).toBe(true);
  });

  test('先頭行を TH → TD に戻せる', async ({ page }) => {
    const canvas = await openEditorWithTable(page);
    await selectTableAndOpenSidebar(page, canvas);
    await openTableHeadersPanel(page);

    const toggle = page.getByLabel('先頭行をヘッダーにする').or(page.getByLabel('First Row as Header'));
    await toggle.first().click();
    await toggle.first().click();

    const attrs = await getTableAttributes(page);
    const firstRow = attrs?.head?.[0] ?? attrs?.body?.[0];
    expect(firstRow?.cells.every((c: any) => c.tag === 'td')).toBe(true);
  });

  test('先頭列を TH に切り替えられる', async ({ page }) => {
    const canvas = await openEditorWithTable(page);
    await selectTableAndOpenSidebar(page, canvas);
    await openTableHeadersPanel(page);

    const toggle = page.getByLabel('先頭列をヘッダーにする').or(page.getByLabel('First Column as Header'));
    await expect(toggle.first()).toBeVisible();
    await toggle.first().click();

    const attrs = await getTableAttributes(page);
    const sections = ['head', 'body', 'foot'].map(k => attrs?.[k]).filter(Boolean);
    for (const section of sections) {
      for (const row of section) {
        if (row.cells.length > 0) {
          expect(row.cells[0].tag).toBe('th');
        }
      }
    }
  });

  test('先頭列を TH → TD に戻せる', async ({ page }) => {
    const canvas = await openEditorWithTable(page);
    await selectTableAndOpenSidebar(page, canvas);
    await openTableHeadersPanel(page);

    const toggle = page.getByLabel('先頭列をヘッダーにする').or(page.getByLabel('First Column as Header'));
    await toggle.first().click();
    await toggle.first().click();

    const attrs = await getTableAttributes(page);
    const sections = ['head', 'body', 'foot'].map(k => attrs?.[k]).filter(Boolean);
    for (const section of sections) {
      for (const row of section) {
        if (row.cells.length > 0) {
          expect(row.cells[0].tag).toBe('td');
        }
      }
    }
  });
});
