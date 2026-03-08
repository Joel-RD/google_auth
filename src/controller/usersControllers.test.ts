import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { UserController } from "./usersControllers.js";
import { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import { User } from "../models/types.js";

type MockSession = Session & Partial<SessionData> & { userId?: string };

// Mock de la dependencia debcrypt
vi.mock("../utils/verifi_password.js", () => ({
  hashPassword: vi.fn((password: string) => `hashed_${password}`),
  verifyPassword: vi.fn((password: string, hash: string) => password === hash.replace("hashed_", "")),
}));

// Mock de path con default export
vi.mock("path", () => ({
  default: {
    join: (...args: string[]) => args.join("/"),
  },
  join: (...args: string[]) => args.join("/"),
}));

describe.concurrent("UserController", () => {
  let mockUserRepository: Partial<IUserRepository>;
  let controller: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;
  let sendFileMock: ReturnType<typeof vi.fn>;
  let redirectMock: ReturnType<typeof vi.fn>;

  const mockUser: User = {
    id: 1,
    id_google_account: "google-123",
    email: "test@example.com",
    name: "Test User",
    accessToken: "access-token",
    password: null,
  };

  beforeEach(() => {
    // Resetear todos los mocks
    vi.clearAllMocks();

    // Crear mocks del repositorio
    mockUserRepository = {
      findByIdGoogle: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    // Crear instancia del controlador
    controller = new UserController(mockUserRepository as IUserRepository);

    // Mocks de Response
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    sendFileMock = vi.fn();
    redirectMock = vi.fn();

    mockResponse = {
      json: jsonMock,
      status: statusMock,
      sendFile: sendFileMock,
      redirect: redirectMock,
    } as Partial<Response>;

    // Mock de Request con sesión válida por defecto
    mockRequest = {
      session: {
        userId: "google-123",
      },
      body: {},
    } as Partial<Request>;
  });

  describe("updatePassword (changePassword)", () => {
    it("debería cambiar la contraseña exitosamente", async () => {
      mockRequest.body = { password: "Test1234!" };
      mockUserRepository.findByIdGoogle = vi.fn().mockResolvedValue(mockUser);
      mockUserRepository.update = vi.fn().mockResolvedValue(undefined);

      await controller.updatePassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUserRepository.findByIdGoogle).toHaveBeenCalledWith("google-123");
      expect(mockUserRepository.update).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith("Contraseña actualizada exitosamente");
    });

    it("debería retornar error 401 si no hay sesión de usuario", async () => {
      // Sesión existe pero sin userId - debería retornar 401
      mockRequest.session = {} as MockSession;

      await controller.updatePassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: "No autorizado" });
    });

    it("debería retornar error 404 si el usuario no existe", async () => {
      mockRequest.session = { userId: "google-123" } as MockSession;
      mockRequest.body = { password: "Test1234!" };
      mockUserRepository.findByIdGoogle = vi.fn().mockResolvedValue(null);

      await controller.updatePassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Usuario no encontrado" });
    });

    it("debería retornar error 400 si la contraseña no es fuerte", async () => {
      mockRequest.session = { userId: "google-123" } as MockSession;
      mockRequest.body = { password: "weak" };

      await controller.updatePassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining("contraseña") })
      );
    });
  });

  describe("getUserInfo", () => {
    it("debería obtener información del usuario exitosamente", async () => {
      mockRequest.session = { userId: "google-123" } as MockSession;
      mockUserRepository.findByIdGoogle = vi.fn().mockResolvedValue(mockUser);

      await controller.getUserInfo(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUserRepository.findByIdGoogle).toHaveBeenCalledWith("google-123");
      expect(jsonMock).toHaveBeenCalledWith(mockUser);
    });

    it("debería retornar error 401 si no hay sesión de usuario", async () => {
      // Sesión existe pero sin userId - debería retornar 401
      mockRequest.session = {} as MockSession;

      await controller.getUserInfo(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: "No autorizado" });
    });
  });

  describe("getSettings", () => {
    it("debería retornar el archivo settings.html", () => {
      mockRequest.session = { userId: "google-123" } as MockSession;
      controller.getSettings(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(sendFileMock).toHaveBeenCalled();
    });
  });
});
