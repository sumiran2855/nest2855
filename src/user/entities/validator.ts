import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class MatchConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: any, args: ValidationArguments) {
      const [relatedPropertyName] = args.constraints;
      const password = (args.object as any)[relatedPropertyName];
      return confirmPassword === password;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Passwords do not match';
    }
  }
  
  export function Match(property: string, validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: MatchConstraint,
      });
    };
  }
  