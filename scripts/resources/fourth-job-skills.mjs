// Overlay the current Renewal fourth-job rules on the verified kRO snapshot.
// The source snapshot stays immutable; generated runtime data follows the server.
export function applyFourthJobSkills(runtime, database, trees, jobIds) {
	const byName = new Map(database.map(skill => [skill.Name, skill]));
	const fourthTrees = trees.filter(tree => {
		const id = jobIds[tree.Job.toUpperCase()];
		return (id >= 4252 && id <= 4264) || (id >= 4302 && id <= 4308);
	});
	const prefixes = new Set(fourthTrees.flatMap(tree => (tree.Tree || []).map(skill => skill.Name.split('_')[0])));
	const levels = (value, key, max, defaultValue) => Array.from({length: max}, (_, i) => {
		if (typeof value === 'number') return value;
		return value?.find(entry => entry.Level === i + 1)?.[key] ?? defaultValue;
	});
	for (const skill of database) {
		if (!prefixes.has(skill.Name.split('_')[0])) continue;
		const existing = runtime.skills[skill.Id];
		runtime.skills[skill.Id] = {
			...existing,
			resourceName: skill.Name,
			maxLevel: skill.MaxLevel,
			spAmount: levels(skill.Requires?.SpCost, 'Amount', skill.MaxLevel, 0),
			attackRange: levels(skill.Range, 'Size', skill.MaxLevel, 1),
			separateLevel: existing?.separateLevel ?? skill.MaxLevel > 1,
			skillScale: existing?.skillScale || [],
			jobNeedSkills: {},
			needSkills: []
		};
	}
	for (const tree of fourthTrees) {
		const jobId = jobIds[tree.Job.toUpperCase()];
		const layout = runtime.trees[jobId];
		if (!layout) throw new Error(`Missing fourth-job base layout: ${tree.Job}`);
		let next = Math.max(-1, ...Object.entries(layout).filter(([key]) => /^\d+$/.test(key)).map(([, slot]) => slot)) + 1;
		for (const entry of tree.Tree || []) {
			const skill = byName.get(entry.Name);
			if (!skill) throw new Error(`Unknown fourth-job skill: ${entry.Name}`);
			const requirements = (entry.Requires || []).map(required => {
				const prerequisite = byName.get(required.Name);
				if (!prerequisite) throw new Error(`Unknown prerequisite: ${required.Name}`);
				return [prerequisite.Id, required.Level];
			});
			runtime.skills[skill.Id].jobNeedSkills[jobId] = requirements;
			runtime.skills[skill.Id].needSkills = requirements;
			if (layout[skill.Id] === undefined) layout[skill.Id] = next++;
		}
	}
}
