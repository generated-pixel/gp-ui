export interface ScanOptions {
  includeStandardPrefixes?: boolean;
  customPrefix?: string;
}

export function scanContent(content: string, options: ScanOptions = {}): Set<string> {
  const candidates = new Set<string>();

  // Extract strings inside class="..." or className="..." attributes
  const classAttrRegex = /(?:class|className)=["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = classAttrRegex.exec(content)) !== null) {
    const tokens = match[1].trim().split(/\s+/);
    for (const token of tokens) {
      if (token) {
        candidates.add(token);
      }
    }
  }

  // Extract classes from backtick template strings or class lists in JS/TS
  const templateStringRegex = /[`"']([^`"'\n]+)[`"']/g;
  while ((match = templateStringRegex.exec(content)) !== null) {
    const rawStr = match[1].trim();
    // Only process lines that look like space-separated utility class candidate lists
    if (rawStr.includes(' ') || rawStr.includes(':') || rawStr.includes('-')) {
      const tokens = rawStr.split(/\s+/);
      for (const token of tokens) {
        if (isValidCandidate(token)) {
          candidates.add(token);
        }
      }
    }
  }

  // General fallback tokenizer matching class name patterns (e.g. bg-panel, sm:flex, hover:text-accent, p-[16px])
  const candidateRegex = /[a-zA-Z0-9_\-\:\[\]\#\%\.\/\(\)]+/g;
  while ((match = candidateRegex.exec(content)) !== null) {
    const candidate = match[0];
    if (isValidCandidate(candidate)) {
      candidates.add(candidate);
    }
  }

  return candidates;
}

function isValidCandidate(candidate: string): boolean {
  if (candidate.length < 2 || candidate.length > 100) {
    return false;
  }
  if (/^[0-9]+$/.test(candidate)) return false; // purely numeric
  if (
    candidate.startsWith('<') ||
    candidate.startsWith('>') ||
    candidate.startsWith('=') ||
    candidate.startsWith('http')
  ) {
    return false;
  }
  if (candidate.includes('</') || candidate.includes('/>')) {
    return false;
  }
  // Exclude common HTML tags / attributes / code keywords
  const reserved = new Set([
    'import',
    'export',
    'from',
    'function',
    'const',
    'let',
    'var',
    'return',
    'if',
    'else',
    'div',
    'span',
    'p',
    'a',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'section',
    'header',
    'footer',
    'main',
    'button',
    'input',
    'label',
    'form',
    'svg',
    'path',
    'meta',
    'link',
    'script',
    'html',
    'body',
    'head',
    'title',
    'style',
    'doctype',
    'utf-8',
    'viewport',
    'content'
  ]);
  if (reserved.has(candidate.toLowerCase())) return false;

  return true;
}
