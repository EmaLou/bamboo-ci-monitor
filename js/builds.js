function getPlanStatusImg(plan) {
	if (plan.latestStatus === undefined || plan.currentStatus === undefined) {
		return 'img/icon-inactive.png';
	}
	if (plan.currentStatus === "NULL") {
		return (plan.latestStatus === "Successful") ? 'img/icon-success.png' : 'img/icon-failure.png';
	}
	else {
		return (plan.latestStatus === "Successful") ? 'img/icon-success-building.png' : 'img/icon-failure-building.png';
	}
}

function renderSavedPlansStatus() {
	var savedPlans = storage.getStorage(),
			name, status;
	$('#status ul').html('');
	for (i in savedPlans) {
		$('#status ul').append('<li><img src="' + getPlanStatusImg(savedPlans[i]) + '"></img>' + savedPlans[i].name + '</li>');
	}
}

$(document).ready(function() {
	renderSavedPlansStatus();	
	setInterval(renderSavedPlansStatus, 5000);
});