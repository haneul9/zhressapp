/* global naver */
window.common = window.common || {};
common.map = common.map || {};

naver.maps.LatLng.prototype.toParamString = function() {

	return [this.lng(), this.lat()].join(',');
};

/*
 * @param options = {
	 id,
	 coord, // new naver.maps.LatLng(37.5125701, 127.1025624)
	 placeName
 }
 */
common.map.LotteChemMap = function(options) {

	this.functionProvider = options.functionProvider; // LccMapDialogHandler

	this.PLACE_TARGET = {
		CHOICE: 'choice',
		DEPARTURE: 'departure',
		DESTINATION: 'destination'
	};

	this.mPlaceTargetText = {};
	this.mPlaceTargetText[this.PLACE_TARGET.CHOICE] = '선택';
	this.mPlaceTargetText[this.PLACE_TARGET.DEPARTURE] = '출발지';
	this.mPlaceTargetText[this.PLACE_TARGET.DESTINATION] = '도착지';

	var oIconSize = new naver.maps.Size(30, 40),
	oIconAnchor = new naver.maps.Point(15, 40);
	this.mPlaceMarkerIcon = {};
	this.mPlaceMarkerIcon[this.PLACE_TARGET.CHOICE] = {
		content: '<span class="marker-choice"><i class="fas fa-map-marker-alt"></i></span>',
		size: oIconSize,
		anchor: oIconAnchor
	};
	this.mPlaceMarkerIcon[this.PLACE_TARGET.DEPARTURE] = {
		content: '<span class="marker-departure"><i class="fas fa-map-marker-alt"></i></span>',
		size: oIconSize,
		anchor: oIconAnchor
	};
	this.mPlaceMarkerIcon[this.PLACE_TARGET.DESTINATION] = {
		content: '<span class="marker-destination"><i class="fas fa-map-marker-alt"></i></span>',
		size: oIconSize,
		anchor: oIconAnchor
	};

	this.mMarkerMap = {};
	this.mMarkerMap[this.PLACE_TARGET.CHOICE] = null;
	this.mMarkerMap[this.PLACE_TARGET.DEPARTURE] = null;
	this.mMarkerMap[this.PLACE_TARGET.DESTINATION] = null;

	this.mAddressOverlayMap = {};
	this.mAddressOverlayMap[this.PLACE_TARGET.CHOICE] = null;
	this.mAddressOverlayMap[this.PLACE_TARGET.DEPARTURE] = null;
	this.mAddressOverlayMap[this.PLACE_TARGET.DESTINATION] = null;

	this.oMap = this.instantiate(options); // 실제 지도 생성
	this.oPathPolyline1 = new naver.maps.Polyline({ // 경로선 테두리
		path: [],
		strokeColor: '#000', // 8dc63f ff6347
		strokeWeight: 6,
		strokeLineCap: 'round',
		strokeLineJoin: 'round',
		startIcon: naver.maps.PointingIcon.CIRCLE,
		startIconSize: 7,
		endIcon: naver.maps.PointingIcon.CIRCLE,
		endIconSize: 7
	});
	this.oPathPolyline2 = new naver.maps.Polyline({ // 경로선 내부
		path: [],
		strokeColor: '#ff0',
		strokeWeight: 1,
		strokeLineCap: 'round',
		strokeLineJoin: 'round',
		startIcon: naver.maps.PointingIcon.CIRCLE,
		startIconSize: 2,
		endIcon: naver.maps.PointingIcon.CIRCLE,
		endIconSize: 2
	});

	if (options.maxBounds) {
		this.maxBounds = options.maxBounds;
		this.oMap.setOptions('maxBounds', options.maxBounds.get()); // new common.map.SouthKoreaBounds().get()
	}

	$(document)
		.off('click', '.button-departure')
		.on('click', '.button-departure', function() {
			this.setPlace(this.PLACE_TARGET.DEPARTURE);
		}.bind(this));

	$(document)
		.off('click', '.button-destination')
		.on('click', '.button-destination', function() {
			this.setPlace(this.PLACE_TARGET.DESTINATION);
		}.bind(this));
};

