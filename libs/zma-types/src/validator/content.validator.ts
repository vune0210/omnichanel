import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotIncludedBase64', async: false })
export class IsNotIncludedBase64Constraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;

    const base64Pattern = /data:[a-zA-Z]+\/[a-zA-Z0-9.+-]+;base64,[^\s"]+/;
    return !base64Pattern.test(value);
  }

  defaultMessage(_args: ValidationArguments): string {
    return `Field ${_args.property} must not include base64-encoded data.`;
  }
}

export function IsNotIncludedBase64() {
  return Validate(IsNotIncludedBase64Constraint);
}
