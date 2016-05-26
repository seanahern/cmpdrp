
;(function($, window, document, undefined) {

	"use strict";

	var BLANK_STATE = 1,
		IMG_STATE = 2,

		_currentState = BLANK_STATE,
		_isFirstTime = true,
		_isBlocked = false,
		_currentView = 0,
		_currentLoad = 0,
		_overlay = null,
		_setStartIndex = 0,
		_files = [],
		_hideNavTimeout = null,

		$views = null,
		$nav = null,
		$dropZone = null,
		$filepicker = null,
		$index = null,
		$help = null,
		$blocker = null,
		$fileList = null,
		$fileThumbs = null;

	
	var onDragOver = function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	};

	var onDrop = function(e) {

		e.stopPropagation();
		e.preventDefault();

		var fileList = e.dataTransfer.files, // FileList object.
			i = fileList.length,
			file = null,
			newFiles = [];

		// do a little dance to sort by file name -----

		while (i--) {

			file = fileList[i];
			
			// dont add non-image files - should be more robust validation...
			if (file.type.toLowerCase().indexOf('image/') < 0) {
				continue;
			}

			newFiles.push(file);

		}

		newFiles.sort(function(a, b) {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});

		//console.log('new files', newFiles);

		if (newFiles.length === 0) {
			return;
		}

		_files = _files.concat(newFiles);
		_updateFileCountDisplay(_files.length);
		
		//console.log('all files', _files);

		_setStartIndex = _currentLoad;
		loadNextFile();

	};

	var _updateFileCountDisplay = function(count) {
		$index.find('.hd .count').text('(' + count + ')');
	};

	var loadNextFile = function() {

		var thisLoadIndex = _currentLoad,
			file = _files[thisLoadIndex],
			listItem,
			reader = new FileReader();

		_currentLoad++;

		//console.log(file);

		listItem = '<li><a href="#" data-index="' + thisLoadIndex + '">' + file.name + '</a></li>';
		$fileList.find('.filenames').append(listItem);

		// --

		reader.onload = (function(f) {

			return function(e) {

				//console.log('reader onload', this, e.target);

				var view = $('<div class="view" data-index="' + thisLoadIndex + '"></div>'),
					img = $('<img />');

				$views.append(view);

				img.on('load', function(e) {
					//console.log('img load', this, e);

					var w = this.width,
						h = this.height;

					makeThumb(this, f.name, thisLoadIndex, w, h);

					$(this).css({
						'margin-left': '-' + Math.round(w/2) + 'px'
					});

				});

				view.append(img);
				img.attr('src', e.target.result);

				// hide start screen
				if (_isFirstTime) {
					_isFirstTime = false;
					setState(IMG_STATE);
				}

				// show first image of file set
				if (thisLoadIndex === _setStartIndex) {
					updateView(thisLoadIndex);
				}

				// load next file
				if (_currentLoad < _files.length) {
					loadNextFile();
				} else {
					// done loading current file set
				}

			};

		})(file);

		reader.readAsDataURL(file);

	};

	var makeThumb = function(img, fileName, fileIndex, srcW, srcH) {

		var canvas = $('<canvas width="100" height="100" class="thumb" title="' + fileName + '" data-index="' + fileIndex + '"></canvas>');

		var drawW,
			drawH,
			drawX,
			drawY;

		//console.log('src', srcW, srcH);

		if (srcW > srcH) {
			drawW = 100;
			drawH = (srcH / srcW) * drawW;
			drawX = 0;
			drawY = (100 - drawH)/2;
		} else {
			drawH = 100;
			drawW = (srcW / srcH) * drawH;
			drawX = (100 - drawW)/2;
			drawY = 0;
		}

		//console.log('draw', drawX, drawY, drawW, drawH);

		var context = canvas.get(0).getContext('2d');
		context.drawImage(img, drawX, drawY, drawW, drawH);

		$fileThumbs.append(canvas);

	};

	var addAdvanceClickListener = function() {

		$(document.body).on('click', function(e) {
			showNextView();
		});

	};

	var removeAdvanceClickListener = function() {
		$(document.body).off('click');
	};

	var getCurrentView = function() {

		$views.find('.view').each(function(i, el) {
			if ($(el).is(":visible")) {
				_currentView = i;
			}
		});

		return _currentView;

	};

	var showNextView = function() {

		var nextView = getCurrentView() + 1;

		if (nextView > $views.children().length - 1) {
			nextView = 0;
		}

		updateView(nextView);

	};

	var showPreviousView = function() {

		var prevView = getCurrentView() - 1;

		if (prevView < 0) {
			prevView = $views.children().length - 1;
		}

		updateView(prevView);

	};

	var updateView = function(i) {

		$views.children().hide();
		$views.children().eq(i).show();

		$fileList.find('ul').children().removeClass('selected');
		$fileList.find('ul').children().eq(i).addClass('selected');

		$fileThumbs.children().removeClass('selected');
		$fileThumbs.children().eq(i).addClass('selected');

		// scroll to top for new image?
		$(window).scrollTop(0);

	};

	var toggleIndex = function() {
		
		if ($index.hasClass('is-open')) {
			closeOverlay();
		} else {
			showIndex();
		}

	};

	var toggleHelp = function() {
		
		if ($help.hasClass('is-open')) {
			closeOverlay();
		} else {
			showHelp();
		}

	};

	var showIndex = function() {
		showOverlay($index);
	};

	var showHelp = function() {
		showOverlay($help);
	};

	var showOverlay = function(overlay) {

		closeOverlay();
		showBlocker();

		_overlay = overlay;
		_overlay.addClass('is-open');

		if (_currentState === IMG_STATE) {
			$(document.body).css('overflow', 'hidden');
			removeAdvanceClickListener();
			stopHideNavTimer();
		}

	};

	var closeOverlay = function() {

		if (_overlay !== null) {

			hideBlocker();
			_overlay.removeClass('is-open');
			_overlay = null;

			if (_currentState === IMG_STATE) {
				$(document.body).css('overflow', 'auto');
				addAdvanceClickListener();
				startHideNavTimer();
			}

		}

	};

	var reset = function() {

		_isFirstTime = true;
		_currentView = 0;
		_currentLoad = 0;
		_files = [];

		setState(BLANK_STATE);

	};

	var showIndexListView = function() {
		$fileList.show();
		$fileThumbs.hide();
	};

	var showIndexThumbsView = function() {
		$fileList.hide();
		$fileThumbs.show();
	};

	var showDropZone = function() {
		$dropZone.show();
	};

	var hideDropZone = function() {
		$dropZone.hide();
	};

	var showImgs = function() {
		$views.show();
	};

	var hideImgs = function() {
		$views.hide();
	};

	var showBlocker = function() {
		$blocker.show();
	};

	var hideBlocker = function() {
		$blocker.hide();
	};

	var showImgNav = function() {
		$('.btn-index').show();
		$('.btn-next').show();
		$('.btn-prev').show();
	};

	var hideImgNav = function() {
		$('.btn-index').hide();
		$('.btn-next').hide();
		$('.btn-prev').hide();
	};

	var setState = function(state) {

		if (state === _currentState) {
			return;
		}

		_currentState = state;

		switch (_currentState) {

			case BLANK_STATE:

				hideBlocker();
				hideImgs();
				closeOverlay();
				showDropZone();
				hideImgNav();
				showAllNav();
				removeAdvanceClickListener();
				stopHideNavTimer();
				_updateFileCountDisplay(0);

				$fileList.find('.filenames').empty();
				$fileThumbs.empty();
				$views.empty();

				break;

			case IMG_STATE:
				
				hideDropZone();
				closeOverlay();
				showImgs();
				showImgNav();
				showAllNav();
				addAdvanceClickListener();
				startHideNavTimer();

				break;

		}

	};

	var startHideNavTimer = function() {
		$(document.body).on('mousemove', userActivity);
		$(document.body).on('mousedown', userActivity);
		$(document.body).on('mouseleave', mouseLeave);
		resetHideNavTimer();
	};

	var stopHideNavTimer = function() {
		$(document.body).off('mousemove', userActivity);
		$(document.body).off('mousedown', userActivity);
		$(document.body).off('mouseleave', mouseLeave);
		clearHideNavTimer();
	};

	var mouseLeave = function() {
		hideAllNav();
	};

	var userActivity = function() {

		if (!$nav.is(':visible')) {
			$nav.stop();
			showAllNav();
		}

		resetHideNavTimer();

	};

	var resetHideNavTimer = function() {
		clearHideNavTimer();
		_hideNavTimeout = setTimeout(hideAllNav, 3000);
	};

	var clearHideNavTimer = function() {
		if (_hideNavTimeout !== null) {
			clearTimeout(_hideNavTimeout);
			_hideNavTimeout = null;
		}
	};

	var hideAllNav = function() {
		clearHideNavTimer();
		$nav.fadeOut(500);
	};

	var showAllNav = function() {
		$nav.show();
	};


	$(document).ready(function() {

		// get page elements ---

		$dropZone = $('.drop-zone');
		$filepicker = $('#filepicker');
		$nav = $('.nav');
		$views = $('.views');
		$index = $('.index');
		$help = $('.help');
		$blocker = $('.blocker');
		$fileList = $index.find('.list');
		$fileThumbs = $index.find('.thumbs');

		hideImgNav();

		$nav.find('.btn-help').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			showHelp();
		});

		$blocker.on('mousedown', function(e) {
			closeOverlay();
		});

		// test for apis -----

		if (window.File && window.FileReader && window.FileList) {
			//console.log('File, FileReader and FileList available');
		} else {
			$nav.addClass('fallback');
			$dropZone.find('.msg').text('Sorry, your browser does not support local file access');
			$dropZone.find('.sub').html('Try <a href="http://www.google.com/chrome">Google Chrome</a> or <a href="http://www.mozilla.org/firefox">Firefox</a>');
			return;
		}

		// add drop lsitener ----

		document.body.addEventListener('dragover', onDragOver, false);
		document.body.addEventListener('drop', onDrop, false);


		// set up index click listener ---

		$index.on('click', 'a, canvas', function(e) {
			e.preventDefault();
			e.stopPropagation();
			updateView($(this).data('index'));
			closeOverlay();
		});


		// set up nav buttons ---

		$nav.find('.btn-next').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			showNextView();
		});

		$nav.find('.btn-prev').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			showPreviousView();
		});

		$nav.find('.btn-index').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			showIndex();
		});

		$index.find('.btn-list').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			showIndexListView();
		});

		$index.find('.btn-thumbs').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			showIndexThumbsView();
		});

		$dropZone.click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			$("#filepicker").trigger("click");
		});

		$filepicker.on('change', function(fileData) {
			var reader = new FileReader();
			reader.onload = (function (theFile) {
				return function (e) {
					console.log(e);
				};
			})(fileData);
			reader.readAsDataURL(fileData);
		});
		
		// set up key commands ---

		$(document).on('keydown', function(e) {

			//console.log('key', e.which);

			var len = $views.children().length;

			if (e.shiftKey && e.which === 191) { // ? key
				//e.preventDefault();
				//e.stopPropagation();
				toggleHelp();
				return;
			}

			if (e.which === 13) { // enter key
				//e.preventDefault();
				//e.stopPropagation();
				if ($index.hasClass('is-open')) {
					closeOverlay();
				}
				return;
			}

			if (e.which === 27) { // escape key
				if (_overlay) {
					e.preventDefault();
					e.stopPropagation();
					closeOverlay();
				}
				return;
			}

			// no images in the queue...
			if (len < 1) return;

			if (e.which === 73) { // i key
				toggleIndex();
				return;
			}

			if (e.which === 82) { // r key
				reset();
				return;
			}

			if (e.which === 84) { // t key

				if ($index.hasClass('is-open')) {
					
					if ($fileThumbs.is(':visible')) {
						showIndexListView();
					} else {
						showIndexThumbsView();
					}

				}

				return;
			}

			// only one image in the queue...
			if (len < 2) return;

			if (e.which === 74 || e.which === 37) { // j key
				//e.preventDefault();
				//e.stopPropagation();
				showPreviousView();
				return;
			}

			if (e.which === 75 || e.which === 39) { // k key
				//e.preventDefault();
				//e.stopPropagation();
				showNextView();
				return;
			}

		});

	});


}(jQuery, window, document));

