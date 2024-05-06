import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UserRepository } from '../user.repository';
import { User } from '../../schemas/user.schema';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userModel: DeepMocked<Model<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: createMock<Model<User>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();
    userRepository = module.get<UserRepository>(UserRepository);

    userModel = module.get<DeepMocked<Model<User>>>(getModelToken(User.name));
  });

  it('should be defined', async () => {
    expect(userRepository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const email = 'email@gmail.com';
      const result = createMock<User>({ email });
      userModel.findOne.mockResolvedValueOnce(result);

      const find = await userRepository.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(find).toBe(result);
    });

    it('should return null if user not found', async () => {
      const email = 'email@gmail.com';
      userModel.findOne.mockResolvedValueOnce(null);

      const find = await userRepository.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(find).toBe(null);
    });
  });
});
