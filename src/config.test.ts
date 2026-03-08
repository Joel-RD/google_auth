import { describe, it, expect, vi, beforeEach } from "vitest";
import { appConfigMethod, logIfDevelopment, isAuthenticated } from "./config.js";

// Guardar valores originales
const originalEnv = { ...process.env };

describe.concurrent("config", () => {
  beforeEach(() => {
    // Restaurar el entorno original antes de cada test
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  describe("appConfigMethod", () => {
    it("debería tener las variables de entorno requeridas configuradas", () => {
      // Verificar que las variables de configuración están presentes
      expect(appConfigMethod).toBeDefined();
      expect(appConfigMethod.PORT_SERVER).toBeDefined();
      expect(appConfigMethod.NODE_ENV).toBeDefined();
    });

    it("debería usar valores por defecto cuando no hay variables de entorno", () => {
      // Eliminar variables de entorno para probar valores por defecto
      delete process.env.PORT;
      delete process.env.NODE_ENV;
      delete process.env.GOOGLE_ID_SECRET;
      delete process.env.GOOGLE_SECRET_CLIENT_PASSWORD;
      delete process.env.REDIRECT_URL;
      delete process.env.TOKEN_AUTHORIZED_SESSION;
      delete process.env.EMAIL_HOST;
      delete process.env.EMAIL_PORT;
      delete process.env.EMAIL_SECURE;
      delete process.env.EMAIL_USER;
      delete process.env.EMAIL_PASS;

      // Re-importar el módulo con las variables eliminadas
      vi.resetModules();
      
      // Verificar el valor por defecto de PORT (es string en el código)
      expect(appConfigMethod.PORT_SERVER).toBe("9287");
    });

    it("debería tener configuración de email", () => {
      expect(appConfigMethod.EMAIL_HOST).toBeDefined();
      expect(appConfigMethod.EMAIL_PORT).toBeDefined();
      expect(appConfigMethod.EMAIL_USER).toBeDefined();
      expect(appConfigMethod.EMAIL_PASS).toBeDefined();
    });

    it("debería tener configuración de Google OAuth", () => {
      expect(appConfigMethod.SECRET_CLIENT_ID).toBeDefined();
      expect(appConfigMethod.SECRET_CLIENT_PASSWORD).toBeDefined();
      expect(appConfigMethod.REDIRECT_URL_GOOGLE_AUTH).toBeDefined();
    });

    it("debería tener configuración de token de sesión", () => {
      expect(appConfigMethod.SECRET_TOKEN_AUTHORIZED).toBeDefined();
    });
  });

  describe("logIfDevelopment", () => {
    it("debería estar definida", () => {
      expect(logIfDevelopment).toBeDefined();
      expect(typeof logIfDevelopment).toBe("function");
    });
  });

  describe("isAuthenticated", () => {
    it("debería estar definida", () => {
      expect(isAuthenticated).toBeDefined();
      expect(typeof isAuthenticated).toBe("function");
    });
  });
});
