const path = require("path");
process.env.ANDROID_HOME =
  process.env.ANDROID_HOME || `${process.env.HOME}/Android/Sdk`;

const { remote } = require("webdriverio");

const capabilities = {
  platformName: "Android",
  "appium:automationName": "UiAutomator2",
  "appium:udid": "127.0.0.1:6555",
  "appium:app": path.join(__dirname, "../org.fossify.math_10.apk"),
  "appium:appPackage": "org.fossify.math",
  "appium:appActivity": ".activities.MainActivity",
  "appium:noSign": true, // <--- Desactiva la verificación de apksigner
  "appium:newCommandTimeout": 120,
  "appium:uiautomator2ServerLaunchTimeout": 60000,
  "appium:androidInstallTimeout": 90000,
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || "127.0.0.1",
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: "info",
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  try {
    const btn1 = await driver.$("id:org.fossify.math:id/btn_1");
    const btn0 = await driver.$("id:org.fossify.math:id/btn_0");
    const btnMultiply = await driver.$("id:org.fossify.math:id/btn_multiply");
    const btn5 = await driver.$("id:org.fossify.math:id/btn_5");
    const btnEquals = await driver.$("id:org.fossify.math:id/btn_equals");
    const resultField = await driver.$("id:org.fossify.math:id/result");

    await btn1.click();
    await btn0.click();
    await btnMultiply.click();
    await btn5.click();
    await btnEquals.click();

    const finalResult = await resultField.getText();

    console.log(`--- Resultado obtenido: ${finalResult} ---`);
    if (finalResult === "50") {
      console.log("Test Pasado: 10 * 5 es 50");
    } else {
      console.error(
        `Test Fallido: Se esperaba 50 pero se obtuvo ${finalResult}`,
      );
    }
  } catch (error) {
    console.error("Ocurrió un error durante el test:", error);
  } finally {
    await driver.deleteSession();
  }
}

runTest();
