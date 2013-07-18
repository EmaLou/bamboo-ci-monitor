function renderSavedPlansStatus() {
	var savedPlans = storage.getStorage(),
			name, status;
	$('#status ul').html('');

	for (i in savedPlans) {
		name = savedPlans[i].name;
		status = savedPlans[i].status;
		if (status === undefined) {
			status = 'unavailable';
		}
		$('#status ul').append('<li>' + name + ' ' + status + '</li>');
	}
}

$(document).ready(function() {
	renderSavedPlansStatus();	
	setInterval(renderSavedPlansStatus, 5000);
});