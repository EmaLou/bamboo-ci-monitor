describe('Project', function() {
	var project;

	it('should render project info and plan list', function() {
		project = new Project({
			name: 'project',
			key: 'PROJ',
			plans: [
				{
					name: 'plan1',
					key: 'KEY1',
					href: 'http://test.com/plan1'
				},
				{
					name: 'plan2',
					key: 'KEY2',
					href: 'http://test.com/plan2'
				}
			]
		});

		expect(project.render()).toBe(
			'<li id="PROJ" class="project">' +
				'<span>project</span>' +
			'</li>' +
			'<ul>' +
				'<li class="plan addPlan" data-key="KEY1" data-name="plan1" data-href="http://test.com/plan1">' +
					'<span>plan1</span>' +
					'<span class="save">✔</span>' +
				'</li>' +
				'<li class="plan addPlan" data-key="KEY2" data-name="plan2" data-href="http://test.com/plan2">' +
					'<span>plan2</span>' +
					'<span class="save">✔</span>' +
				'</li>' +
			'</ul>'
			)
	});
})