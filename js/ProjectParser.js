var ProjectParser = function() {
}

ProjectParser.prototype.parse = function(response) {
	var projects = [], 
			parsedProject;
	_.each(response.projects.project, function(project) {
		parsedProject = {
			name: project.name,
			key: project.key,
			plans: []
		};
		_.each(project.plans.plan, function(plan) {
			parsedProject.plans.push({
				name: plan.name,
				key: plan.key,
				href: plan.link.href
			});
		});

		projects.push(new Project(parsedProject));
	});

	return projects;
};