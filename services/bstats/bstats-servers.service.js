import Joi from 'joi'
import { metric } from '../text-formatters.js'
import { BaseJsonService, pathParams } from '../index.js'

const schema = Joi.array()
  .items(Joi.array().items(Joi.number().required(), Joi.number().required()))
  .required()

export default class BStatsServers extends BaseJsonService {
  static category = 'other'
  static route = { base: 'bstats/servers', pattern: ':pluginid' }

  static openApi = {
    '/bstats/servers/{pluginid}': {
      get: {
        summary: 'bStats Servers',
        parameters: pathParams({
          name: 'pluginid',
          example: '1',
        }),
      },
    },
  }

  static defaultBadgeData = { label: 'servers', color: 'blue' }

  static render({ servers }) {
    return {
      message: metric(servers),
    }
  }

  async fetch({ pluginid }) {
    const url = `https://bstats.org/api/v1/plugins/${pluginid}/charts/servers/data`

    return this._requestJson({
      schema,
      options: {
        searchParams: {
          maxElements: 1,
        },
      },
      url,
    })
  }

  transform({ json }) {
    const servers = json[0][1]
    return { servers }
  }

  async handle({ pluginid }) {
    const json = await this.fetch({ pluginid })
    const { servers } = this.transform({ json })
    return this.constructor.render({ servers })
  }
}
