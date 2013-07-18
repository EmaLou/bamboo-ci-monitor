var hostPattern = /^(https?:\/\/)?([A-Za-z\d\.-]+)\//;

function saveLatestStatusToPlan(data, plan) {
	plan.number = data.results.result[0].number;
	plan.status = data.results.result[0].state;
	storage.savePlanStatusToStorage(plan);
}

function saveCurrentStatusToPlan(data, plan) {
	var host = hostPattern.exec(plan.href);
	$.ajax({
		url: host[0] + 'rest/api/latest/result/' + plan.key + '/' + (data.results.result[0].number + 1) + '.json',
		statusCode: {
			200: function(data) {
				plan.number = data.number;
				plan.status = data.state;
				storage.savePlanStatusToStorage(plan);
			}
		}
	});
}

function getLatestStatus(plan){
	var host = hostPattern.exec(plan.href);
	$.ajax({
		url: host[0] + 'rest/api/latest/result/' + plan.key + '.json',
		success: function(data) {
			saveLatestStatusToPlan(data, plan);
			saveCurrentStatusToPlan(data, plan);
		}
	})
}

function fetchSavedPlansStatus () {
	var savedPlans = storage.getStorage();
	for (i in savedPlans) {
		getLatestStatus(savedPlans[i]);
	}
}

setInterval(fetchSavedPlansStatus, 5000);