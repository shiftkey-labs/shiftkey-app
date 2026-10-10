describe("environment config", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalPublicEnv = process.env.EXPO_PUBLIC_ENV;
  const originalPublicUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalPublicEnv === undefined) {
      delete process.env.EXPO_PUBLIC_ENV;
    } else {
      process.env.EXPO_PUBLIC_ENV = originalPublicEnv;
    }

    if (originalPublicUrl === undefined) {
      delete process.env.EXPO_PUBLIC_BACKEND_URL;
    } else {
      process.env.EXPO_PUBLIC_BACKEND_URL = originalPublicUrl;
    }

    jest.resetModules();
  });

  it("prefers EXPO_PUBLIC values when they are configured", () => {
    process.env.NODE_ENV = "development";
    process.env.EXPO_PUBLIC_ENV = "production";
    process.env.EXPO_PUBLIC_BACKEND_URL = "https://example.com";

    jest.resetModules();
    const env = require("./environment").default;

    expect(env.env).toBe("production");
    expect(env.apiUrl).toBe("https://example.com");
  });
});
