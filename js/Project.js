var Project = function(projectJSON) {
	var that = this;
	this.name = projectJSON.name;
	this.key = projectJSON.key;
	this.plans = [];
	this.projectTemplate = _.template(
			'<li id="<%= key %>" class="project">' +
				'<span><%= name %></span>' +
			'</li>' +
			'<ul>' +
				'<% _.each(plans, function(plan) { %>' +
					'<%= plan.renderForRequested(storage.findPlanInStorage(plan)) %>' +
				'<% }) %>' +
			'</ul>'
		);
			
	_.each(projectJSON.plans, function(plan) {
		that.plans.push(new Plan(plan));
	});
}

Project.prototype.render = function() {
	return this.projectTemplate({
		key: this.key,
		name: this.name,
		plans: this.plans
	});
};