class LimiteExcedidoError extends Error {
  readonly segundosParaLiberar: number

  constructor(segundosParaLiberar: number) {
    super(
      `Muitas consultas em pouco tempo. Aguarde ${segundosParaLiberar} segundos e tente de novo.`,
    )
    this.name = 'LimiteExcedidoError'
    this.segundosParaLiberar = segundosParaLiberar
  }
}

class ErroUpstream extends Error {
  readonly status: number

  constructor(status: number) {
    super(`upstream respondeu ${status}`)
    this.name = 'ErroUpstream'
    this.status = status
  }
}

export { ErroUpstream, LimiteExcedidoError }
