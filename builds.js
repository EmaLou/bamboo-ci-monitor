function getPlanStatus(plan) {
	if (plan.latestStatus === undefined || plan.currentStatus === undefined) {
		return 'unavailable';
	}
	if (plan.currentStatus === "NULL") {
		return plan.latestStatus;
	}
	else {
		return 'building after ' + plan.latestStatus;
	}
}

function renderSavedPlansStatus() {
	var savedPlans = storage.getStorage(),
			name, status;
	$('#status ul').html('');
	for (i in savedPlans) {
		$('#status ul').append('<li>' + savedPlans[i].name + ' ' + getPlanStatus(savedPlans[i]) + '</li>');
	}
}

$(document).ready(function() {
	renderSavedPlansStatus();	
	setInterval(renderSavedPlansStatus, 5000);
});