window.ROConfigHappyRO = {
	development: true,
	remoteClient: `${window.location.origin}/`,
	servers: [
		{
			display: 'HappyRO',
			desc: 'Renewal 2021-11-03',
			address: '10.24.1.1',
			port: 6900,
			version: 25,
			langtype: 0xf0,
			packetver: 20211103,
			renewal: true,
			worldMapSettings: { episode: 18 },
			packetKeys: false,
			socketProxy: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/`,
			forceUseAddress: true,
			adminList: []
		}
	],
	packetDump: false,
	loadLua: true,
	enableMapName: true,
	enableAchievements: true,
	skipServerList: true,
	skipIntro: false,
	registrationweb: '',
	autoLogin: []
};
