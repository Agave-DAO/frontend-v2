import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'

import { NumberType, formatNumber } from './format'
import { MAX_HEALTH_FACTOR_VALUE_TO_RENDER, NATIVE_DECIMALS } from '@/src/constants/common'

/**
 * It takes a BigNumber and formats it as a string using uniswap conedison
 * @param {BigNumber} value - The amount to format
 * @param {number} decimals - The number of decimals the token has.
 * @param [symbol=$] - The symbol to use for the currency.
 * @param {'before' | 'after'} [symbolPosition=before] - 'before' | 'after' = 'before'
 */
export type SymbolPosition = 'before' | 'after'
export const formatAmount = (
  value: BigNumber,
  decimals: number = NATIVE_DECIMALS,
  symbol = '$',
  symbolPosition: SymbolPosition = 'before',
  numberType?: NumberType,
): string => {
  const number = FixedNumber.fromValue(value, decimals, 'fixed256x27').toUnsafeFloat()
  return symbol
    ? `${symbolPosition === 'before' ? `${symbol}` : ''}${formatNumber(number, numberType)}${
        symbolPosition === 'after' ? ` ${symbol}` : ''
      }`
    : `${formatNumber(number, numberType)}`
}

export const formatPercentage = (value: BigNumber, decimals: number) => {
  return `${parseFloat(
    FixedNumber.fromValue(value, decimals, 'fixed256x27').toUnsafeFloat().toFixed(3),
  )}%`
}

/**
 * Convert all wei values to a BigNumber as human readable form
 * @param {string | BigNumber} value - The value in wei you want to convert.
 * @param [decimals=18] - The number of decimals the token has.
 * @returns A BigNumber object
 */
export function fromWei(value: string | BigNumber, decimals = 18) {
  const hasDecimals =
    value instanceof BigNumber ? false : value.split('.')[1]?.length ? true : false

  if (hasDecimals) {
    throw new Error("Wei value mustn't have decimal places")
  }

  if (typeof value === 'string') {
    return BigNumber.from(value).div(parseUnits('1', decimals))
  }

  return value.div(parseUnits('1', decimals))
}

/**
 * Convert non wei values to wei
 * @param {string | BigNumber } value - The number you want to convert to wei.
 * @param [decimals=18] - The number of decimals the token has.
 * @returns A BigNumber object
 */
export function toWei(value: string | BigNumber, decimals = 18) {
  if (typeof value === 'string') {
    return parseUnits(value, decimals)
  }
  return parseUnits(value.toString(), decimals)
}

/**
 * It takes a number of seconds and returns a string that says how many seconds, minutes, hours, or
 * days that is
 * @param {Number} numSeconds - The number of seconds to convert to a string.
 * @returns A string
 */
export function secondsToString(numSeconds: number): string {
  if (numSeconds < 60) {
    return `${Math.round(numSeconds * 10) / 10} seconds`
  }
  if (numSeconds < 60 * 60) {
    return `${Math.round((numSeconds / 60) * 10) / 10} minutes`
  }
  if (numSeconds < 60 * 60 * 24) {
    return `${Math.round((numSeconds / (60 * 60)) * 10) / 10} hours`
  }
  return `${Math.round((numSeconds / (60 * 60 * 24)) * 10) / 10} days`
}

/*
 * Given a future date, return an object with the number of days, hours, and minutes until that date.
 * @param {Date} futureDate - The future date to convert to a string.
 * @returns A string that says how many days, hours, and minutes until that date.
 *
 */

export function futureDateToCooldownPeriod(
  futureDate: Date,
  currentDate: Date,
): {
  days: number
  hours: number
  minutes: number
} {
  const seconds = (futureDate.getTime() - currentDate.getTime()) / 1000
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return {
    days,
    hours,
    minutes,
  }
}

/*
 * Given a start date, end date and current return the percentage of time that has passed
 * between the start and end dates.
 *
 * The function takes three parameters
 *
 * start: The start date
 * end: The end date
 * current: The current date.
 * The function returns a number between 0 and 100, representing the percentage of time that has passed
 * between the start and end dates
 * @param {Date} start - The start date of the time period
 * @param {Date} end - The end date of the timer
 * @param {Date} current - The current date. If not provided, the current date will be used.
 * @returns A percentage of time passed between two dates.
 */
export const calculatePercentageTimePassedBetweenDates = (
  start: Date,
  end: Date,
  current: Date,
) => {
  const now = current

  if (start.getTime() > end.getTime()) {
    throw new Error('Start date must be before end date')
  }

  if (current.getTime() < start.getTime()) {
    return 0
  }

  if (current.getTime() > end.getTime()) {
    return 100
  }

  const timePassed = now.getTime() - start.getTime()
  const timeTotal = end.getTime() - start.getTime()

  const percentage = (timePassed / timeTotal) * 100

  return percentage > 100 ? 100 : percentage
}

export const formatHealthFactor = (
  value: BigNumber,
  decimals?: number,
  symbol?: string,
  symbolPosition?: SymbolPosition,
) => {
  const formatted = fromWei(value, decimals)
  return formatted.gt(MAX_HEALTH_FACTOR_VALUE_TO_RENDER)
    ? '∞'
    : formatAmount(value, decimals ?? 18, symbol || '', symbolPosition)
}

export const toNumber = (value: BigNumber, decimals: number) =>
  FixedNumber.fromValue(value, decimals).toUnsafeFloat()
