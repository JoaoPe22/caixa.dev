import { networkInterfaces } from 'node:os'

import type { NextConfig } from 'next'

const ipsDaMaquina = Object.values(networkInterfaces())
  .flat()
  .flatMap((rede) => (rede?.family === 'IPv4' ? [rede.address] : []))

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ipsDaMaquina,
}

export default nextConfig
