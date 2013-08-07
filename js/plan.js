var Plan = function(planJSON) {
	this.name = planJSON.name;
	this.key = planJSON.key;
	this.href = planJSON.href;
	this.latestBuildNumber = planJSON.latestBuildNumber;
	this.latestBuildStatus = planJSON.latestBuildStatus;
	this.currentBuildNumber = planJSON.currentBuildNumber;
	this.currentBuildStatus = planJSON.currentBuildStatus;
	this.linkTemplate = _.template('<a href="<%= href %>" target="_blank"><%= name %></a>');
	this.iconTemplate = _.template('<img src="<%= src %>"></img>');
	this.requestPlanTemplate = _.template(
		'<li class="plan addPlan<%= saved %>" data-key="<%= key %>" data-name="<%= name %>" data-href="<%= href %>">' +
			'<span><%= name %></span>' +
			'<span class="save">✔</span>' +
		'</li>'
		);

	this.savedPlanTemplate = _.template(
		'<li id="<%= key %>" class="plan" data-key="<%= key %>" data-href="<%= href %>" data-name="<%= name %>">' + 
			'<%= linkHtml %>' +
			'<span class="deletePlan">✘</span>' +
		'</li>'
		);

	this.statusTemplate = _.template(
		'<li class="plan">' +
		  '<%= iconHtml %>' +
		  '<%= linkHtml %>' +
		'</li>'
		)
}

Plan.prototype.toJSON = function() {
	return {
		name: this.name,
		key: this.key,
		href: this.href,
		latestBuildNumber: this.latestBuildNumber,
		latestBuildStatus: this.latestBuildStatus,
		currentBuildNumber: this.currentBuildNumber,
		currentBuildStatus: this.currentBuildStatus
	}
};

Plan.prototype.equals = function(plan) {
	if (this.name === plan.name
		  && this.key === plan.key
		  && this.href === plan.href) {
		return true;
	}
};

Plan.prototype.getHref = function() {
	var host = /^(https?:\/\/)?([A-Za-z\d\.-]+)\//.exec(this.href)[0];
	return host + 'browse/' + this.key;
};

Plan.prototype.updateLatestStatus = function(latestBuildNumber, latestBuildStatus) {
	this.latestBuildNumber = latestBuildNumber;
	this.latestBuildStatus = latestBuildStatus;
};

Plan.prototype.updateCurrentStatus = function(currentBuildNumber, currentBuildStatus) {
	this.currentBuildNumber = currentBuildNumber;
	this.currentBuildStatus = currentBuildStatus;
};

Plan.prototype.getStatus = function() {
	var statusIndex = 0;
	if (this.currentBuildStatus === "Unknown") {
		statusIndex += 2;
	}
	if (this.latestBuildStatus === "Successful") {
		statusIndex += 1;
	}
	if (this.latestBuildStatus === "Failed") {
		statusIndex += 2;
	}
	return statusIndex;
};

Plan.prototype.renderIcon = function() {
	var index = this.getStatus();
			icon = new Icon();
			
	return this.iconTemplate({
		src: icon.getIconOfStatus([index])
	});
};

Plan.prototype.renderLink = function() {
  return this.linkTemplate({
  	href: this.getHref(),
  	name: this.name
  })
};

Plan.prototype.renderForRequested = function(saved) {
	return this.requestPlanTemplate({
		saved: saved? ' saved':'',
		key: this.key,
		name: this.name,
		href: this.href
	});
};

Plan.prototype.renderForSaved = function() {
	return this.savedPlanTemplate({
		linkHtml: this.renderLink(),
		key: this.key,
		name: this.name,
		href: this.href
	})
};

Plan.prototype.renderStatus = function() {
	return this.statusTemplate({
		iconHtml: this.renderIcon(),
		linkHtml: this.renderLink()
	});
};