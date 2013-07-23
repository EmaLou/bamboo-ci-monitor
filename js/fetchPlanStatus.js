var hostPattern = /^(https?:\/\/)?([A-Za-z\d\.-]+)\//;

function updateCurrentStatus(data, plan) {
	var host = hostPattern.exec(plan.href);
	$.ajax({
		url: host[0] + 'rest/api/latest/result/' + plan.key + '/' + (data.results.result[0].number + 1) + '.json',
		statusCode: {
			200: function(response) {
				plan.updateCurrentStatus(response.number, response.state);
			},
			404: function() {
				plan.updateCurrentStatus(data.results.result[0].number + 1, 'NULL');
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
			updateCurrentStatus(data, plan);
			storage.savePlanToStorage(plan);
		}
	});
}

function fetchSavedPlansStatus () {
	var savedPlans = storage.getStorage();
	for (i in savedPlans) {
		updatePlanStatus(savedPlans[i]);
	}
}

setInterval(fetchSavedPlansStatus, 5000);