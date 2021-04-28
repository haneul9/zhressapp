(function() {
	var paramMap = {};
	$.map(location.search.replace(/\?/, '').split(/&/), function (v) {
		var pair = v.split(/=/);
		paramMap[pair[0]] = decodeURIComponent(pair[1]);
	});
	if (!paramMap.pernr) {
		location.href = 'UnderConstruction.html';
	}
})();