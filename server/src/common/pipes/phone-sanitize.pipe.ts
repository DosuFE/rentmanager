import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PhoneSanitizePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    return value.replace(/\D/g, '');
  }
}
