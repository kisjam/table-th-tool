import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const WP_URL = 'http://localhost:8082';
const WP_ADMIN = 'kisjam';
const WP_PASSWORD = 'password';

async function globalSetup() {
  const authDir = path.join(__dirname, '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // WordPress が起動するまで待機
  console.log('WordPress の起動を待っています...');
  for (let i = 0; i < 30; i++) {
    try {
      const res = await page.goto(WP_URL, { timeout: 5000 });
      if (res && res.status() < 500) break;
    } catch {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // 未インストールなら初期セットアップ
  if (page.url().includes('install.php')) {
    console.log('WordPress をインストールしています...');
    await page.fill('#weblog_title', 'Table TH Tool Test');
    await page.fill('#user_login', WP_ADMIN);
    await page.locator('#pass1-text').fill(WP_PASSWORD);
    const weakCheck = page.locator('#pw-weak');
    if (await weakCheck.isVisible({ timeout: 2000 }).catch(() => false)) {
      await weakCheck.check();
    }
    await page.fill('#admin_email', 'test@example.com');
    await page.click('#submit');
    await page.waitForURL('**/install.php?step=2**', { timeout: 30000 });
    await page.getByRole('link', { name: 'Log In' }).click();
  }

  // ログイン
  console.log('ログインしています...');
  await page.goto(`${WP_URL}/wp-login.php`);
  await page.fill('#user_login', WP_ADMIN);
  await page.fill('#user_pass', WP_PASSWORD);
  await page.click('#wp-submit');
  await page.waitForURL('**/wp-admin/**', { timeout: 30000 });

  // プラグイン有効化
  await page.goto(`${WP_URL}/wp-admin/plugins.php`);
  const activateLink = page.locator('tr[data-slug="table-th-tool"] .activate a');
  if (await activateLink.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('プラグインを有効化しています...');
    await activateLink.click();
    await page.waitForURL('**/plugins.php**');
  }

  // 認証状態を保存
  await context.storageState({ path: path.join(authDir, 'admin.json') });
  await browser.close();
  console.log('セットアップ完了');
}

export default globalSetup;
