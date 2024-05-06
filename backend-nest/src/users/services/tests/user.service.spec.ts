import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserService } from '../user.service';
import { Encryption } from '../../../security/encryptions/encryption.encriptions';
import { UserRepository } from '../../repositories/user.repository';
import { OffsetPaginatedUser, UserDocument } from '../../schemas/user.schema';
import { CreateUserInput } from '../../inputs/create-user.input';
import { BaseHashing } from '../../../security/hashings/base.hashing';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ForgotPasswordInput } from '../../inputs/forgot-password.input';
import { ResetPasswordInput } from '../../inputs/reset-password.input';
import { OffsetPaginationInput } from '../../../graphql/inputs/offset-pagination.input';

describe('UserService', () => {
  let userService: UserService;
  let encryption: DeepMocked<Encryption>;
  let hashing: DeepMocked<BaseHashing>;
  let userRepository: DeepMocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker(createMock)
      .compile();

    userService = module.get<UserService>(UserService);
    encryption = module.get<DeepMocked<Encryption>>(Encryption);
    userRepository = module.get<DeepMocked<UserRepository>>(UserRepository);
    hashing = module.get<DeepMocked<BaseHashing>>(BaseHashing);
  });

  it('should be defined', async () => {
    expect(userService).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'email@gmail.com';

      const result = createMock<UserDocument>({
        email,
      });

      userRepository.findByEmail.mockResolvedValueOnce(result);

      const find = await userService.findByEmail(email);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(find).toBe(result);
    });

    it('should not find user by email', async () => {
      const email = 'email@gmail.com';

      userRepository.findByEmail.mockResolvedValueOnce(null);

      const find = await userService.findByEmail(email);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(find).toBe(null);
    });
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const payload = createMock<CreateUserInput>({
        email: 'email@gmail.com',
      });

      const result = createMock<UserDocument>({
        ...payload,
      });

      const hashedPassword = 'hashedPassword';

      userRepository.findByEmail.mockResolvedValueOnce(null);
      hashing.hash.mockResolvedValueOnce(hashedPassword);
      userRepository.create.mockResolvedValueOnce(result);

      const create = await userService.createUser(payload);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(payload.email);
      expect(hashing.hash).toHaveBeenCalledTimes(1);
      expect(hashing.hash).toHaveBeenCalledWith(payload.password);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...payload,
        password: hashedPassword,
      });
      expect(create).toBe(result);
    });

    it('should throw error when email already exists', async () => {
      const payload = createMock<CreateUserInput>({
        email: 'email@gmail.com',
      });

      const result = createMock<UserDocument>({
        ...payload,
      });

      userRepository.findByEmail.mockResolvedValueOnce(result);

      await expect(userService.createUser(payload)).rejects.toThrow(
        BadRequestException,
      );

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const id = new Types.ObjectId();
      const payload = createMock<CreateUserInput>({
        email: 'email@mail.com',
      });

      const result = createMock<UserDocument>({
        ...payload,
      });

      userRepository.findByIdAndUpdate.mockResolvedValueOnce(result);

      const update = await userService.updateUser(id, payload);

      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        payload,
      );
      expect(update).toBe(result);
    });
  });

  describe('forgotPassword', () => {
    it('should forgot password', async () => {
      const email = 'email@gmail.com';
      const forgotPasswordInput = createMock<ForgotPasswordInput>({
        email,
      });

      const user = createMock<UserDocument>({
        email,
        _id: new Types.ObjectId(),
      });

      const resetPasswordToken = 'resetPasswordToken';

      const hashedToken = 'hashedToken';
      const addHours = 2;
      const expiresAt = new Date();

      jest.spyOn(global, 'Date').mockImplementation(() => expiresAt);

      expiresAt.setHours(expiresAt.getHours() + addHours);

      userRepository.findByEmail.mockResolvedValueOnce(user);
      encryption.createUrlRandomToken.mockReturnValueOnce(resetPasswordToken);
      hashing.hash.mockResolvedValueOnce(hashedToken);
      userRepository.findByIdAndUpdate.mockResolvedValueOnce(user);

      await userService.forgotPassword(forgotPasswordInput);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(encryption.createUrlRandomToken).toHaveBeenCalledTimes(1);
      expect(hashing.hash).toHaveBeenCalledTimes(1);
      expect(hashing.hash).toHaveBeenCalledWith(resetPasswordToken);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(user._id, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiresAt: expiresAt,
      });
    });

    it('should return void when user not found', async () => {
      const email = 'email@gmail.com';
      const forgotPasswordInput = createMock<ForgotPasswordInput>({
        email,
      });

      userRepository.findByEmail.mockResolvedValueOnce(null);

      await userService.forgotPassword(forgotPasswordInput);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);

      expect(encryption.createUrlRandomToken).toHaveBeenCalledTimes(0);
      expect(hashing.hash).toHaveBeenCalledTimes(0);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledTimes(0);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const email = 'email@gmail.com';
      const forgotPasswordToken = 'forgotPasswordToken';
      const password = 'password';
      const date = new Date();

      const resetPasswordInput = createMock<ResetPasswordInput>({
        email,
        forgotPasswordToken,
        password,
      });

      const user = createMock<UserDocument>({
        email,
        forgotPasswordToken,
        forgotPasswordTokenExpiresAt: date.setHours(date.getHours() + 2),
      });

      const hashedPassword = 'hashedPassword';

      userRepository.findByEmail.mockResolvedValueOnce(user);
      hashing.compare.mockResolvedValueOnce(true);
      hashing.hash.mockResolvedValueOnce(hashedPassword);
      userRepository.findByIdAndUpdate.mockResolvedValueOnce(user);

      await userService.resetPassword(resetPasswordInput);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(hashing.compare).toHaveBeenCalledTimes(1);
      expect(hashing.compare).toHaveBeenCalledWith(
        forgotPasswordToken,
        user.forgotPasswordToken,
      );
      expect(hashing.hash).toHaveBeenCalledTimes(1);
      expect(hashing.hash).toHaveBeenCalledWith(password);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledWith(user._id, {
        password: hashedPassword,
        $unset: {
          forgotPasswordToken: '',
          forgotPasswordTokenExpiresAt: '',
        },
      });
    });

    it('should throw error when token is invalid', async () => {
      const resetPasswordInput = createMock<ResetPasswordInput>({
        email: 'email@gmail.com',
        forgotPasswordToken: 'dsdsd',
      });

      const user = createMock<UserDocument>({
        email: 'email@gmail.com',
        forgotPasswordToken: 'dsdsd',
      });

      userRepository.findByEmail.mockResolvedValueOnce(user);
      hashing.compare.mockResolvedValueOnce(false);

      await expect(
        userService.resetPassword(resetPasswordInput),
      ).rejects.toThrow(BadRequestException);

      expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        resetPasswordInput.email,
      );
      expect(hashing.compare).toHaveBeenCalledTimes(1);
      expect(hashing.compare).toHaveBeenCalledWith(
        resetPasswordInput.forgotPasswordToken,
        user.forgotPasswordToken,
      );
      expect(hashing.hash).toHaveBeenCalledTimes(0);
      expect(userRepository.findByIdAndUpdate).toHaveBeenCalledTimes(0);
    });
  });

  describe('paginate', () => {
    it('should paginate users', async () => {
      const offsetPaginationInput = createMock<OffsetPaginationInput>();

      const result = createMock<OffsetPaginatedUser>();

      userRepository.offsetPaginate.mockResolvedValueOnce(result);
      const paginate = await userService.paginate(offsetPaginationInput);

      expect(userRepository.offsetPaginate).toHaveBeenCalledTimes(1);
      expect(userRepository.offsetPaginate).toHaveBeenCalledWith(
        offsetPaginationInput,
      );
      expect(paginate).toBe(result);
    });
  });
});
