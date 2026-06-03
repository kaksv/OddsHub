import { runProxy } from '../_proxy'

export default function handler(req: Parameters<typeof runProxy>[0], res: Parameters<typeof runProxy>[1]) {
  runProxy(req, res, 'https://data-api.polymarket.com', req.query.path)
}