common.map.LotteChemMap.prototype.instantiate = function(options) {

	var oMapOptions = {
		center: this.getCoord(options.latitude, options.longitude), // default 롯데케미칼본사
		useStyleMap: true,
		logoControl: false,
		scaleControl: true,
		mapDataControl: false,
		mapTypeControl: false,
		zoomControl: true,
		maxZoom: 18,
		minZoom: 8,
		zoom: this.getDefaultZoom(),
		zoomControlOptions: {
			position: naver.maps.Position.TOP_RIGHT
		}
	},
	oMap = new naver.maps.Map(options.id, oMapOptions);

	naver.maps.Event.addListener(oMap, 'click', function(e) { // 지도 클릭시 해당 좌표에 마커 표시
		this.setMarker({
			target: this.PLACE_TARGET.CHOICE,
			coord: e.coord
		});
	}.bind(this));

	return oMap;
};

common.map.LotteChemMap.prototype.get = function() {

    return this.oMap;
};

common.map.LotteChemMap.prototype.getCoord = function(latitude, longitude) {

	return new naver.maps.LatLng(latitude || 37.5125701, longitude || 127.1025624); // 롯데케미칼본사
};

common.map.LotteChemMap.prototype.getDefaultZoom = function() {

	return 16;
};

common.map.LotteChemMap.prototype.getDepartureId = function() {

	return this.PLACE_TARGET.DEPARTURE;
};

common.map.LotteChemMap.prototype.getDestinationId = function() {

	return this.PLACE_TARGET.DESTINATION;
};

common.map.LotteChemMap.prototype.setMarker = function(o) {

	this.functionProvider.spinner(true);

	if (o.target !== this.PLACE_TARGET.CHOICE) {
		this.oPathPolyline1.setPath([]);
		this.oPathPolyline1.setMap();
		this.oPathPolyline2.setPath([]);
		this.oPathPolyline2.setMap();
	}

	var oMarker = this.mMarkerMap[o.target];
	if (!oMarker) { // 마커 객체가 없으면 생성, 생성 후에는 재사용
		oMarker = this.getMarker(o);
		this.mMarkerMap[o.target] = oMarker;
	}

	if (o.address) { // setPosition 이전에 custom-address를 변경해야함
		oMarker.set('custom-address', o.address);
	}
	oMarker.setPosition(o.coord); // position_changed event 발생
	oMarker.setMap(this.oMap);

	return this;
};

common.map.LotteChemMap.prototype.getMarker = function(o) {

	this.functionProvider.log('getMarker', o);

	var oMarker = new naver.maps.Marker({
		title: this.mPlaceTargetText[o.target], // + '\n마커를 드래그하여 옮길 수 있습니다.',
		icon: this.mPlaceMarkerIcon[o.target],
		// draggable: true,
		clickable: false
	});
	oMarker.set('custom-target', o.target);

	if (o.target !== this.PLACE_TARGET.CHOICE) {
		naver.maps.Event.addListener(oMarker, 'click', function() { // 마커 클릭시 주소 오버레이 토글
			var target = oMarker.get('custom-target'),
			oAddressOverlay = this.mAddressOverlayMap[target];
			if (oAddressOverlay.getMap()) {
				oAddressOverlay.setMap();
			} else {
				oAddressOverlay.setMap(this.oMap);
			}
		}.bind(this));
	}

	naver.maps.Event.addListener(oMarker, 'position_changed', function() { // 마커가 이동된 경우
		this.functionProvider.log('position_changed');

		this.functionProvider.spinner(true);

		var target = oMarker.get('custom-target'),
		address = oMarker.get('custom-address'),
		oAddressOverlay = this.mAddressOverlayMap[target];

		if (oAddressOverlay) {
			oAddressOverlay.setMap();
		}

		this.initPath(); // 경로찾기를 했었다면 해당 경로 초기화

		if (target !== this.PLACE_TARGET.CHOICE && address) {
			this.setAddressOverlay({ // 주소 오버레이 표시
				target: target,
				address: address
			});
			if (target !== this.PLACE_TARGET.CHOICE) {
				this.searchPath(); // 경로찾기 시작
			} else {
				this.functionProvider.spinner(false);
			}
		} else {
			this.searchAddress(target); // 주소가 없는 경우 주소부터 조회 후 주소 오버레이 표시
		}
	}.bind(this));

	return oMarker;
};

