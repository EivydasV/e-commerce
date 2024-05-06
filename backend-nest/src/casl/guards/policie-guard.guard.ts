import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../../graphql/types/graphql-context.type';
import { CaslAbilityFactory } from '../factories/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { PolicyHandler } from '../types/policy-handler.type';
import { Reflector } from '@nestjs/core';
import { AppAbility } from '../types/app-ability.type';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const ctx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();

    const user = ctx.req?.user;
    if (!user) {
      return true;
    }

    const abilities = await this.caslAbilityFactory.createForUser(user);

    ctx.req.abilities = abilities;

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, abilities),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }

    return handler.handle(ability);
  }
}
