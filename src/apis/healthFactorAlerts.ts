import { HYPERNATIVE_TOKEN } from '@/coverage/hiddenConstants' // TODO: This is a temporary location

const API_BASE_URL = 'https://api.hypernative.xyz'

interface Data {
  results: Result[]
}

interface Result {
  agentName: string
  alertPolicies: { [key: string]: AlertPolicy }
  id: number
  rule: {
    isReminderEnabled: boolean
    threshold: number
  }
}

interface AlertPolicy {
  remindersConfigurations: { [key: string]: ReminderConfiguration }
}

interface ReminderConfiguration {
  configuration: {
    email: { [key: string]: string }
  }
}

function normalizeAddress(address: string): string {
  return address.toLowerCase()
}

const filterUserValues = (data: Data, userAddress: string) => {
  userAddress = normalizeAddress(userAddress)
  const agent = data.results.find((result) => result.agentName === userAddress)
  if (!agent) {
    return {
      isReminderEnabled: false,
      threshold: 0,
      email: '',
      isAgentListed: false,
      id: 0,
    }
  }
  const values = {
    isReminderEnabled: agent.rule.isReminderEnabled,
    threshold: agent.rule.threshold,
    email: '' as string,
    isAgentListed: true,
    id: agent.id,
  }
  for (const policyKey in agent.alertPolicies) {
    const remindersConfigurations = agent.alertPolicies[policyKey].remindersConfigurations
    for (const configKey in remindersConfigurations) {
      const emailConfigurations = remindersConfigurations[configKey].configuration.email
      values.email = emailConfigurations[0]
    }
  }
  return values
}

export const getUserHealthFactorAlerts = async (userAddress: string) => {
  userAddress = normalizeAddress(userAddress)
  try {
    const response = await fetch(`${API_BASE_URL}/custom-agents`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${HYPERNATIVE_TOKEN}`,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }
    const data = await response.json()
    if (data.success === false || data.error === 'Unauthorized') {
      throw new Error(data.error || 'Failed to fetch health factor alerts')
    }
    const userValues = filterUserValues(data.data, userAddress)
    return userValues
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateUserHealthFactorAlerts = async (
  id: number,
  userAddress: string,
  threshold: number,
  email: string,
  state: boolean,
) => {
  userAddress = normalizeAddress(userAddress)
  try {
    const userAddressAlias = `${userAddress.substring(0, 6)}...${userAddress.substring(
      userAddress.length - 5,
    )}`
    const response = await fetch(`${API_BASE_URL}/custom-agents/${id.toString()}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${HYPERNATIVE_TOKEN}`,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        agentName: userAddress,
        agentType: 'lendingPositionHealth',
        severity: 'High',
        muteDuration: 0,
        state: state ? 'enabled' : 'disabled',
        rule: {
          chain: 'gnosis',
          chainDisplayName: 'Gnosis',
          userAccountAddress: userAddress,
          userAccountAddressAlias: userAddressAlias,
          isReminderEnabled: state,
          protocol: 'Agave',
          direction: 'below',
          monitoredToken: '',
          threshold: threshold,
          ruleString: `On Gnosis: when Position Health factor of ${userAddressAlias} on Agave is below ${threshold.toString()}`,
        },
        channelsConfigurations: [
          {
            channelType: 'Email',
            configuration: {
              email: [email],
            },
          },
        ],
        remindersConfigurations: [
          {
            channelType: 'Email',
            configuration: {
              email: [email],
            },
          },
        ],
      }),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const createUserHealthFactorAlerts = async (
  userAddress: string,
  threshold: number,
  email: string,
  state: boolean,
) => {
  userAddress = normalizeAddress(userAddress)
  try {
    const userAddressAlias = `${userAddress.substring(0, 6)}...${userAddress.substring(
      userAddress.length - 5,
    )}`
    const response = await fetch(`${API_BASE_URL}/custom-agents/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HYPERNATIVE_TOKEN}`,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        agentName: userAddress,
        agentType: 'lendingPositionHealth',
        state: state ? 'enabled' : 'disabled',
        rule: {
          chain: 'gnosis',
          chainDisplayName: 'Gnosis',
          userAccountAddress: userAddress,
          userAccountAddressAlias: userAddressAlias,
          isReminderEnabled: state,
          protocol: 'Agave',
          direction: 'below',
          monitoredToken: '',
          threshold: threshold,
          ruleString: `On Gnosis: when Position Health factor of ${userAddressAlias} on Agave is below ${threshold.toString()}`,
        },
        severity: 'High',
        muteDuration: 0,
        channelsConfigurations: [
          {
            channelType: 'Email',
            configuration: {
              email: [email],
            },
          },
        ],
        remindersConfigurations: [
          {
            channelType: 'Email',
            configuration: {
              email: [email],
            },
          },
        ],
      }),
    })
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
