import type { Config } from './config.interface'

const config: Config = {
  security: {
    expiresIn: '60m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10
  }
}

export default (): Config => config
