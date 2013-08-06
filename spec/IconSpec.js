describe('Icon', function() {
	var icon;

	beforeEach(function() {
		icon = new Icon();
	})

	it('should return proper icon for plan status', function() {
		expect(icon.getIconOfStatus(0)).toBe('img/icon-inactive.png');
		expect(icon.getIconOfStatus(1)).toBe('img/icon-success.png');
		expect(icon.getIconOfStatus(2)).toBe('img/icon-failure.png');
		expect(icon.getIconOfStatus(3)).toBe('img/icon-success-building.png');
		expect(icon.getIconOfStatus(4)).toBe('img/icon-failure-building.png');
	})
})