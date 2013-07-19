var hostPattern = /^(https?:\/\/)?([A-Za-z\d\.-]+)\//;

function updateLatestStatus(data, plan) {
	storage.savePlanStatusToStorage(plan, {
		latestNumber: data.results.result[0].number,
		latestStatus: data.results.result[0].state
	});
}

function updateCurrentStatus(data, plan) {
	var host = hostPattern.exec(plan.href);
	$.ajax({
		url: host[0] + 'rest/api/latest/result/' + plan.key + '/' + (data.results.result[0].number + 1) + '.json',
		statusCode: {
			200: function(response) {
				storage.savePlanStatusToStorage(plan, {
					currentNumber: response.number,
					currentStatus: response.state
				});
			},
			404: function() {
				storage.savePlanStatusToStorage(plan, {
					currentNumber: data.results.result[0].number + 1,
					currentStatus: 'NULL'
				});
			}
		}
	});
}

function updatePlanStatus(plan){
	var host = hostPattern.exec(plan.href);
	$.ajax({
		url: host[0] + 'rest/api/latest/result/' + plan.key + '.json',
		success: function(data) {
			updateLatestStatus(data, plan);
			updateCurrentStatus(data, plan);
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