common.map.LotteChemMap.prototype.setAddressOverlay = function(o) {

	var oAddressOverlay = this.mAddressOverlayMap[o.target];
	if (!oAddressOverlay) {
		oAddressOverlay = new common.map.AddressOverlay({ position: this.mMarkerMap[o.target] });
		this.mAddressOverlayMap[o.target] = oAddressOverlay;
	}
	oAddressOverlay.setContent(this.getAddressOverlayContent.call(this, o));
	oAddressOverlay.draw();
	oAddressOverlay.setMap(this.oMap);

	return this;
};

common.map.LotteChemMap.prototype.getAddressOverlayContent = function(o) {

    if (!o || !o.address) {
		if (this.mAddressOverlayMap[o.target]) {
			this.mAddressOverlayMap[o.target].setMap();
		}
		if (this.mMarkerMap[o.target]) {
			this.mMarkerMap[o.target].setMap();
		}
		this.functionProvider.alert('Not found address data.');
		return;
    }
	if (!o.address.building) {
		if (this.mAddressOverlayMap[o.target]) {
			this.mAddressOverlayMap[o.target].setMap();
		}
		if (this.mMarkerMap[o.target]) {
			this.mMarkerMap[o.target].setMap();
		}
		this.functionProvider.alert('해당 지점에 사용가능한 적절한 지명이 없습니다.\n다시 선택해주세요.');
		return;
	}

	var address = o.address,
	htmlAddresses = [this.mPlaceTargetText[o.target]];

	if (o.target === this.PLACE_TARGET.CHOICE) {
		htmlAddresses.push(
			'<button type="button" class="lcc-map-button button-departure">출발</button>' +
			'<button type="button" class="lcc-map-button button-destination">도착</button>'
		);
	}
	if (address.roadAddress) {
		htmlAddresses.push('[도로명 주소] ' + address.roadAddress);
	}
    if (address.jibunAddress) {
        htmlAddresses.push('[지번 주소] ' + address.jibunAddress);
    }

    return [
        '<div style="min-width:200px;line-height:150%">',
        	htmlAddresses.join('<br />'),
        '</div>'
    ].join('\n');
};

common.map.LotteChemMap.prototype.setPlace = function(target) {

	return this.replaceMarker(target);
};

common.map.LotteChemMap.prototype.replaceMarker = function(target) { // 출발지, 도착지 마커 지정시

	this.functionProvider.spinner(true);

	var choice = this.PLACE_TARGET.CHOICE,
	oChoiceMarker = this.mMarkerMap[choice],
	oAddressOverlay = this.mAddressOverlayMap[choice];

	if (this.mMarkerMap[target]) {
		this.mMarkerMap[target].setMap(); // 기존 위치 마커 숨김
	}
	if (this.mAddressOverlayMap[target]) {
		this.mAddressOverlayMap[target].setMap(); // 기존 위치 주소 오버레이 숨김
	}

	if (oChoiceMarker) { // 출발/도착 선택용 마커인 경우
		oChoiceMarker.setIcon(this.mPlaceMarkerIcon[target]);

		var address = oChoiceMarker.get('custom-address');
		oAddressOverlay.setContent(this.getAddressOverlayContent({
			target: target,
			address: address
		}));
		oAddressOverlay.draw();
		this.functionProvider.setPlace(target, address);

		this.mMarkerMap[target] = oChoiceMarker;
		this.mAddressOverlayMap[target] = oAddressOverlay;

		this.mMarkerMap[choice] = null;
		this.mAddressOverlayMap[choice] = null;

		oChoiceMarker.set('custom-target', target);
	}

	this.oPathPolyline1.setPath([]);
	this.oPathPolyline1.setMap();
	this.oPathPolyline2.setPath([]);
	this.oPathPolyline2.setMap();

	this.searchPath(); // 경로찾기 시작

	return this;
};

