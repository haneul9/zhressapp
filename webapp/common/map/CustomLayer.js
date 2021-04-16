window.common = window.common || {};
common.map = common.map || {};

common.map.CustomLayer = function() {

	this.layer = $('<div style="position:absolute; z-index:10000; background-color:#fff; border:solid 1px #333; padding:10px; display:none"></div>');
};

common.map.CustomLayer.prototype.get = function() {

	return this.layer;
};

common.map.CustomLayer.prototype.show = function(data) {

	// var coordHtml = [
	// 	'Coord: (우 클릭 지점 위/경도 좌표)',
	// 	'Point: ' + e.point,
	// 	'Offset: ' + e.offset
	// ].join('<br />');

	this.layer.html(data.html).css({ left: data.offset.x, top: data.offset.y }).show();

	return this;
};

common.map.CustomLayer.prototype.hide = function() {

	this.layer.hide().html('').css({ left: 0, top: 0 });

	return this;
};