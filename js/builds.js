function renderSavedPlansStatus() {
	var savedPlans = storage.getStorage(),
			name, status;
	$('#status ul').html('');
	for (i in savedPlans) {
		$('#status ul').append(
			'<li class="plan">' +
			  savedPlans[i].renderIcon() +
			  savedPlans[i].renderLink() +
			'</li>');
	}
}

$(document).ready(function() {
	renderSavedPlansStatus();
	setInterval(renderSavedPlansStatus, 5000);
});