// 주소 -> 좌표 : 사용하지 않으나 참고용으로 남겨둠
common.map.LotteChemMap.prototype.searchCoord = function(value) {

	var url = this.functionProvider.getURL('/geocode');

	return $.getJSON({
		// url: "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode",
		// url: "https://essproxyyzdueo754l.jp1.hana.ondemand.com/ESSProxy/geocode",
		url: url,
		data: {
			// coordinate: "",
			// filter: "",
			// page: "",
			// count: "",
			query: value
		},
		success: function() {
			this.functionProvider.log("searchCoord success", arguments);
		}.bind(this),
		error: function() {
			this.functionProvider.log("searchCoord error", arguments);
		}.bind(this),
		complete: function() {
			this.oDialog.setBusy(false);
		}.bind(this)
	}).promise();
};

// 지도에 선택된 지점의 좌표로 주소 조회
common.map.LotteChemMap.prototype.searchAddress = function(target) {

	var oMarker = this.mMarkerMap[target],
	coord = oMarker.getPosition();

	new Promise(function(resolve) {
		setTimeout(function() {
			naver.maps.Service.fromCoordToAddr({
				coords: coord,
				orders: [
					naver.maps.Service.OrderType.ROAD_ADDR,
					naver.maps.Service.OrderType.ADDR
				].join(',')
			}, function(status, response) {
				this.functionProvider.log('searchAddress', status, response);

				if (status === naver.maps.Service.Status.ERROR) {
					if (!coord) {
						this.functionProvider.alert('ReverseGeocode Error, Please check lonlat.');
						return;
					}
					if (coord.toString) {
						this.functionProvider.alert('ReverseGeocode Error, lonlat : ' + coord.toString());
						return;
					}
					if (coord.x && coord.y) {
						this.functionProvider.alert('ReverseGeocode Error, x : ' + coord.x + ', y : ' + coord.y);
						return;
					}
					this.functionProvider.alert('ReverseGeocode Error, Please check lonlat.');
					return;
				}

				response.v2.address.building = ((((response.v2.results || [])[0] || {}).land || {}).addition0 || {}).value || '';

				oMarker.set('custom-address', response.v2.address);

				this.setAddressOverlay({ // 조회된 주소로 주소 오버레이 표시
					target: target,
					address: response.v2.address
				});
				if (target !== this.PLACE_TARGET.CHOICE) {
					this.searchPath(); // 경로찾기 시작
				} else {
					this.functionProvider.spinner(false);
				}

				resolve();
			}.bind(this));
		}.bind(this), 0);
	}.bind(this));
};

// 지역 키워드 검색 : 입력된 지역명으로 해당 지역 주변의 키워드가 검색됨, 최대 5개의 키워드가 검색됨
common.map.LotteChemMap.prototype.searchLocal = function(o) {

	if (!o.keyword) {
		o.callback([]);
		return;
	}

	this.functionProvider.spinner(true);

	var url = this.functionProvider.getURL('/local');

	$.getJSON({
		// url: 'https://openapi.naver.com/v1/search/local',
		// url: 'https://essproxyyzdueo754l.jp1.hana.ondemand.com/ESSProxy/local',
		url: url,
		data: {
			query: o.keyword,
			display: 5
		},
		success: function(data) {
			this.functionProvider.log('searchLocal success', arguments);

			if (data.display) {
				if (o.target === this.PLACE_TARGET.CHOICE) {
					var place = data.items[0],
					title = typeof String.escapeHtml === 'function' ? String.escapeHtml(place.title) : (place.title || ''),
					coord = naver.maps.TransCoord.fromTM128ToLatLng(new naver.maps.Point(Number(place.mapx), Number(place.mapy)));

					this.oMap.panTo(coord);
					this.setMarker({
						title: title,
						address: {
							building: title,
							jibunAddress: place.address,
							roadAddress: place.roadAddress + ' ' + title
						},
						target: o.target,
						coord: coord
					});
				} else {
					o.callback($.map(data.items, function(place) {
						var title = typeof String.escapeHtml === 'function' ? String.escapeHtml(place.title) : (place.title || '');
						return {
							title: title,
							address: {
								building: title,
								jibunAddress: place.address,
								roadAddress: place.roadAddress + ' ' + title
							},
							target: o.target,
							coord: naver.maps.TransCoord.fromTM128ToLatLng(new naver.maps.Point(Number(place.mapx), Number(place.mapy)))
						};
					}));
				}
			} else {
				this.functionProvider.alert('검색 결과가 없습니다.');
				o.callback([]);

			}
		}.bind(this),
		error: function() {
			this.functionProvider.log('searchLocal error', arguments);
		}.bind(this),
		complete: function() {
			this.functionProvider.spinner(false);
		}.bind(this)
	});
};

