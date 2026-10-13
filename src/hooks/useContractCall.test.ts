import useSWR from 'swr'

import { useContractCall } from './useContractCall'

jest.mock('swr', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('@/src/providers/web3ConnectionProvider', () => ({
  useWeb3Connection: () => ({ appChainId: 100 }),
}))

const mockUseSWR = useSWR as jest.Mock
let fetcher: () => Promise<unknown>
const refetch = jest.fn()

beforeEach(() => {
  mockUseSWR.mockImplementation((_key, nextFetcher) => {
    fetcher = nextFetcher
    return { data: undefined, error: undefined, mutate: refetch }
  })
})

it('preserves the empty placeholder and forwards parameters in tuple order', async () => {
  const first = jest.fn().mockResolvedValue('first')
  const second = jest.fn().mockResolvedValue('second')
  const result = useContractCall([first, second] as const, [['one'], ['two']], 'test')
  expect(result).toEqual([{ data: [], error: null }, refetch])
  await expect(fetcher()).resolves.toEqual(['first', 'second'])
  expect(first).toHaveBeenCalledWith('one')
  expect(second).toHaveBeenCalledWith('two')
})

it.each(['throw', 'reject'])('propagates a contract %s to SWR', async (failure) => {
  const error = new Error('Contract call failed')
  const call = jest.fn(() => {
    if (failure === 'throw') throw error
    return Promise.reject(error)
  })
  useContractCall([call] as const, [[]], 'test')
  await expect(fetcher()).rejects.toBe(error)
})

it('exposes SWR errors instead of an empty successful result', () => {
  const error = new Error('RPC failed')
  mockUseSWR.mockReturnValue({ error, data: undefined, mutate: refetch })
  const call = jest.fn().mockResolvedValue('unused')
  const result = useContractCall([call] as const, [[]], 'test')
  expect(result).toEqual([{ data: null, error }, refetch])
})
