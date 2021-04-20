/* global naver */
window.common = window.common || {};
common.map = common.map || {};

common.map.AddressOverlay = function(options) {

	this._element = $('<div style="display:none; position:absolute; top:0; left:0; background-color:#fff; border:solid 1px #333; padding:10px"></div>');
	this.setPosition(options.position);
};

common.map.AddressOverlay.prototype = Object.create(naver.maps.OverlayView.prototype);
common.map.AddressOverlay.prototype.constructor = common.map.AddressOverlay;

common.map.AddressOverlay.prototype.setPosition = function(position) {

	this._position = position;
	this.draw();
};

common.map.AddressOverlay.prototype.getPosition = function() {

	return this._position;
};

common.map.AddressOverlay.prototype.onAdd = function() {

	this._element.appendTo(this.getPanes().floatPane);
	this._element.show();
};

common.map.AddressOverlay.prototype.onRemove = function () {

	this._element.hide();
};

common.map.AddressOverlay.prototype.draw = function() {

	if (!this.getMap()) {
		return;
	}

	var projection = this.getProjection(),
	position = this.getPosition(),
	pixelPosition, top, left;

	if (position instanceof naver.maps.Marker) {
		pixelPosition = projection.fromCoordToOffset(position.getPosition());
		top = pixelPosition.y - (this._element.outerHeight() + position.getSize().height);
		left = pixelPosition.x - (this._element.width() / 2);
	} else {
		pixelPosition = projection.fromCoordToOffset(position);
		top = pixelPosition.y;
		left = pixelPosition.x;
	}

	this._element.css('top', top);
	this._element.css('left', left);
};

common.map.AddressOverlay.prototype.setContent = function(content) {

	this._element.html(content);
};