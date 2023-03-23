import { ErrorCode } from '@ethersproject/logger'

const errorMessages: Record<ErrorCode | 'default', string> = {
  [ErrorCode.CALL_EXCEPTION]: 'Call exception',
  [ErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [ErrorCode.UNPREDICTABLE_GAS_LIMIT]: 'Insufficient gas limit',
  [ErrorCode.NONCE_EXPIRED]: 'Nonce expired',
  [ErrorCode.REPLACEMENT_UNDERPRICED]: 'Replacement underpriced',
  [ErrorCode.UNPREDICTABLE_GAS_LIMIT]: 'Unpredictable gas limit',
  [ErrorCode.UNSUPPORTED_OPERATION]: 'Unsupported operation',
  [ErrorCode.NETWORK_ERROR]: 'Network error',
  [ErrorCode.TIMEOUT]: 'Timeout',
  [ErrorCode.UNKNOWN_ERROR]: 'Unknown error',
  [ErrorCode.NOT_IMPLEMENTED]: 'Not implemented',
  [ErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [ErrorCode.TRANSACTION_REPLACED]: 'Transaction replaced',
  [ErrorCode.ACTION_REJECTED]: 'User denied transaction signature',
  [ErrorCode.BUFFER_OVERRUN]: 'Buffer overrun',
  [ErrorCode.INVALID_ARGUMENT]: 'Invalid argument',
  [ErrorCode.UNEXPECTED_ARGUMENT]: 'Unexpected argument',
  [ErrorCode.MISSING_ARGUMENT]: 'Missing argument',
  [ErrorCode.SERVER_ERROR]: 'Server error',
  [ErrorCode.NUMERIC_FAULT]: 'Numeric fault',
  [ErrorCode.MISSING_NEW]: 'Missing new',
  default: 'Unknown error',
}
export class TransactionError extends Error {
  code?: ErrorCode
  data?: string
  constructor(message?: string, code?: ErrorCode, data?: never) {
    super(message)
    this.name = `${errorMessages[code || 'default']}`
    this.code = code
    this.data = JSON.stringify(data)
  }
}
