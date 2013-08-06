describe('Plan', function() {
	var plan;

	beforeEach(function() {
		plan = new Plan({
			key: "KEY",
			name: "name",
			href: "http://test.com/rest/api/latest/key.json",
			latestBuildNumber: 0,
			latestBuildStatus: "Successful",
			currentBuildNumber: 1,
			currentBuildStatus: "Unknown"
		});
		setFixtures('<div id="plan"></div>');
	});

	it('should get the href of the plan', function() {
		expect(plan.getHref()).toBe('http://test.com/browse/KEY');
	})

	it('should get link of the plan page', function() {
		expect(plan.renderLink()).toBe('<a href="http://test.com/browse/KEY" target="_blank">name</a>');
	});

	it('should equal to another plan if name & key & href are same', function() {
		var anotherPlan = new Plan({
			key: "KEY",
			name: "name",
			href: "http://test.com/rest/api/latest/key.json"
		});
		expect(plan.equals(anotherPlan)).toBe(true);
	})

	it('should get status 0 and invalid icon when no build status is available', function() {
		plan = new Plan({
			key: "KEY",
			name: "name",
			href: "http://test.com/rest/api/latest/key.json",
			latestBuildNumber: 0,
			latestBuildStatus: "NULL",
			currentBuildNumber: 1,
			currentBuildStatus: "NULL"
		});
		expect(plan.getStatus()).toBe(0);
		expect(plan.renderIcon()).toBe('<img src="img/icon-inactive.png"></img>');
	})

	it('should get status 1 and success icon when current build status is NULL and latest build status is Successful', function() {
		plan = new Plan({
			key: "KEY",
			name: "name",
			href: "http://test.com/rest/api/latest/key.json",
			latestBuildNumber: 0,
			latestBuildStatus: "Successful",
			currentBuildNumber: 1,
			currentBuildStatus: "NULL"
		});
		expect(plan.getStatus()).toBe(1);
		expect(plan.renderIcon()).toBe('<img src="img/icon-success.png"></img>');
	});

	it('should get status 2 and failure icon when current build status is NULL and latest build status is Failed', function() {
		plan = new Plan({
			key: "KEY",
			name: "name",
			href: "http://test.com/rest/api/latest/key.json",
			latestBuildNumber: 0,
			latestBuildStatus: "Failed",
			currentBuildNumber: 1,
			currentBuildStatus: "NULL"
		});
		expect(plan.getStatus()).toBe(2);
		expect(plan.renderIcon()).toBe('<img src="img/icon-failure.png"></img>');
	});

	it('should get status 3 and success-building icon when current build status is Unknown and latest build status is Successful', function() {
		plan = new Plan({
			key: "KEY",
			name: "name",
			href: "http://test.com/rest/api/latest/key.json",
			latestBuildNumber: 0,
			latestBuildStatus: "Successful",
			currentBuildNumber: 1,
			currentBuildStatus: "Unknown"
		});
		expect(plan.getStatus()).toBe(3);
		expect(plan.renderIcon()).toBe('<img src="img/icon-success-building.png"></img>');
	});

	it('should get status 4 and failure-building icon when current build status is Unknown and latest build status is Failed', function() {
		plan = new Plan({
			key: "KEY",
			name: "name",
			href: "http://test.com/rest/api/latest/key.json",
			latestBuildNumber: 0,
			latestBuildStatus: "Failed",
			currentBuildNumber: 1,
			currentBuildStatus: "Unknown"
		});
		expect(plan.getStatus()).toBe(4);
		expect(plan.renderIcon()).toBe('<img src="img/icon-failure-building.png"></img>');
	});

	it('should update latest build status', function() {
		expect(plan.getStatus()).toBe(3);
		plan.updateLatestStatus(0, 'Failed');
		expect(plan.getStatus()).toBe(4);
	});

	it('should update current build status', function() {
		expect(plan.getStatus()).toBe(3);
		plan.updateCurrentStatus(1, 'NULL');
		expect(plan.getStatus()).toBe(1);
	});

	it('shoule render new plan for requested if not saved', function() {
		expect(plan.renderForRequested(false)).toBe(
			'<li class="plan addPlan">' +
				'<span data-key="KEY" data-name="name" data-href="http://test.com/rest/api/latest/key.json">name</span>' +
				'<span class="saved">✔</span>' +
			'</li>');
	});

	it('shoule render new plan for requested if not saved', function() {
		expect(plan.renderForRequested(true)).toBe(
			'<li class="plan addPlan saved">' +
				'<span data-key="KEY" data-name="name" data-href="http://test.com/rest/api/latest/key.json">name</span>' +
				'<span class="saved">✔</span>' +
			'</li>');
	});

	it('should render saved plan', function() {
		expect(plan.renderForSaved()).toBe(
			'<li id="KEY" class="plan" data-key="KEY" data-href="http://test.com/rest/api/latest/key.json" data-name="name">' + 
				'<a href="http://test.com/browse/KEY" target="_blank">name</a>' +
				'<span class="deletePlan">✘</span>' +
			'</li>'
			)
	});

	it('should render status', function() {
		expect(plan.renderStatus()).toBe(
			'<li class="plan">' +
			  '<img src="img/icon-success-building.png"></img>' +
			  '<a href="http://test.com/browse/KEY" target="_blank">name</a>' +
			'</li>'
			);
	})
});