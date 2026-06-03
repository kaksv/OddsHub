import { runProxy } from '../_proxy'

export default function handler(req: Parameters<typeof runProxy>[0], res: Parameters<typeof runProxy>[1]) {
  runProxy(req, res, 'https://api.elections.kalshi.com/trade-api/v2', req.query.path)
}
