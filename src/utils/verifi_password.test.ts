import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./verifi_password.js";

describe.concurrent("verifi_password", () => {
  describe("hashPassword", () => {
    it("debería generar un hash válido", () => {
      const password = "testPassword123";
      const hash = hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("debería generar hashes diferentes cada vez (salt aleatorio)", () => {
      const password = "testPassword123";
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("debería retornar true para la contraseña correcta", () => {
      const password = "testPassword123";
      const hash = hashPassword(password);

      const result = verifyPassword(password, hash);

      expect(result).toBe(true);
    });

    it("debería retornar false para contraseña incorrecta", () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword456";
      const hash = hashPassword(password);

      const result = verifyPassword(wrongPassword, hash);

      expect(result).toBe(false);
    });

    it("debería retornar false para cadena vacía", () => {
      const password = "testPassword123";
      const hash = hashPassword(password);

      const result = verifyPassword("", hash);

      expect(result).toBe(false);
    });
  });
});
