var Plan = function(planJSON) {
	this.name = planJSON.name;
	this.key = planJSON.key;
	this.href = planJSON.href;
	this.latestBuildNumber = planJSON.latestNumber;
	this.latestStatus = planJSON.latestStatus;
	this.currentBuildNumber = planJSON.currentNumber;
	this.currentStatus = planJSON.currentStatus;
}

var statusIcons = [ 'img/icon-inactive.png', 
										'img/icon-success.png', 
										'img/icon-failure.png', 
										'img/icon-success-building.png', 
										'img/icon-failure-building.png'
									];

Plan.prototype.toJSON = function() {
	return {
		name: this.name,
		key: this.key,
		href: this.href,
		latestBuildNumber: this.latestBuildNumber,
		latestStatus: this.latestStatus,
		currentBuildNumber: this.currentBuildNumber,
		currentStatus: this.currentStatus
	}
};

Plan.prototype.equals = function(plan) {
	if (this.name === plan.name
		  && this.key === plan.key
		  && this.href === plan.href) {
		return true;
	}
};

Plan.prototype.getLink = function() {
  var hostPattern = /^(https?:\/\/)?([A-Za-z\d\.-]+)\//,
      host = hostPattern.exec(this.href)[0];
  return '<a href="' + host + 'browse/' + this.key + '">' + this.name + '</a>';
};

Plan.prototype.updateLatestStatus = function(latestBuildNumber, latestStatus) {
	this.latestBuildNumber = latestBuildNumber;
	this.latestStatus = latestStatus;
};

Plan.prototype.updateCurrentStatus = function(currentBuildNumber, currentStatus) {
	this.currentBuildNumber = currentBuildNumber;
	this.currentStatus = currentStatus;
};

Plan.prototype.getStatusIndex = function() {
	var statusIndex = 0;
	if (this.currentStatus === "Unknown") {
		statusIndex += 2;
	}
	if (this.latestStatus === "Successful") {
		statusIndex += 1;
	}
	if (this.latestStatus === "Failed") {
		statusIndex += 2;
	}
	return statusIndex;
};

Plan.prototype.getStatusIcon = function() {
	var index = this.getStatusIndex();
	return statusIcons[index];
};