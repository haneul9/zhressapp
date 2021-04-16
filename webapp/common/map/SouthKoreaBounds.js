/* global naver:true */
window.common = window.common || {};
common.map = common.map || {};

common.map.SouthKoreaBounds = function() {}

common.map.SouthKoreaBounds.prototype.get = function() {

	return new naver.maps.LatLngBounds(
		new naver.maps.LatLng(32, 124),
		new naver.maps.LatLng(39, 132)
	);
};

common.map.SouthKoreaBounds.prototype.getRectangle = function(oMap) {

    if (!oMap) {
		throw new Error('map parameter is required.');
	}

	if (this.rectangle) {
		return this.rectangle;
	}

	return this.rectangle = new naver.maps.Rectangle({
		strokeOpacity: 0,
		strokeWeight: 0,
		fillOpacity: 0.1,
		fillColor: '#f00',
		bounds: this.get(),
        map: oMap
	});
};