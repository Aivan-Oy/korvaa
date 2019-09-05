(function() {
	var materialSection, nav, trackerFunction, mode;
	
	function init() {
		document.body.classList.remove('no-js');
		document.body.classList.add('js');
		mode = 'stepper'; //scroller
		document.body.classList.add(mode);
		materialSection = document.querySelector('.materials');
		nav = document.querySelector('.bookmarks');
		sizeInit()
		if( mode == 'stepper' ) {
			stepperize(materialSection);
		}
		window.addEventListener('resize', sizeInit, true); 
		nav.addEventListener('click', navClicks);
	}
	
	function sizeInit() {
		if( window.innerWidth > 16*50 ) {
			console.info('Large init.');
			if( mode == 'stepper' ) {
				materialSection.classList.add('stepper');
			} else {
				trackPlacement(materialSection);
			}	
		} else {
			console.info('Small init.');
			if( mode == 'stepper' ) {
				var stepper = document.querySelector('.stepper');
				if( stepper ) {
					stepper.classList.remove('stepper');
				}
			} else {
				window.cancelAnimationFrame(trackerFunction);
			}
		}
	}
	
	function trackPlacement(e) {
		trackerFunction = window.requestAnimationFrame(tracker);
	}
	
	function tracker() {
		var placement = getPlacement(materialSection);
		if( placement.scrollTop < placement.offsetTop ) {
			materialSection.classList.remove('inside');
		} else if( placement.scrollTop > placement.offsetTop ) {
			materialSection.classList.add('inside');
			materialSection.classList.remove('outside');
		}
		if( placement.scrollBottom > placement.offsetBottom ) {
			materialSection.classList.remove('inside');
			materialSection.classList.add('outside');
		}
		trackerFunction = window.requestAnimationFrame(tracker);
	}
	
	function getPlacement(e) {
		var info = {
			scrollTop: document.body.scrollTop,
			scrollBottom: document.body.scrollTop + window.innerHeight,
			offsetTop: e.offsetTop,
			offsetBottom: e.offsetTop + e.offsetHeight,
		};
		return info;
	}
	
	function navClicks(e) {
		if( e.target.tagName == 'A' ) {
			nav.querySelector('.current').classList.remove('current');
			materialSection.querySelector('.current').classList.remove('current');
			e.target.parentNode.classList.add('current');
			console.log(e.target.hash);
			materialSection.querySelector(e.target.hash).classList.add('current');
			e.preventDefault();
		}
	}
	
	function stepperize(section) {
		section.classList.add('stepper');
		var buttons = document.createElement('nav');
		buttons.classList.add('directional');
		var prev = document.createElement('button');
		var next = document.createElement('button');
		prev.classList.add('prev');
		next.classList.add('next');
		prev.textContent = 'Previous';
		next.textContent = 'Next';
		buttons.appendChild(prev);
		buttons.appendChild(next);
		section.appendChild(buttons);
		
		
		nav.children[0].classList.add('current');
		var content = section.querySelector('.materials-list');
		content.children[0].classList.add('current');
		
		buttons.addEventListener('click', stepper);
	}
	
	function stepper(e) {
		console.log(e);
		var t = e.target;
		if( t.tagName == 'BUTTON' ) {
			var direction = 0;
			if( t.classList.contains('next') ) {
				direction = 1;
			} else if( t.classList.contains('prev') ) {
				direction = -1;
			}
			if( direction != 0 ) {
				console.log(direction);
				var current = materialSection.querySelector('.materials-list .current');
				var navCurrent = materialSection.querySelector('.bookmarks .current');
				current.classList.remove('current');
				navCurrent.classList.remove('current');
				var newItem;
				var newNavItem;
				if( direction > 0 ) {
					newItem = current.nextElementSibling;
					newNavItem = navCurrent.nextElementSibling;
				} else {
					newItem = current.previousElementSibling;
					newNavItem = navCurrent.previousElementSibling;
				}
				if( ! newItem ) {
					if( direction > 0 ) {
						newItem = current.parentNode.children[0];
						newNavItem = navCurrent.parentNode.children[0];
					} else {
						newItem = current.parentNode.lastElementChild;
						newNavItem = navCurrent.parentNode.lastElementChild;
					}
				}
				if( newItem && newNavItem ) {
					newItem.classList.add('current');
					newNavItem.classList.add('current');
					window.location.hash = newNavItem.firstElementChild.href;
				}
			}
		}
	}
	init();
})();