function renderSavedPlansStatus() {
	var savedPlans = storage.getStorage(),
			name, status;
	$('#status ul').html('');
	for (i in savedPlans) {
		$('#status ul').append(
			'<li class="plan">' +
			  '<img src="' + savedPlans[i].getStatusIcon() + '"></img>' +
			  savedPlans[i].getLink() +
			'</li>');
	}
}

$(document).ready(function() {
	renderSavedPlansStatus();
	setInterval(renderSavedPlansStatus, 5000);
});