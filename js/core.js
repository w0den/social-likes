var SocialLikes = new function () {
	var config = {
		serverScript: 'http://localhost/social-likes/',
		countOnClick: true,
		url: {
			includePathname: true,
			includeQueryString: true
		}
	};

	var networks, wrapper, page;

	var tpl = new function () {
		var processors = {
			asis: function (v) {
				return v;
			},
			url: function (v) {
				return encodeURIComponent(v);
			}
		};

		function parse(proc, args) {
			var str = args[0],
				vars = (typeof args[1] === 'object') ? args[1] : args;

			return str.replace(/{%(\w+)}/g, function (m, i) {
				return processors[proc](vars[i]);
			});
		}

		this.str = function () {
			return parse('asis', arguments);
		};

		this.url = function () {
			return parse('url', arguments);
		};
	};

	function getMetaDescr() {
		var nodes = document.getElementsByTagName('meta');
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].getAttribute('name') === 'description') {
				return nodes[i].getAttribute('content');
			}
		}
		return '';
	}

	function getPageUrl() {
		var url = location.protocol + '//' + location.hostname;
		if (config.url.includePathname) {
			url += location.pathname;
		}

		if (config.url.includeQueryString) {
			url += location.search;
		}

		return url;
	}

	function getPageInfo() {
		if (!page) {
			page = {
				url: getPageUrl(),
				title: document.title,
				descr: getMetaDescr()
			};
		}
		return page;
	}

	function getNetwork(hash) {
		if (typeof networks !== 'object') {
			var p = getPageInfo();
			networks = {
				'#vkontakte': {
					url: tpl.url('http://vk.com/share.php?url={%url}&title={%title}&description={%descr}', p),
					width: 550,
					height: 420
				},
				'#odnoklassniki': {
					url: tpl.url('http://www.ok.ru/dk?st.cmd=addShare&st.s=1&st._surl={%url}&st.comments={%title}', p),
					width: 560,
					height: 370
				},
				'#moimir': {
					url: tpl.url('http://connect.mail.ru/share?url={%url}&title={%title}&description={%descr}', p),
					width: 560,
					height: 400
				},
				'#gplus': {
					url: tpl.url('http://plus.google.com/share?url={%url}', p),
					width: 560,
					height: 370
				},
				'#facebook': {
					url: tpl.url('http://www.facebook.com/sharer/sharer.php?src=sp&u={%url}&t={%title}&description={%descr}&picture&ret=login', p),
					width: 800,
					height: 520
				},
				'#twitter': {
					url: tpl.url('http://twitter.com/intent/tweet?status={%title} → {%url}', p),
					width: 650,
					height: 520
				}
			};
		}

		return networks[hash] || {};
	}

	function openPopup(node) {
		var cfg = getNetwork(node.hash);
		cfg.left = (screen.width - cfg.width) / 2;
		cfg.top = (screen.height - cfg.height) / 2;

		var params = tpl.str('scrollbars=1,resizable=1,menubar=0,toolbar=0,status=0,left={%left},top={%top},width={%width},height={%height}', cfg),
			popup = window.open(cfg.url, 'SocialLikes', params);

		if (popup) {
			if (config.countOnClick) {
				node.innerHTML = (parseInt(node.innerHTML) || 0) + 1;
			}
			popup.focus();
		} else {
			location.href = cfg.url;
		}
	}

	function stylizeWrapper() {
		var styl = document.createElement('style');
		styl.innerHTML = '#social-likes{text-align:center;white-space:nowrap}'
			+ '#social-likes a{vertical-align:middle;margin:1px;color:#fff;text-decoration:none;font:11px/19px Arial;display:inline-block;height:18px;padding:0 4px 0 15px;border-radius:2px;box-shadow:0 0 2px #777;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAADoCAMAAADVGUQaAAAA21BMVEUAAAD/////////////////////zqf/////////////////////////////////////////////////////////////////////////////////////n03/8eb/n03/////////n03/////n03/////////////////////////////////////////n03/n03/////////n03/n03/n03/n03/n03/n03/////n03/n03/n03/n03/n03/n03/n03/n03/n03/n03/////n03/n03/n03/////n03YGwfrAAAAR3RSTlMARCPi9OcE3s2X7HYTu6qHUNevXCoZ/PmjkXlqKAHsyrVjDJCEf2RUPjczLh8I9sjEcPvf0cOzr4qISyGoejcOn1lRRkU+Mg9zpMoAAAKuSURBVHja7dTHcqNAFIXhQ5MRYCQUrZyTlZzz5Dm8/xONpAK76eW4PIsp/SvVp75IVX0LfDS/7jhOJUcB913IYlVp7iaDHJEulMgzFSg9SyV18FPp1Ed6HV5vhq8SfLlLNg/Dq+TZysS66fxufftpPa5v2yn1k1b/8qpzfdtPvqd0/fw7+Qnra9K6vUvpsj+8AfC0br10Ulr3H4502XrI6OaulTwefra1eU7pe/LrsXPV2XRuk19I+5r0W4+vX16uXvDWw+V6c71+gtxTfzj8ZuHUJycKhxYyaTw2zVNh6jHIkwaHbp4ch7avUOAxVAen5EKhCakpg6QN9X+FAqf+cZUV9omSfTabpzTuDoC2zX2jlGKaTV8cxBMplU2yph9oi7Qps+rIcqspRcj6kUoR7030g9SWyCpHI4OkPsdbS9f27F5zgFOfXrlkmqWyLBWT1SrNikQ7BhcXAXcSuWwCTboSxSxGUZGxRFbAfYElkS+aYdgUvkS2OYrjkWlLVM/WS2quH9dErsF9DVnOaGiawTP5kK4Bmt7AqQ9GHNO63Gf0Cu/E4nLhsKZBoiXgm7RBHsu+GZMD6ZQAEJEViVwABW4hEQuDsmHIe1rQadAUkBuILptQ6rG7ykG7ck52K7kjnmMwt/MclVfCJUvvpOHQyAvaOHVssS35vpsjl4wvmKPIMIWo5kjMFpETSmCVSNbqvkSxPR/ryNUY41yhexcqLWuNnkI4N7oq9Vx1sFwVKtVLUMg3ZtgVcerva0/qjre9r7yL2NIO6w69KJNVsbZrA5jWDJFdNQsQUfvwIUyp6FnLKmfAjHo6xwDn5BzQWGvjmGmjQMMCxswuLuRiwh6AgKWU/O4PlyEgDM6QZqFIrxnb8mvApxeS1YYlbThDlLUBpMacQKnhrVSaxviP+wOz6XAEgDj09AAAAABJRU5ErkJggg==) no-repeat}'
			+ '#social-likes a:hover{box-shadow:0 0 3px #333}'
			+ '#social-likes #social-likes-vkontakte{background-color:#54769A;background-position:0 -58px}'
			+ '#social-likes #social-likes-vkontakte:hover{background-color:#384F67}'
			+ '#social-likes #social-likes-odnoklassniki{background-color:#F2720C;background-position:0 -116px}'
			+ '#social-likes #social-likes-odnoklassniki:hover{background-color:#BF5A09}'
			+ '#social-likes #social-likes-moimir{background-color:#168DE2;background-position:0 -29px}'
			+ '#social-likes #social-likes-moimir:hover{background-color:#116DAF}'
			+ '#social-likes #social-likes-gplus{background-color:#DD4B39;background-position:0 -145px}'
			+ '#social-likes #social-likes-gplus:hover{background-color:#AA3A2C}'
			+ '#social-likes #social-likes-facebook{background-color:#4862A3;background-position:0 0}'
			+ '#social-likes #social-likes-facebook:hover{background-color:#314370}'
			+ '#social-likes #social-likes-twitter{background-color:#00ACED;background-position:0 -87px}'
			+ '#social-likes #social-likes-twitter:hover{background-color:#0087BA}';

		styl.type = 'text/css';
		document.body.appendChild(styl);
	}

	function handleLinks() {
		var links = wrapper.getElementsByTagName('a');
		for (var i = 0; i < links.length; i++) {
			links[i].onclick = function () {
				openPopup(this);
				return false;
			};
		}
	}

	function getLikes() {
		var js = document.createElement('script');
		js.src = config.serverScript + '?url=' + encodeURIComponent(getPageUrl());
		js.type = 'text/javascript';
		document.body.appendChild(js);
	}

	this.count = function (result) {
		for (var network in result) {
			if (result[network] > 0) {
				var link = document.getElementById('social-likes-' + network);
				if (link) {
					link.innerHTML = result[network];
				}
			}
		}
	};

	wrapper = document.getElementById('social-likes');
	if (wrapper) {
		stylizeWrapper();
		handleLinks();
		getLikes();
	}
};