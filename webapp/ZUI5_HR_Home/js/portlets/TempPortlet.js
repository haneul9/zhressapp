/* global AbstractPortlet */
function TempPortlet() {
	AbstractPortlet.apply(this, arguments);
}

TempPortlet.prototype = Object.create(AbstractPortlet.prototype);
TempPortlet.prototype.constructor = TempPortlet;

$.extend(TempPortlet.prototype, {

ui: function() {

	return [
		'<div class="card portlet portlet-${size}h" data-key="${key}"${tooltip}>'.interpolate(this.size(), this.key(), this.tooltip()),
			'<div class="card-header">',
				'<h6>${title}</h6>'.interpolate(this.title()),
				'<div>',
					this.dismissButton(),
					this.link(true),
				'</div>',
			'</div>',
			'<div class="card-body">${content}</div>'.interpolate(this._o.content),
			this.spinner(),
		'</div>'
	].join('');
},
fill: function() {

	return new Promise(function(resolve) {
		$('[data-key="${key}"].portlet'.interpolate(this.key()))
			.find('.card-body').html([
				'<h5 class="card-title">${title}</h5>'.interpolate(this.title())
			].join(''));

		this.spinner(false);
		resolve();
	}.bind(this));
/*
	var url = this.odataUrl();

	return this._gateway.post({
		url: url,
		data: {
			IMode: 'R',
			IConType: '1',
			IPernr: this._gateway.pernr(),
			ILangu: this._gateway.loginInfo('Langu'),
			TableIn1: []
		},
		success: function(data) {
			this._gateway.prepareLog('TempPortlet.fill ${url} success'.interpolate(url), arguments).log();

			// var TableIn1 = this._gateway.odataResults(data).TableIn1[0] || {};
			$('[data-key="${key}"].portlet'.interpolate(this.key()))
				.find('.card-body').html([
					'<h5 class="card-title">${title}</h5>'.interpolate(this.title()),
					'<p class="card-text">${content}</p>'.interpolate(this._o.content)
				].join(''));
		}.bind(this),
		error: function(jqXHR) {
			this._gateway.handleError(this._gateway.ODataDestination.S4HANA, jqXHR, 'TempPortlet.fill ' + url);
		}.bind(this),
		complete: function() {
			this.spinner(false);
		}.bind(this)
	});
*/
},
changeLocale: function() {

	this.spinner(true);
	this.fill();
}

});/*

window._samplePortletData = [
	{
		"Potnm": "Portlet 1,3",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "1,3",
		"Colno": null,
		"Seqno": null,
		"Htall": 3,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 1,3"
	},
	{
		"Potnm": "개인정보",
		"Potid": "P101",
		"Colno": "1",
		"Seqno": "01",
		"Htall": "2",
		"Zhide": "",
		"Fixed": "X",
		"HideName": "X",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "X",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "개인정보_tooltip_Person Info"
	},
	{
		"Potnm": "Portlet 1,2",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "1,2",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 1,2"
	},
	{
		"Colno": "2",
		"Fixed": "",
		"HideName": "",
		"Htall": "2",
		"Zhide": "",
		"IOdkey": "",
		"Iconid": "far fa-comment-dots",
		"LinkMenid1": "6F10",
		"LinkMenid2": "",
		"LinkUrl1": "Suggestions.html",
		"LinkUrl2": "",
		"MSeq": "02",
		"Mepop": "X",
		"Mocat": "B",
		"Odataid": "MainContents",
		"Potid": "P102",
		"Potnm": "공지사항",
		"Seqno": "01",
		"TooltipTx": "공지사항_tooltip_Notice"
	},
	{
		"Colno": "2",
		"Fixed": "",
		"HideName": "",
		"Htall": "1",
		"Zhide": "",
		"IOdkey": "",
		"Iconid": "fas fa-directions",
		"LinkMenid1": "6F10",
		"LinkMenid2": "",
		"LinkUrl1": "Suggestions.html",
		"LinkUrl2": "",
		"MSeq": "00",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"Potid": "P103",
		"Potnm": "바로가기",
		"Seqno": "02",
		"TooltipTx": "바로가기_tooltip_Quick Link"
	},
	{
		"Potnm": "Portlet 2,3",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,3",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,3"
	},
	{
		"Potnm": "Portlet 2,4",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,4",
		"Colno": 2,
		"Seqno": 2,
		"Htall": 1,
		"Zhide": "",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,4"
	},
	{
		"Potnm": "Portlet 2,5",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,5",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,5"
	},
	{
		"Potnm": "Portlet 2,6",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,6",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,6"
	},
	{
		"Potnm": "Portlet 2,7",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,7",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,7"
	},
	{
		"Potnm": "Portlet 2,8",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,8",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,8"
	},
	{
		"Potnm": "Portlet 2,9",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,9",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,9"
	},
	{
		"Potnm": "Portlet 2,10",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,10",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,10"
	},
	{
		"Potnm": "Portlet 2,11",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,11",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,11"
	},
	{
		"Potnm": "Portlet 2,12",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,12",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,12"
	},
	{
		"Potnm": "Portlet 2,13",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,13",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,13"
	},
	{
		"Potnm": "Portlet 2,14",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,14",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,14"
	},
	{
		"Potnm": "Portlet 2,15",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,15",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,15"
	},
	{
		"Potnm": "Portlet 2,16",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,16",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,16"
	},
	{
		"Potnm": "Portlet 2,17",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,17",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,17"
	},
	{
		"Potnm": "Portlet 2,18",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "2,18",
		"Colno": null,
		"Seqno": null,
		"Htall": 1,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 2,18"
	},
	{
		"Potnm": "Portlet 3,3",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "3,1",
		"Colno": null,
		"Seqno": null,
		"Htall": 2,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 3,3"
	},
	{
		"Potnm": "Portlet 3,2",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "3,2",
		"Colno": 3,
		"Seqno": 1,
		"Htall": 4,
		"Zhide": "",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 3,2"
	},
	{
		"Potnm": "Portlet 3,1",
		"content": "Some quick example text to build on the card title and make up the bulk of the card's content.",
		"Potid": "3,3",
		"Colno": null,
		"Seqno": null,
		"Htall": 6,
		"Zhide": "X",
		"Fixed": "",
		"HideName": "",
		"Iconid": "fas fa-user",
		"LinkMenid1": "6E10",
		"LinkMenid2": "",
		"LinkUrl1": "OpenHelpRoomESS.html",
		"LinkUrl2": "",
		"Mepop": "",
		"Mocat": "",
		"Odataid": "MainContents",
		"TooltipTx": "Portlet 3,1"
	}
];*/