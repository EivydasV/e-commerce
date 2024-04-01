import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput } from '../inputs/create-user.input';
import { BaseHashing } from '../../security/hashings/base.hashing';
import { UpdateUserInput } from '../inputs/update-user.input';
import { Encryption } from '../../security/encryptions/encryption.encriptions';
import { ForgotPasswordInput } from '../inputs/forgot-password.input';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';
import { DocId } from '../../db/types/doc-id.type';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: BaseHashing,
    private readonly encryptionService: Encryption,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async createUser(payload: CreateUserInput) {
    const findUserByEmail = await this.userRepository.findByEmail(
      payload.email,
    );

    if (findUserByEmail) {
      throw new BadRequestException('Email already exists');
    }

    payload.password = await this.hashingService.hash(payload.password);

    return this.userRepository.create(payload);
  }

  async updateUser(id: DocId, payload: UpdateUserInput) {
    return this.userRepository.findByIdAndUpdate(id, payload);
  }

  async forgotPassword(forgotPasswordInput: ForgotPasswordInput) {
    const user = await this.userRepository.findByEmail(
      forgotPasswordInput.email,
    );

    if (!user) {
      return;
    }

    const resetPasswordToken = this.encryptionService.createUrlRandomToken();
    const hashedToken = await this.hashingService.hash(resetPasswordToken);

    const expiresAt = new Date();
    const addHours = 2;

    expiresAt.setHours(expiresAt.getHours() + addHours);

    await this.userRepository.findByIdAndUpdate(user._id, {
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiresAt: expiresAt,
    });

    //implement of the email service to send the reset password token

    console.log(resetPasswordToken);
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput) {
    const error = new BadRequestException('Invalid token or token expired');

    const user = await this.userRepository.findByEmail(
      resetPasswordInput.email,
    );

    if (
      !user ||
      !user?.forgotPasswordToken ||
      !user?.forgotPasswordTokenExpiresAt
    ) {
      throw error;
    }

    const isTokenValid = await this.hashingService.compare(
      resetPasswordInput.forgotPasswordToken,
      user.forgotPasswordToken,
    );

    if (!isTokenValid) {
      throw error;
    }

    const isTokenExpired = new Date() > user.forgotPasswordTokenExpiresAt;
    if (isTokenExpired) {
      throw error;
    }

    const hashedPassword = await this.hashingService.hash(
      resetPasswordInput.password,
    );

    await this.userRepository.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      $unset: {
        forgotPasswordToken: '',
        forgotPasswordTokenExpiresAt: '',
      },
    });
  }

  paginate(offsetPaginationInput: OffsetPaginationInput) {
    return this.userRepository.offsetPaginate(offsetPaginationInput);
  }
}
