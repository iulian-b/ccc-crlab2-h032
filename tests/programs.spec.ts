import { test, expect, openDesktop, windowTitled, desktopIcon, skipWithoutWebAudio } from './fixtures';

test('Notepad inserts the time and date, and saves files', async ({ page }) => {
	await page.goto('/programs/notepad/index.html');
	const textarea = page.locator('#document-textarea');
	await textarea.fill('hello');
	await textarea.press('End');
	await textarea.press('F5');
	await expect(textarea).toHaveValue(/^hello\d{1,2}:\d{2} [AP]M \d{1,2}\/\d{1,2}\/\d{4}$/);

	const [download] = await Promise.all([page.waitForEvent('download'), page.evaluate(() => (window as any).file_save_as())]);
	expect(download.suggestedFilename()).toBe('Untitled.txt');
	const saved = require('fs').readFileSync(await download.path(), 'utf8');
	expect(saved).toBe(await textarea.inputValue());
});

test('Calculator can do some math', async ({ page }) => {
	await openDesktop(page);
	await desktopIcon(page, 'Calculator').dblclick();
	const calculator = page.frameLocator('iframe[src*="programs/calculator"]');
	await calculator.getByRole('button', { name: '1' }).click();
	await calculator.getByLabel('add').click();
	await calculator.getByRole('button', { name: '2' }).click();
	await calculator.getByLabel('equals').click();
	await expect(calculator.getByRole('textbox')).toHaveValue('3');
});

test('Explorer lists a folder and can start renaming a file', async ({ page }) => {
	await openDesktop(page);
	await desktopIcon(page, 'My Documents').dblclick();
	const explorer = page.frameLocator('iframe[src*="programs/explorer"]');
	await expect(explorer.getByText(/^\d+ object\(s\)$/)).toBeVisible();
	const folder = explorer.frameLocator('iframe');
	const item = folder.locator('.desktop-icon').filter({ hasText: 'CV (EN).pdf' });
	await item.click();
	await expect(item).toHaveClass(/(^|\s)selected(\s|$)/);
	await page.waitForTimeout(1000); // avoid a double click
	await item.click();
	await expect(folder.getByRole('textbox')).toBeFocused();
	await expect(folder.getByRole('textbox')).toHaveValue('CV (EN).pdf');
});

test('PicView shows a picture', async ({ page }) => {
	await openDesktop(page);
	await page.evaluate(() => (window as any).systemExecuteFile('/My Pictures/20170225_160324.jpg'));
	const picture = page.frameLocator('iframe[src*="programs/picview"]').locator('#pic');
	await expect(picture).toHaveAttribute('src', '/My%20Pictures/20170225_160324.jpg');
	await expect.poll(() => picture.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
});

test('PDF Viewer embeds the document', async ({ page }) => {
	await openDesktop(page);
	await desktopIcon(page, 'CV (RO).pdf').dblclick();
	const embed = page.frameLocator('iframe[src*="programs/pdfviewer"]').locator('embed');
	await expect(embed).toHaveAttribute('src', '/My%20Documents/CV%20(RO).pdf');
});

test('Sound Recorder has its position slider', async ({ page }) => {
	await openDesktop(page);
	await skipWithoutWebAudio(page);
	await desktopIcon(page, 'Sound Recorder').dblclick();
	await expect(page.frameLocator('iframe[src*="programs/sound-recorder"]').locator('.ui-slider-handle')).toBeVisible();
});

test('MS-DOS Prompt boots the emulator', async ({ page }) => {
	test.slow(); // downloads and starts a 5 MB emulator
	await openDesktop(page);
	await desktopIcon(page, 'Terminal').dblclick();
	await expect(page.frameLocator('iframe[src*="programs/command"]').locator('#dosbox canvas')).toBeVisible({ timeout: 45_000 });
});

test('Winamp plays a song, and can be closed and opened again', async ({ page }) => {
	await openDesktop(page);
	await skipWithoutWebAudio(page);
	await page.evaluate(() => (window as any).systemExecuteFile('/My Music/blue.mp3'));
	await expect(page.locator('.tasks .task .title', { hasText: /^1\. blue - Winamp/ })).toBeVisible({ timeout: 15_000 });
	await page.evaluate('winamp_interface.close()');
	await expect(page.locator('#webamp')).toHaveCount(0);
	await page.evaluate(() => (window as any).openWinamp());
	await expect(page.locator('#webamp #main-window')).toBeVisible({ timeout: 15_000 });
});

test('VMware boots this site as its guest OS', async ({ page }) => {
	await openDesktop(page);
	await desktopIcon(page, 'VMware 2.0').dblclick();
	const guest = page.frameLocator('iframe[src*="programs/vmware"]').frameLocator('iframe');
	await expect(guest.locator('#taskbar')).toBeVisible({ timeout: 15_000 });
	await expect(guest.locator('.desktop-icon').first()).toBeVisible();
});

test('Paint can open a file dropped onto the desktop', async ({ page, browserName }) => {
	test.skip(browserName === 'webkit', 'WebKit does not support DataTransferItemList fully');
	await openDesktop(page);
	const buffer = require('fs').readFileSync(require('path').resolve(__dirname, '..', 'images', 'start.png'));
	// Named .bmp so it opens in Paint (.png opens in PicView); Paint goes by the content, which is a PNG
	const dataTransfer = await page.evaluateHandle((hex) => {
		const dt = new DataTransfer();
		const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
		dt.items.add(new File([bytes], 'start.bmp', { type: 'image/bmp' }));
		return dt;
	}, buffer.toString('hex'));
	await page.locator('.desktop .folder-view').dispatchEvent('drop', { dataTransfer, clientX: 400, clientY: 300 });
	await desktopIcon(page, 'start.bmp').dblclick();
	const paint = page.frameLocator('iframe[src*="programs/jspaint"]');
	await expect(paint.locator('.main-canvas')).toHaveAttribute('width', '16');
	await expect(paint.locator('.main-canvas')).toHaveAttribute('height', '14');
	await expect(windowTitled(page, /Paint$/)).toBeVisible();
});

test('Paint can set the wallpaper (tiled)', async ({ page }) => {
	test.skip(!!process.env.CI, 'JS Paint needs WebGL, which CI runners lack');
	await openDesktop(page);
	await desktopIcon(page, 'Paint').dblclick();
	const paint = page.frameLocator('iframe[src*="programs/jspaint"]');
	// Paint's menus are part of the desktop's window, outside the iframe
	await page.getByText('Image', { exact: true }).click();
	await page.getByText('Attributes...').click();
	await paint.getByLabel('Width:').fill('10');
	await paint.getByLabel('Height:').fill('10');
	await paint.getByLabel('Height:').press('Enter');
	await paint.getByTitle('Fill With Color').click();
	await paint.locator('.swatch:nth-child(18)').click();
	await paint.locator('.main-canvas').click({ position: { x: 5, y: 5 } });
	await page.getByRole('menuitem', { name: 'File' }).click();
	await page.getByText('Set As Wallpaper (Tiled)').click();
	await expect(page.locator('.desktop')).toHaveCSS('background-image', /url\("blob:/);
});
