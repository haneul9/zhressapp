/* global Cookies */
function HomeMobileNoticeModal(o) {

	if (o && o.os !== 'aos') {
		//return;
	}
	return;

	this.options = o;

	this.init();
}

$.extend(HomeMobileNoticeModal.prototype, {

isSuppressed: function() {

	return Cookies.get('ehr.mobile.notice.modal.${os}.suppress'.interpolate(this.options.os)) === 'Y';
	// return localStorage.getItem('ehr.home.popup.suppress') === 'Y';
},

setSuppress: function() {

	Cookies.set('ehr.mobile.notice.modal.${os}.suppress'.interpolate(this.options.os), 'Y', { expires: new Date(2100, 0, 1, 0, 0, 0) });
	// localStorage.setItem('ehr.home.popup.suppress', 'Y');
},

init: function() {

	if (this.isSuppressed()) {
		return;
	}

	$(this.ui()).appendTo('body')
		// .on('click', '.fn-url-copy', function() {
		// 	navigator.clipboard.writeText('https://mdm.lottechem.com/')
		// 		.then(function() {
		// 			$('#mobile-notice-modal .valid-feedback').show();
		// 		});
		// })
		.on('hidden.bs.modal', function() {

			if ($('#mobile-notice-modal-suppress-reopen').prop('checked')) {
				this.setSuppress();
			}

			$('#mobile-notice-modal').modal('dispose').remove();
		}.bind(this))
		.modal();
},

ui: function() {

	return [  
		'<div class="modal fade mobile-notice-modal" style="display:none" aria-hidden="true" data-backdrop="static" tabindex="-1" role="dialog" id="mobile-notice-modal">',
			'<div class="modal-dialog" role="document">',
				'<div class="modal-content">',
					'<div class="modal-header">',
						'<h4 class="modal-title">모바일 앱 업데이트 알림</h4>',
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
					'</div>',
					'<div class="modal-body">',
						// '<div class="text-center"><img src="images/img-android-setting2.png" /></div>',
						'<ol>',
							'<li>',
								'업데이트 내용',
								'<ul>',
									'<li>신청 메뉴에서 사진촬영하여 즉시 첨부 가능</li>',
									'<li>Hi 톡톡 좋아요 기능 개선</li>',
								'</ul>',
							'</li>',
							'<li>',
								'업데이트 방법',
								'<ul>',
									'<li>크롬 브라우저에 아래 URL을 입력 후,<br />설치파일 다운로드하여 재설치</li>',
								'</ul>',
							'</li>',
						'</ol>',
						'<div class="mt-3 text-center">',
							'https://mdm.lottechem.com',
							// '<button type="button" class="btn btn-sm btn-outline-primary fn-url-copy" style="margin-left:22px; height:24px; padding:0 14px">복사</button>',
						'</div>',
						// '<div class="valid-feedback mt-3 text-center" style="font-size:100%">',
						// 	'URL 주소가 복사되었습니다. 복사한 주소를 웹브라우저에 붙여넣기 하세요.',
						// '</div>',
					'</div>',
					'<div class="modal-footer justify-content-between">',
						'<div class="form-check">',
							'<input class="form-check-input" type="checkbox" id="mobile-notice-modal-suppress-reopen" style="width:1.3rem; height:1.3rem; margin-top:.1rem" />',
							'<label class="form-check-label" for="mobile-notice-modal-suppress-reopen" style="margin-left:.5rem">다시 열지 않기</label>',
						'</div >',
						'<button type="button" class="btn btn-primary" data-dismiss="modal">닫기</button>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join('');
}

});