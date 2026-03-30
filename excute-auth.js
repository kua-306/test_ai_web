// execute-auth.js
const { chromium } = require('playwright/test');
const { performLogin, saveAuthArtifacts } = require('./auth'); // Thư viện của bạn
const path = require('path');

(async () => {
    console.log('--- ĐANG TẠO TOKEN TRÊN MÁY ẢO ---');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 1. Mở trang app (Dùng đường dẫn tuyệt đối)
        const appPath = 'file://' + path.resolve(__dirname, 'app.html');
        await page.goto(appPath);

        // 2. Đăng nhập (Dùng tài khoản thune@gmail.com đã có trong DB)
        const credentials = {
            username: 'thune@gmail.com',
            password: 'your-password-here' // Nhớ thay pass chuẩn của bạn
        };

        const loginResult = await performLogin(page, credentials);

        // 3. Lưu Token ra file
        await saveAuthArtifacts(context, loginResult.accessToken, loginResult.selectors, appPath);

        console.log('✅ ĐÃ LƯU TOKEN THÀNH CÔNG!');
    } catch (error) {
        console.error('❌ LỖI SETUP AUTH:', error.message);
        process.exit(1); // Để GitHub báo đỏ nếu không lấy được token
    } finally {
        await browser.close();
    }
})();