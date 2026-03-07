export interface AICrawler {
  name: string
  userAgent: string
  operator: string
  purpose: 'training' | 'search' | 'assistant'
}

/**
 * Comprehensive list of known AI crawler user agents
 */
export const AI_CRAWLERS: AICrawler[] = [
  { name: 'GPTBot', userAgent: 'GPTBot', operator: 'OpenAI', purpose: 'training' },
  { name: 'ChatGPT-User', userAgent: 'ChatGPT-User', operator: 'OpenAI', purpose: 'assistant' },
  { name: 'OAI-SearchBot', userAgent: 'OAI-SearchBot', operator: 'OpenAI', purpose: 'search' },
  { name: 'ClaudeBot', userAgent: 'ClaudeBot', operator: 'Anthropic', purpose: 'training' },
  { name: 'Claude-Web', userAgent: 'Claude-Web', operator: 'Anthropic', purpose: 'assistant' },
  { name: 'Google-Extended', userAgent: 'Google-Extended', operator: 'Google', purpose: 'training' },
  { name: 'CCBot', userAgent: 'CCBot', operator: 'Common Crawl', purpose: 'training' },
  { name: 'PerplexityBot', userAgent: 'PerplexityBot', operator: 'Perplexity', purpose: 'search' },
  { name: 'Bytespider', userAgent: 'Bytespider', operator: 'ByteDance', purpose: 'training' },
  { name: 'Meta-ExternalAgent', userAgent: 'Meta-ExternalAgent', operator: 'Meta', purpose: 'training' },
  { name: 'Meta-ExternalFetcher', userAgent: 'Meta-ExternalFetcher', operator: 'Meta', purpose: 'training' },
  { name: 'Applebot-Extended', userAgent: 'Applebot-Extended', operator: 'Apple', purpose: 'training' },
  { name: 'Amazonbot', userAgent: 'Amazonbot', operator: 'Amazon', purpose: 'training' },
  { name: 'YouBot', userAgent: 'YouBot', operator: 'You.com', purpose: 'search' },
  { name: 'DuckAssistBot', userAgent: 'DuckAssistBot', operator: 'DuckDuckGo', purpose: 'assistant' },
  { name: 'cohere-ai', userAgent: 'cohere-ai', operator: 'Cohere', purpose: 'training' },
  { name: 'Diffbot', userAgent: 'Diffbot', operator: 'Diffbot', purpose: 'training' },
  { name: 'ImagesiftBot', userAgent: 'ImagesiftBot', operator: 'ImageSift', purpose: 'training' },
  { name: 'Omgilibot', userAgent: 'Omgilibot', operator: 'Webz.io', purpose: 'training' },
  { name: 'Timpibot', userAgent: 'Timpibot', operator: 'Timpi', purpose: 'training' },
]
