var Icon = function() {
	this.statusIcons = [
		'img/icon-inactive.png', 
		'img/icon-success.png', 
		'img/icon-failure.png', 
		'img/icon-success-building.png', 
		'img/icon-failure-building.png'
	]
}

Icon.prototype.getIconOfStatus = function(status) {
	return this.statusIcons[status];
};