common.map.LotteChemMap.prototype.searchPath = function() { // 경로 탐색, 거리, 톨비, 유류비

	var departurePosition = this.getMarkerPosition(this.getDepartureId()),
	destinationPosition = this.getMarkerPosition(this.getDestinationId());

	if (!departurePosition || !destinationPosition) {
		this.functionProvider.spinner(false);
		return;
	}

	var url = this.functionProvider.getURL('/driving'),
	pathSearchOptions = $.extend({
		start: departurePosition.toParamString(),
		goal: destinationPosition.toParamString(),
		// waypoints: '',
		// option: $('#option option:selected').val(),		// 탐색 옵션
		// cartype: $('#cartype option:selected').val(),	// 차종
		// fueltype: $('#fueltype option:selected').val(),	// 유종
		// mileage: Number($('#mileage').val() || 14),		// 연비
		lang: 'ko'
	}, this.functionProvider.getPathSearchOptions());

	$.getJSON({
		// url: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
		// url: 'https://essproxyyzdueo754l.jp1.hana.ondemand.com/ESSProxy/driving',
		url: url,
		data: pathSearchOptions,
		success: function(data) {
			this.functionProvider.log('searchPath success', arguments);

			if (data.code === 0) {
				var route = ((data.route || {}).traoptimal || [{}])[0],
				path = route.path || [],
				summary = route.summary || {};

				setTimeout(function() {
					this.renderPath(path);
					this.oMap.panToBounds(new naver.maps.LatLngBounds(summary.bbox[0], summary.bbox[1]));
				}.bind(this), 0);

				this.functionProvider.renderResultInformation({
					distance: ((summary.distance || 0) * 0.001).toFixed(),	// 거리
					tollFare: (summary.tollFare || 0).toLocaleString(),		// 톨비
					fuelPrice: (summary.fuelPrice || 0).toLocaleString()	// 유류비
				});
			} else {
				this.functionProvider.alert(data.message || '오류가 발생하였습니다.\n잠시 후 다시 시도해주세요.');
				this.functionProvider.renderResultInformation({
					distance: 0,	// 거리
					tollFare: 0,	// 톨비
					fuelPrice: 0	// 유류비
				});
			}
		}.bind(this),
		error: function() {
			this.functionProvider.log('searchPath error', arguments);
		}.bind(this),
		complete: function() {
			this.functionProvider.spinner(false);
		}.bind(this)
	});
};

common.map.LotteChemMap.prototype.renderPath = function(path) {

	this.oPathPolyline1.setPath(path);
	this.oPathPolyline2.setPath(path);

	this.oPathPolyline1.setMap(this.oMap);
	this.oPathPolyline2.setMap(this.oMap);

	return this;
};

common.map.LotteChemMap.prototype.initPath = function(initPosition) {

	this.oPathPolyline1.setPath([]);
	this.oPathPolyline1.setMap();
	this.oPathPolyline2.setPath([]);
	this.oPathPolyline2.setMap();

	if (initPosition) {
		this.panTo(this.getCoord());
	}

	return this;
};

common.map.LotteChemMap.prototype.removeMarker = function(target) {

	var oMarker = this.mMarkerMap[target];
	if (oMarker) {
		oMarker.setMap();
		delete this.mMarkerMap[target];
	}

	var oAddressOverlay = this.mAddressOverlayMap[target];
	if (oAddressOverlay) {
		oAddressOverlay.setMap();
		delete this.mAddressOverlayMap[target];
	}

	return this;
};

common.map.LotteChemMap.prototype.getMarkerPosition = function(target) {

	if (this.mMarkerMap[target]) {
		return this.mMarkerMap[target].getPosition();
	}
	return null;
};

common.map.LotteChemMap.prototype.panTo = function(coord) {

	this.oMap.setZoom(this.getDefaultZoom());
	this.oMap.panTo(coord);

	return this;
};