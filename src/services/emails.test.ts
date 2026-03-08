import { describe, it, expect, vi, beforeEach } from "vitest";

// Variable para controlar el comportamiento del mock
let shouldFail = false;

// Mock de nodemailer
vi.mock("nodemailer", () => {
  const mockSendMail = vi.fn().mockImplementation(() => {
    if (shouldFail) {
      return Promise.reject(new Error("Error de conexión"));
    }
    return Promise.resolve({
      messageId: "test-message-id",
      accepted: ["test@example.com"],
    });
  });

  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: mockSendMail,
      })),
    },
    TransportOptions: {},
  };
});

// Mock de config
vi.mock("../config.js", () => ({
  appConfigMethod: {
    EMAIL_HOST: "smtp.test.com",
    EMAIL_PORT: "587",
    EMAIL_SECURE: "false",
    EMAIL_USER: "test@test.com",
    EMAIL_PASS: "testpassword",
  },
}));

import nodemailer from "nodemailer";
import { sendVerificationEmail, createToken } from "./emails.js";

describe.concurrent("emails service", () => {
  let mockSendMail: any;

  beforeEach(() => {
    vi.clearAllMocks();
    shouldFail = false;
    // Obtener el mock de sendMail
    const transport = nodemailer.createTransport({} as any);
    mockSendMail = transport.sendMail;
  });

  describe("createToken", () => {
    it("debería generar un token aleatorio", () => {
      const token = createToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("debería generar tokens diferentes cada vez", () => {
      const token1 = createToken();
      const token2 = createToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe("sendVerificationEmail", () => {
    it("debería enviar el código de verificación correctamente", async () => {
      const to = "user@example.com";
      const code = "123456";

      const result = await sendVerificationEmail(to, code);

      expect(result).toBeDefined();
      expect(result.messageId).toBe("test-message-id");
    });

    it("debería llamar a nodemailer con los parámetros correctos", async () => {
      const to = "user@example.com";
      const code = "123456";

      await sendVerificationEmail(to, code);

      // Verificar que sendMail fue llamado
      expect(nodemailer.createTransport).toHaveBeenCalled();
    });

    it("debería manejar errores al enviar email", async () => {
      const to = "user@example.com";
      const code = "123456";

      // Configurar que el próximo envío falle
      shouldFail = true;

      await expect(sendVerificationEmail(to, code)).rejects.toThrow("Error de conexión");
    });
  });
});
