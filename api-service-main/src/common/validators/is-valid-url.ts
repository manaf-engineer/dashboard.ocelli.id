import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'startsWithSlash', async: false })
export class IsStartsWithSlashConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments): boolean {
    return typeof value === 'string' && value.startsWith('/');
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must start with a slash (/).`;
  }
}

export function IsStartsWithSlash(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsStartsWithSlashConstraint,
    });
  };
}
