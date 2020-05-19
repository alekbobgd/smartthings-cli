import { flags } from '@oclif/command'

import { DeviceListOptions } from '@smartthings/core-sdk'

import { APICommand } from '@smartthings/cli-lib'


export default class DevicesList extends APICommand {
	static description = 'get a list of devices'

	static flags = {
		...APICommand.flags,
		'location-id': flags.string({
			char: 'l',
			description: 'filter results by location',
			multiple: true,
		}),
		capability: flags.string({
			char: 'c',
			description: 'filter results by capability',
			multiple: true,
		}),
		'capabilities-mode': flags.string({
			char: 'C',
			description: 'Treat capability filter query params as a logical "or" or "and" with a default of "and".',
			dependsOn: ['capability'],
			options: ['and', 'or'],
		}),
		'device-id': flags.string({
			char: 'd',
			description: 'filter results by device',
			multiple: true,
		}),
	}

	async run(): Promise<void> {
		const { args, argv, flags } = this.parse(DevicesList)
		await super.setup(args, argv, flags)

		const deviceListOptions: DeviceListOptions = {
			capability: flags.capability,
			capabilitiesMode: flags['capabilities-mode'] === 'or' ? 'or' : 'and',
			locationId: flags['location-id'],
			deviceId: flags['device-id'],
		}
		this.client.devices.list(deviceListOptions).then(async devices => {
			this.log(JSON.stringify(devices, null, 4))
		}).catch(err => {
			this.log(`caught error ${err}`)
			this.exit(1)
		})
	}
}