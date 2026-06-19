import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsBase64Image(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isBase64Image',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const regex =
            /^data:image\/(png|jpg|jpeg|gif);base64,[A-Za-z0-9+/=]+$/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}
