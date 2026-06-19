import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

export type IsExistConstraintInput = {
  tableName: string;
  column: string;
};

@ValidatorConstraint({ name: 'IsExistConstraint', async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    // catch options from decorator
    const { tableName, column }: IsExistConstraintInput = args.constraints[0];

    return await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: value })
      .getExists();
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments.property;
    return `${field} is not exist`;
  }
}

export function IsExist(
  options: IsExistConstraintInput,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'is-exist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsExistConstraint,
    });
  };
}
