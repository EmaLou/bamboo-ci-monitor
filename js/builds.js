function renderSavedPlansStatus() {
	var savedPlans = storage.getStorage(),
			name, status;
	$('#status ul').html('');
	for (i in savedPlans) {
		$('#status ul').append('<li><img src="' + savedPlans[i].getStatusIcon() + '"></img>' + savedPlans[i].name + '</li>');
	}
}

$(document).ready(function() {
	renderSavedPlansStatus();
	setInterval(renderSavedPlansStatus, 5000);
});