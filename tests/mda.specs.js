const { remote } = require("webdriverio");

const opts = {
  path: "/",
  port: 4723,
  capabilities: {
    platformName: "Android",
    "appium:platformVersion": "11.0",
    "appium:deviceName": "127.0.0.1:6555",
    "appium:automationName": "UiAutomator2",
    "appium:appPackage": "com.saucelabs.mydemoapp.android",
    "appium:noReset": true,
    "appium:newCommandTimeout": 3600,
  },
};

async function runTest() {
  console.log("🚀 Iniciando automatización en MDA Nativa...");
  const driver = await remote(opts);

  try {
    // ------------------------------------------------------------------
    // CASO DE PRUEBA 1: TC-02 - Login con campos vacíos (Prueba Negativa)
    // ------------------------------------------------------------------
    console.log("\n--- Ejecutando TC-02: Campos Vacíos ---");

    // 1. Abrir menú lateral
    const menuBtn = await driver.$(
      '//*[@resource-id="com.saucelabs.mydemoapp.android:id/menuIV"]',
    );
    await menuBtn.waitForDisplayed({ timeout: 10000 });
    await menuBtn.click();
    await driver.pause(1000);

    // 2. Entrar al formulario de Log In
    const loginMenuItem = await driver.$('//*[@text="Log In"]');
    await loginMenuItem.waitForDisplayed({ timeout: 5000 });
    await loginMenuItem.click();
    await driver.pause(1000);

    // 3. Botón de Login (Indexado para evitar violación de Strict Mode)
    const submitBtn = await driver.$(
      '(//*[@text="Login" or @text="LOG IN"])[1]',
    );
    await submitBtn.waitForDisplayed({ timeout: 5000 });
    await submitBtn.click();

    console.log(
      "📸 [TOMAR CAPTURA AHORA]: Alerta de campos obligatorios vacíos (TC-02)",
    );
    await driver.pause(5000);

    // ------------------------------------------------------------------
    // CASO DE PRUEBA 2: TC-03 - Credenciales Incorrectas (Prueba Negativa)
    // ------------------------------------------------------------------
    console.log("\n--- Ejecutando TC-03: Credenciales Erróneas ---");

    const inputs = await driver.$$("//android.widget.EditText");
    if (inputs.length >= 2) {
      await inputs[0].setValue("bob@example.com");
      await inputs[1].setValue("ClaveIncorrecta123");
    }

    await submitBtn.click();

    console.log(
      "📸 [TOMAR CAPTURA AHORA]: Mensaje de credenciales erróneas (TC-03)",
    );
    await driver.pause(5000);

    // ------------------------------------------------------------------
    // CASO DE PRUEBA 3: TC-01 - Login Exitoso (Happy Path)
    // ------------------------------------------------------------------
    console.log("\n--- Ejecutando TC-01: Login Exitoso (Happy Path) ---");

    if (inputs.length >= 2) {
      await inputs[0].setValue("bod@example.com");
      await inputs[1].setValue("10fanboy");
    }

    await submitBtn.click();

    console.log(
      "📸 [TOMAR CAPTURA AHORA]: Catálogo de productos tras ingreso exitoso (TC-01)",
    );
    await driver.pause(5000);

    console.log("\n✅ Pruebas ejecutadas con éxito.");
  } catch (error) {
    console.error("❌ Error durante la ejecución:", error.message);
  } finally {
    console.log("\nCerrando sesión de Appium...");
    await driver.deleteSession();
  }
}

runTest();
