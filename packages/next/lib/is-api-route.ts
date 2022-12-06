export function isAPIRoute(value?: string) {
  return Boolean(value === '/api' || value?.startsWith('/api/'))
}
