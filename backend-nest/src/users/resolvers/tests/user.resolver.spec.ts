import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserResolver } from '../user.resolver';
import { UserService } from '../../services/user.service';
import { OffsetPaginatedUser, UserDocument } from '../../schemas/user.schema';
import { Types } from 'mongoose';
import { OffsetPaginationInput } from '../../../graphql/inputs/offset-pagination.input';
import { CreateUserInput } from '../../inputs/create-user.input';
import { UpdateUserInput } from '../../inputs/update-user.input';
import { ResetPasswordInput } from '../../inputs/reset-password.input';

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: DeepMocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver],
    })
      .useMocker(createMock)
      .compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get<DeepMocked<UserService>>(UserService);
  });

  it('should be defined', async () => {
    expect(UserResolver).toBeDefined();
  });

  describe('findUsers', () => {
    it('should return all users', async () => {
      const docId = new Types.ObjectId();

      const createInput = createMock<OffsetPaginationInput>({
        perPage: 10,
        page: 1,
      });
      const result = createMock<OffsetPaginatedUser>({
        edges: [{ node: { _id: docId, email: 'email@gmail.com' } }],
      });

      userService.paginate.mockResolvedValueOnce(result);

      const users = await userResolver.findUsers(createInput);

      expect(userService.paginate).toHaveBeenCalledTimes(1);
      expect(userService.paginate).toHaveBeenCalledWith(createInput);
      expect(users).toBe(result);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user by email', async () => {
      const docId = new Types.ObjectId();

      const email = 'email@gmai.com';

      const result = createMock<UserDocument>({ _id: docId, email });

      userService.findByEmail.mockResolvedValueOnce(result);

      const user = await userResolver.findUserByEmail(email);

      expect(userService.findByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(user).toBe(result);
    });

    it('should return null if user not found', async () => {
      const email = 'email@gmai.com';

      userService.findByEmail.mockResolvedValueOnce(null);

      const user = await userResolver.findUserByEmail(email);

      expect(userService.findByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(user).toBe(null);
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const createInput = createMock<CreateUserInput>({
        email: 'email@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      });

      const result = createMock<UserDocument>(createInput);

      userService.createUser.mockResolvedValueOnce(result);

      const user = await userResolver.createUser(createInput);

      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledWith(createInput);
      expect(user).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const docId = new Types.ObjectId();

      const updateInput = createMock<UpdateUserInput>({
        email: 'email@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      const currentUser = createMock<UserDocument>({ _id: docId });

      const result = createMock<UserDocument>(updateInput);

      userService.updateUser.mockResolvedValueOnce(result);

      const user = await userResolver.updateUser(updateInput, currentUser);

      expect(userService.updateUser).toHaveBeenCalledTimes(1);
      expect(userService.updateUser).toHaveBeenCalledWith(docId, updateInput);
      expect(user).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const resetPasswordInput = createMock<ResetPasswordInput>({});

      userService.resetPassword.mockResolvedValueOnce();

      const reset = await userResolver.resetPassword(resetPasswordInput);

      expect(userService.resetPassword).toHaveBeenCalledTimes(1);
      expect(userService.resetPassword).toHaveBeenCalledWith(
        resetPasswordInput,
      );
      expect(reset).toBe(true);
    });
  });
});
