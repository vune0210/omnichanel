import * as marked from 'marked';

import { SecurityUtil } from './security.util';

export class MarkdownUtil {
  static async parse(input: string) {
    const parsed = await marked.parse(input);
    return SecurityUtil.sanitize(parsed);
  }
}
