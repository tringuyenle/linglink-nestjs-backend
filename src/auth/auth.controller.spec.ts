import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDTO, LogInDTO, ResetPasswordDTO, RefreshTokenInput } from './dto';
import { UserRoles } from '../common/enums/user.enum';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            requestPasswordReset: jest.fn(),
            resetPassword: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should register a user', async () => {
    const dto: RegisterDTO = {
      email: '',
      password: '',
      name: '',
      avatar: '',
      role: UserRoles.ADMIN,
      target: null,
      createdAt: undefined,
      updatedAt: undefined
    };
    (authService.register as jest.Mock).mockResolvedValue('success');
    expect(await authController.register(dto)).toBe('success');
  });

  it('should log in a user', async () => {
    const dto: LogInDTO = {
      email: '',
      password: ''
    };
    authService.login = jest.fn().mockResolvedValue('success');
    expect(await authController.login(dto)).toBe('success');
  });

  it('should request password reset', async () => {
    const dto = { email: 'test@example.com' };
    authService.requestPasswordReset = jest.fn().mockResolvedValue('success');
    expect(await authController.requestPasswordReset(dto)).toBe('success');
  });

  it('should reset password', async () => {
    const dto: ResetPasswordDTO = {
      userId: '',
      token: '',
      password: ''
    };
    authService.resetPassword = jest.fn().mockResolvedValue('success');
    expect(await authController.resetPassword(dto)).toBe('success');
  });

  it('should refresh token', async () => {
    const dto: RefreshTokenInput = {
      token: ''
    };
    authService.refreshToken = jest.fn().mockResolvedValue('success');
    expect(await authController.refreshToken(dto)).toBe('success');
  });
});