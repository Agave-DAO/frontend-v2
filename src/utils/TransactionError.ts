export class TransactionError extends Error {
  code?: number
  data?: string
  constructor(message?: string, code?: number, data?: never) {
    super(message)
    if (code != null) {
      this.name = `Transaction Failed ${code.toString()}`
    } else {
      this.name = `Transaction Failed`
    }
    this.code = code
    this.data = JSON.stringify(data)
  }
}
