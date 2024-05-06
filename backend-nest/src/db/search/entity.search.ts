import { Injectable, Logger, Type } from '@nestjs/common';
import { glob } from 'glob';
import path from 'node:path';
import { CannotResolveEntityError } from 'src/db/errors/cannot-resolve-entity.error';
import { Schema } from 'mongoose';

@Injectable()
export class EntitySearch {
  private logger = new Logger(EntitySearch.name);

  async getEntity(entity: string) {
    const files = await glob(`**/${entity.toLowerCase()}.schema.js`, {
      absolute: true,
    });

    if (!files.length) {
      return null;
    }

    if (files.length > 1) {
      this.logger.warn(
        `found more than one entity: ${entity}. Using the first one "${files[0]}"`,
      );
    }

    const relativePath = path.relative(path.dirname(__filename), files[0]);

    try {
      return await import(relativePath);
    } catch (e) {
      throw new CannotResolveEntityError(relativePath);
    }
  }

  getEntityFieldsThatHasRef(entity: any) {
    if (typeof entity !== 'object' || !entity) {
      return [];
    }

    for (const key in entity) {
      if (key in entity && entity[key] instanceof Schema) {
        const schema = entity[key] as Schema;

        return Object.entries(schema.obj).reduce(
          (acc: string[], [property, declaration]) => {
            if (typeof declaration === 'object' && 'ref' in declaration) {
              return [...acc, property];
            }

            return acc;
          },
          [],
        );
      }
    }

    return [];
  }
}
