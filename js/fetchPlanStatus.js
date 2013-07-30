var hostPattern = /^(https?:\/\/)?([A-Za-z\d\.-]+)\//;

function updateCurrentStatus(data, plan) {
	var host = hostPattern.exec(plan.href);
	$.ajax({
		url: host[0] + 'rest/api/latest/result/' + plan.key + '/' + (data.results.result[0].number + 1) + '.json',
		statusCode: {
			200: function(response) {
				plan.updateCurrentStatus(response.number, response.state);
				storage.updatePlan(plan);
			},
			404: function() {
				plan.updateCurrentStatus(data.results.result[0].number + 1, 'NULL');
				storage.updatePlan(plan);
			}
		}
	});
}

function updatePlanStatus(plan){
	var host = hostPattern.exec(plan.href);
	$.ajax({
		url: host[0] + 'rest/api/latest/result/' + plan.key + '.json',
		success: function(data) {
			plan.updateLatestStatus(data.results.result[0].number, data.results.result[0].state);
			storage.updatePlan(plan);
			updateCurrentStatus(data, plan);
		},
		error: function(data) {
			plan.updateLatestStatus(0, 'NULL');
			plan.updateCurrentStatus(1, 'NULL');
			storage.updatePlan(plan);
		},
		timeout: 7000
	});
}

function updateIcon(icon, plan) {
	if (plan.getStatusIndex() > icon) {
		return plan.getStatusIndex();
	}
	return icon;
}

function fetchSavedPlansStatus () {
	var savedPlans = storage.getStorage(),
			icon = 0;
	for (i in savedPlans) {
		updatePlanStatus(savedPlans[i]);
		icon = updateIcon(icon, savedPlans[i]);
	}
	chrome.browserAction.setIcon({
		path: statusIcons[icon]
	});
}

fetchSavedPlansStatus();
setInterval(fetchSavedPlansStatus, 5000);