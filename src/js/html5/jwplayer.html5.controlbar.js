/*jshint maxparams:5*/
(function(window, document, undefined) {
    var jwplayer = window.jwplayer,
        html5 = jwplayer.html5,
        utils = jwplayer.utils,
        _     = jwplayer._,
        events = jwplayer.events,
        states = events.state,
        _css = utils.css,
        _setTransition = utils.transitionStyle,
        _isMobile = utils.isMobile(),
        _nonChromeAndroid = utils.isAndroid(4, true),
        _iFramed = (window.top !== window.self),

        /** Controlbar element types * */
        CB_BUTTON = 'button',
        CB_TEXT = 'text',
        CB_DIVIDER = 'divider',
        CB_SLIDER = 'slider',

        JW_VISIBILITY_TIMEOUT = 250,

        HIDDEN = {
            display: 'none'
        },
        SHOWING = {
            display: 'block'
        },
        NOT_HIDDEN = {
            display: ''
        };

    function _removeFromArray(array, item) {
        var index = _.indexOf(array, item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    function _addOnceToArray(array, item) {
        var index = _.indexOf(array, item);
        if (index === -1) {
            array.push(item);
        }
    }

    function _createElementId(_id, name) {
        return _id + '_' + name;
    }

    function _elementSize(skinElem) {
        return skinElem ? parseInt(skinElem.width, 10) + 'px ' + parseInt(skinElem.height, 10) + 'px' : '0 0';
    }


    /** HTML5 Controlbar class * */
  var isset;
    var isnext;
    html5.controlbar = function(_api, _config,_isset,_isnext) {
        _config = _config || {};
 if(_isnext==undefined||_isnext==null){
        _isnext=true;
       }
        isset=_isset;
        isnext=_isnext;

        if(isset==true){
        var _skin,
            _dividerElement = _layoutElement('divider', CB_DIVIDER),
            _defaults = {
                margin: 8,
                maxwidth: 2800,
                font: 'Microsoft YaHei,Arial,sans-serif',
                fontsize: 12,
                fontcolor: parseInt('eeeeee', 16),
                fontweight: 'bold',
                layout: {
                    left: {
                        position: 'left',
                        elements: [
                            _layoutElement('play', CB_BUTTON),

                            _layoutElement('elapsed', CB_TEXT)
                        ]
                    },
                    center: {
                        position: 'center',
                        elements: [
                            _layoutElement('time', CB_SLIDER),
                            _layoutElement('alt', CB_TEXT)
                        ]
                    },
                    right: {
                        position: 'right',
                        elements: [
                            _layoutElement('duration', CB_TEXT),
  
                            _layoutElement('cc', CB_BUTTON),
                            _layoutElement('mute', CB_BUTTON),
                            //_layoutElement("distance", CB_BUTTON),
                            _layoutElement('volume', CB_SLIDER),
                            _layoutElement('volumeH', CB_SLIDER),
                           
                            _layoutElement("speed", CB_BUTTON),
                            _layoutElement('hd', CB_BUTTON),
                            _layoutElement('cast', CB_BUTTON),
                            _layoutElement('set', CB_BUTTON),
                            _layoutElement('fullscreen', CB_BUTTON)
                        ]
                    }
                }
            }
        }else{
            var _skin,
            _dividerElement = _layoutElement('divider', CB_DIVIDER),
            _defaults = {
                margin: 8,
                maxwidth: 2800,
                font: 'Microsoft YaHei,Arial,sans-serif',
                fontsize: 12,
                fontcolor: parseInt('eeeeee', 16),
                fontweight: 'bold',
                layout: {
                    left: {
                        position: 'left',
                        elements: [
                            _layoutElement('play', CB_BUTTON),
                            _layoutElement('elapsed', CB_TEXT)
                        ]
                    },
                    center: {
                        position: 'center',
                        elements: [
                            _layoutElement('time', CB_SLIDER),
                            _layoutElement('alt', CB_TEXT)
                        ]
                    },
                    right: {
                        position: 'right',
                        elements: [
                            _layoutElement('duration', CB_TEXT),
                            
                            _layoutElement('cc', CB_BUTTON),
                            _layoutElement('mute', CB_BUTTON),
                            _layoutElement('volume', CB_SLIDER),
                            _layoutElement('volumeH', CB_SLIDER),
				            _layoutElement('hd', CB_BUTTON),
                            _layoutElement('cast', CB_BUTTON),
                            _layoutElement('fullscreen', CB_BUTTON)
                        ]
                    }
                }
            }
	};
            var _settings,
            _layout,
            _elements,
            controlbarTimer,
            controlFlag='small',
            _bgHeight,
            _controlbar,
            _id,
            _duration,
            _position,
            _levels = [],
            _currentQuality,
            _captions,
            _currentCaptions,
            _currentVolume,
            _castState = {},
            _volumeOverlay,
            _cbBounds,
            _timeRail,
            _railBounds,
            _timeOverlay,
            _timeOverlayContainer,
            _timeOverlayThumb,
            _timeOverlayText,
            _hdTimer,
            _hdTapTimer,
            _hdOverlay,
            _ccTimer,
            _ccTapTimer,
            _ccOverlay,
            _redrawTimeout,
            _hideTimeout = -1,
            _audioMode = false,
            _instreamMode = false,
            _adMode = false,
            _hideFullscreen = false,
            _dragging = null,
            _lastSeekTime = 0,
            _cues = [],
            _activeCue,
            _toggles = {
                play: 'pause',
                mute: 'unmute',
                cast: 'casting',
                fullscreen: 'normalscreen'
            },

            _toggleStates = {
                play: false,
                mute: false,
                cast: false,
                fullscreen: _config.fullscreen || false
            },

            _buttonMapping = {
                play: _play,
                mute: _mute,
                fullscreen: _fullscreen,
                next: _next,
                prev: _prev,
                hd: _hd,
                cc: _cc,
                cast: _cast
            },

            _sliderMapping = {
                time: _seek,
                volume: _volume
            },

            _overlays = {},
            _jwhidden = [],
            _this = utils.extend(this, new events.eventdispatcher());

        function _layoutElement(name, type, className) {
            return {
                name: name,
                type: type,
                className: className
            };
        }

        function _init() {
            _elements = {};

            _id = _api.id + '_controlbar';
            _duration = _position = 0;

            _controlbar = _createSpan();
            _controlbar.id = _id;
            _controlbar.className = 'jwcontrolbar';

            _skin = _api.skin;
            _layout = _skin.getComponentLayout('controlbar');
            if (!_layout) {
                _layout = _defaults.layout;
            }
            utils.clearCss(_internalSelector());
            _css.block(_id + 'build');
            _createStyles();
            _buildControlbar();
            _css.unblock(_id + 'build');
            _addEventListeners();
            setTimeout(_volumeHandler, 0);
            _playlistHandler();
            _this.visible = true;
            _castAvailable();
            _buildSpeedOverlay();
            _buildSetOverlay();
            //small
            _this.railSmall();
        }

        function _addEventListeners() {
            _api.jwAddEventListener(events.JWPLAYER_MEDIA_TIME, _timeUpdated);
            _api.jwAddEventListener(events.JWPLAYER_PLAYER_STATE, _stateHandler);
            _api.jwAddEventListener(events.JWPLAYER_PLAYLIST_ITEM, _itemHandler);
            _api.jwAddEventListener(events.JWPLAYER_MEDIA_MUTE, _volumeHandler);
            _api.jwAddEventListener(events.JWPLAYER_MEDIA_VOLUME, _volumeHandler);
            _api.jwAddEventListener(events.JWPLAYER_MEDIA_BUFFER, _bufferHandler);
            _api.jwAddEventListener(events.JWPLAYER_FULLSCREEN, _fullscreenHandler);
            _api.jwAddEventListener(events.JWPLAYER_PLAYLIST_LOADED, _playlistHandler);
            _api.jwAddEventListener(events.JWPLAYER_MEDIA_LEVELS, _qualityHandler);
            _api.jwAddEventListener(events.JWPLAYER_MEDIA_LEVEL_CHANGED, _qualityLevelChanged);
            _api.jwAddEventListener(events.JWPLAYER_CAPTIONS_LIST, _captionsHandler);
            _api.jwAddEventListener(events.JWPLAYER_CAPTIONS_CHANGED, _captionChanged);
            _api.jwAddEventListener(events.JWPLAYER_RESIZE, _resizeHandler);
            _api.jwAddEventListener(events.JWPLAYER_CAST_AVAILABLE, _castAvailable);
            _api.jwAddEventListener(events.JWPLAYER_CAST_SESSION, _castSession);

            if (!_isMobile) {
                _controlbar.addEventListener('mouseover', function() {
                    // Slider listeners
                    window.addEventListener('mousedown', _killSelect, false);
                }, false);
                _controlbar.addEventListener('mouseout', function() {
                    // Slider listeners
                    window.removeEventListener('mousedown', _killSelect);
                    document.onselectstart = null;
                }, false);
            }
 ///zhangli add------------------
            _controlbar.onmouseover=function(e)
            {
 		        if(_api.jwGetState()==states.BUFFERING){
                    return;
                }
                if(checkHover(e,this))
                {
                   
                        _this.railBig();
                   
                }
            }
            _controlbar.onmouseout=function(e)
            {
                
                if(checkHover(e,this) )
                {
                    if(_api.jwGetState()!=states.PAUSED){
                     _this.railSmall();
                    }
                }
            }
        }

    

        
        //MOUSEOVER  冒泡------add---
       function contains(parentNode, childNode) {
            if (parentNode.contains) {
                return parentNode != childNode && parentNode.contains(childNode);
            } else {
                return !!(parentNode.compareDocumentPosition(childNode) & 16);
            }
        }
        function checkHover(e,target){
            if (getEvent(e).type=="mouseover")  
            {
                return !contains(target,getEvent(e).relatedTarget||getEvent(e).fromElement) && !((getEvent(e).relatedTarget||getEvent(e).fromElement)===target);
            } else {
                return !contains(target,getEvent(e).relatedTarget||getEvent(e).toElement) && !((getEvent(e).relatedTarget||getEvent(e).toElement)===target);
            }
        }
        function getEvent(e){
            return e||window.event;
         }
     //MOUSEOVER  冒泡----add-----
        function _resizeHandler() {
            _cbBounds = utils.bounds(_controlbar);
            if (_cbBounds.width > 0) {
                _this.show(true);
            }
        }

        function isLiveStream(evt) {
            var isIpadStream = (evt.duration === Number.POSITIVE_INFINITY);
            var isSafariStream = (evt.duration === 0 && evt.position !== 0 && utils.isSafari() && !_isMobile);

            return isIpadStream || isSafariStream;
        }

        function _timeUpdated(evt) {
            _css.block(_id); //unblock on redraw

            // Positive infinity for live streams on iPad, 0 for live streams on Safari (HTML5)
            if (isLiveStream(evt)) {
                _this.setText(_api.jwGetPlaylist()[_api.jwGetPlaylistIndex()].title || 'Live broadcast');

                // so that elapsed time doesn't display for live streams
                _toggleTimesDisplay(false);
            } else {
                var timeString;
                if (_elements.elapsed) {
                    timeString = utils.timeFormat(evt.position);
                    _elements.elapsed.innerHTML = timeString+" / "+ utils.timeFormat(evt.duration);
                }
                if (_elements.duration) {
                    timeString = utils.timeFormat(evt.duration);
                    _elements.duration.innerHTML = "";
                }
                if (evt.duration > 0) {
                    _setProgress(evt.position / evt.duration);
                } else {
                    _setProgress(0);
                }
                _duration = evt.duration;
                _position = evt.position;
                if (!_instreamMode) {
                    _this.setText();
                }
            }
        }

        function _stateHandler(evt) {
            switch (evt.newstate) {
                case states.BUFFERING:
                case states.PLAYING:
                    if (_elements.timeSliderThumb) {
                        _css.style(_elements.timeSliderThumb, {
                            opacity: 1
                        });
                    }
                    _toggleButton('play', true);

                    break;
                case states.PAUSED:
                    if (!_dragging) {
                        _toggleButton('play', false);
                    }
                    _this.railBig();
                    break;
                case states.IDLE:
                    _toggleButton('play', false);
                    if (_elements.timeSliderThumb) {
                        _css.style(_elements.timeSliderThumb, {
                            opacity: 0
                        });
                    }
                    if (_elements.timeRail) {
                        _elements.timeRail.className = 'jwrail';
                    }
                    _setBuffer(0);
                    _timeUpdated({
                        position: 0,
                        duration: 0
                    });
                    break;
            }
        }

        function _itemHandler(evt) {
            if (!_instreamMode) {
                var tracks = _api.jwGetPlaylist()[evt.index].tracks,
                    tracksloaded = false,
                    cuesloaded = false;
                _removeCues();
                if (_.isArray(tracks) && !_isMobile) {
                    for (var i = 0; i < tracks.length; i++) {
                        if (!tracksloaded && tracks[i].file && tracks[i].kind &&
                            tracks[i].kind.toLowerCase() === 'thumbnails') {
                            _timeOverlayThumb.load(tracks[i].file);
                            tracksloaded = true;
                        }
                        if (tracks[i].file && tracks[i].kind &&
                            tracks[i].kind.toLowerCase() === 'chapters') {
                            _loadCues(tracks[i].file);
                            cuesloaded = true;
                        }
                    }
                }
                // If we're here, there are no thumbnails to load -
                // we should clear out the thumbs from the previous item
                if (!tracksloaded) {
                    _timeOverlayThumb.load();
                }
            }
        }

        function _volumeHandler() {
            var muted = _api.jwGetMute();
            _currentVolume = _api.jwGetVolume() / 100;
            _toggleButton('mute', muted || _currentVolume === 0);
            _setVolume(muted ? 0 : _currentVolume);
        }

        function _bufferHandler(evt) {
            _setBuffer(evt.bufferPercent / 100);
        }

        var fullfirst=false;
        function _fullscreenHandler(evt) {
            _toggleButton('fullscreen', evt.fullscreen);
            _updateNextPrev();
         
            if(_api.jwGetFullscreen())
            {
               
                fullfirst=true;
            }
           /* if (_this.visible) {
                _this.show(true);
            }*/
        }

        function _playlistHandler() {
            _css.style([
                _elements.hd,
                _elements.cc
            ], HIDDEN);

            _updateNextPrev();
            _redraw();
        }

        function _hasHD() {
            return (!_instreamMode && _levels.length > 1 && _hdOverlay);
        }

        function _qualityHandler(evt) {
            _levels = evt.levels || [];
            if (_hasHD()) {
                _css.style(_elements.hd, NOT_HIDDEN);
                _hdOverlay.clearOptions();
                for (var i = 0; i < _levels.length; i++) {
                    _hdOverlay.addOption(_levels[i].label, i);
                }
                _qualityLevelChanged(evt);
            } else {
                _css.style(_elements.hd, HIDDEN);
            }
            _redraw();
        }

        function _qualityLevelChanged(evt) {
            _currentQuality = Math.floor(evt.currentQuality);
            if (_elements.hd) {
                _elements.hd.querySelector('button').className =
                    (_levels.length === 2 && _currentQuality === 0) ? 'off' : '';
            }
            if (_hdOverlay && _currentQuality >= 0) {
                _hdOverlay.setActive(evt.currentQuality);
            }
 	        document.getElementById("hdTxt").innerHTML = _levels[_currentQuality].label, _currentQuality;
        }

        function _hasCaptions() {
            return (!_instreamMode && _captions && _captions.length > 1 && _ccOverlay);
        }

        function _captionsHandler(evt) {
            _captions = evt.tracks;
            if (_hasCaptions()) {
                _css.style(_elements.cc, NOT_HIDDEN);
                _ccOverlay.clearOptions();
                for (var i = 0; i < _captions.length; i++) {
                    _ccOverlay.addOption(_captions[i].label, i);
                }
                _captionChanged(evt);
            } else {
                _css.style(_elements.cc, HIDDEN);
            }
            _redraw();
        }

        function _captionChanged(evt) {
            if (!_captions) {
                return;
            }
            _currentCaptions = Math.floor(evt.track);
            if (_elements.cc) {
                _elements.cc.querySelector('button').className =
                    (_captions.length === 2 && _currentCaptions === 0) ? 'off' : '';
            }
            if (_ccOverlay && _currentCaptions >= 0) {
                _ccOverlay.setActive(evt.track);
            }
        }

        function _castAvailable(evt) {
            // chromecast button is displayed after receiving this event
            if (_elements.cast) {
                if (utils.canCast()) {
                    utils.addClass(_elements.cast, 'jwcancast');
                } else {
                    utils.removeClass(_elements.cast, 'jwcancast');
                }
            }

            _castSession(evt || _castState);
        }

        function _castSession(evt) {
            _castState = evt;

            _toggleButton('cast', evt.active);

            _redraw();
        }

        // Bit of a hacky way to determine if the playlist is available
        function _sidebarShowing() {
            return (!!document.querySelector('#' + _api.id + ' .jwplaylist') && !_api.jwGetFullscreen());
        }

        /**
         * Styles specific to this controlbar/skin
         */
        function _createStyles() {
            _settings = utils.extend({}, _defaults, _skin.getComponentSettings('controlbar'), _config);

            _bgHeight = _getSkinElement('background').height;

            var margin = _audioMode ? 0 : _settings.margin;
            var styles = {
                height: _bgHeight,
                bottom: margin,
                left: margin,
                right: margin,
                'max-width': _audioMode ? '' : _settings.maxwidth
            };
            _css.style(_controlbar, styles);

            _css(_internalSelector('.jwtext'), {
                font: _settings.fontsize + 'px/' + _getSkinElement('background').height + 'px ' + _settings.font,
                color: _settings.fontcolor,
                'font-weight': _settings.fontweight
            });

            _css(_internalSelector('.jwoverlay'), {
                bottom: _bgHeight-20
            });
        }


        function _internalSelector(name) {
            return '#' + _id + (name ? ' ' + name : '');
        }

        function _createSpan() {
            return _createElement('span');
        }

        function _createElement(tagname) {
            return document.createElement(tagname);
        }

        function _buildControlbar() {
            var capLeft = _buildImage('capLeft');
            var capRight = _buildImage('capRight');
            var bg = _buildImage('background', {
                position: 'absolute',
                left: _getSkinElement('capLeft').width,
                right: _getSkinElement('capRight').width,
                'background-repeat': 'repeat-x'
            }, true);

            if (bg) {
                _appendChild(_controlbar, bg);
            }
            if (capLeft) {
                _appendChild(_controlbar, capLeft);
            }
            _buildLayout();
            if (capRight) {
                _appendChild(_controlbar, capRight);
            }
        }

        function _buildElement(element, pos) {
            switch (element.type) {
                case CB_TEXT:
                    return _buildText(element.name);
                case CB_BUTTON:
                    if (element.name !== 'blank') {
                        return _buildButton(element.name, pos);
                    }
                    break;
                case CB_SLIDER:
                    return _buildSlider(element.name);
            }
        }

        /*jshint maxparams:5*/
        function _buildImage(name, style, stretch, nocenter, vertical) {
            var element = _createSpan(),
                skinElem = _getSkinElement(name),
                center = nocenter ? ' left center' : ' center',
                size = _elementSize(skinElem),
                newStyle;

            element.className = 'jw' + name;
            element.innerHTML = '&nbsp;';

            if (!skinElem || !skinElem.src) {
                return;
            }

            if (stretch) {
                newStyle = {
                    background: 'url("' + skinElem.src + '") repeat-x ' + center,
                    'background-size': size,
                    height: vertical ? skinElem.height : ''
                };
            } else {
                newStyle = {
                    background: 'url("' + skinElem.src + '") no-repeat' + center,
                    'background-size': size,
                    width: skinElem.width,
                    height: vertical ? skinElem.height : ''
                };
            }
            element.skin = skinElem;
            _css(_internalSelector((vertical ? '.jwvertical ' : '') + '.jw' + name), utils.extend(newStyle, style));
            _elements[name] = element;
            return element;
        }

        function _buildButton(name, pos) {
            if (!_getSkinElement(name + 'Button').src) {
                return null;
            }

            // Don't show volume or mute controls on mobile, since it's not possible to modify audio levels in JS
            if (_isMobile && (name === 'mute' || name.indexOf('volume') === 0)) {
                return null;
            }
            // Having issues with stock (non-chrome) Android browser and showing overlays.
            //  Just remove HD/CC buttons in that case
            if (_nonChromeAndroid && /hd|cc/.test(name)) {
                return null;
            }


            var element = _createSpan();
            var span = _createSpan();
            var divider = _buildDivider(_dividerElement);
            var button = _createElement('button');
            element.className = 'jw' + name;
            //console.log(element.className);
            button.style.height='16px';
            button.style.bottom='-11px';
            if(name == "hd"){//add hd  zhangli
				button.id="hdTxt";
				button.innerHTML = "¸ßÇå";
				button.style.color ="#787d82";
				button.style.padding ="0";

				button.style.textAlign="center";
				button.style.font="12px Microsoft YaHei,SimSun,Arial";
				button.onmouseover = function() { 
		            if(_dragging==null){
		              button.style.color ="#f01400";
					  closeSpeedOverlay();             
                      hdoverFlag=true;
                   }
					
                };
                button.onmouseout = function() { 
                    button.style.color ="#787d82"; 
                };
            }
            

        if(name == "speed"){//speed zhangli
                button.id="speedTxt";
                button.innerHTML = currentRate+" X";
                button.style.color ="#787d82";
                button.style.padding ="0";
                button.style.width='42px';
                button.style.font="12px Microsoft YaHei,SimSun,Arial";
                
                button.onmouseover = function() {
                    if(_dragging==null){
                        button.style.color ="#f01400";showSpeedOverlay();_hdOverlay.hide();};
                    }
                button.onmouseout = function() {button.style.color ="#787d82"; hideSpeedOverlay()};
            }
            if(name == "set"){//set zhangli
 
                button.onmouseover = function() {
                    if(_dragging==null){
                        showSetOverlay();_hdOverlay.hide()};
                    }
                button.onmouseout  = function() {hideSetOverlay()};

            }
            if (pos === 'left') {
                _appendChild(element, span);
                _appendChild(element, divider);
            } else {
                _appendChild(element, divider);
                _appendChild(element, span);
            }

            if (!_isMobile) {
                button.addEventListener('click', _buttonClickHandler(name), false);
            } else if (name !== 'hd' && name !== 'cc') {
                var buttonTouch = new utils.touch(button);
                buttonTouch.addEventListener(utils.touchEvents.TAP, _buttonClickHandler(name));
            }

           // button.innerHTML = '&nbsp;';
            button.tabIndex = -1;
            //fix for postbacks on mobile devices when a <form> is used
            button.setAttribute('type', 'button');
            _appendChild(span, button);

            var outSkin = _getSkinElement(name + 'Button'),
                overSkin = _getSkinElement(name + 'ButtonOver'),
                offSkin = _getSkinElement(name + 'ButtonOff');


            _buttonStyle(_internalSelector('.jw' + name + ' button'), outSkin, overSkin, offSkin);
            var toggle = _toggles[name];
            if (toggle) {
                _buttonStyle(_internalSelector('.jw' + name + '.jwtoggle button'), _getSkinElement(toggle + 'Button'),
                    _getSkinElement(toggle + 'ButtonOver'));
            }

            if (_toggleStates[name]) {
                utils.addClass(element, 'jwtoggle');
            } else {
                utils.removeClass(element, 'jwtoggle');
            }

            _elements[name] = element;

            return element;
        }


	// speedButton click change currentRate--------------------------------------------
		// speedButton click change currentRate--------------------------------------------
        var trident = !!navigator.userAgent.match(/Trident\/7.0/);
        var net = !!navigator.userAgent.match(/.NET4.0E/);
        var IE11 = trident && net;
        var IEold = ( navigator.userAgent.match(/MSIE/i) ? true : false );
        
        var currentRate='1.0';
        if (localStorage.currentRate){
            currentRate=localStorage.currentRate;
        }

      
        //倍速选择-----zhangli --------------------------- ;
        function selectSpeed(){
           // _this.show(true);

            var speedStr=this.innerText?String(this.innerText):String(this.textContent);
            
            currentRate=speedStr.substring(0,speedStr.length-1);
            setAllSpeedColor();
            speedChanged();
        } 

    function speedChanged (){
       var videoTag = document.querySelector('video');  
        if(IE11 || IEold){
            jwplayer().seek(jwplayer().getPosition());
            jwplayer().onSeek(function(){videoTag.playbackRate = currentRate;});
            jwplayer().onPause(function(){videoTag.playbackRate = currentRate;});
            jwplayer().onPlay(function(){videoTag.playbackRate = currentRate;});
            videoTag.playbackRate = Number(currentRate);
        } else {
            jwplayer().seek(jwplayer().getPosition());
            videoTag.playbackRate = Number(currentRate);
        }
            
        localStorage.currentRate=currentRate;
        document.getElementById("speedTxt").innerHTML =currentRate+" X"; 
        jwplayer().onSpeedChange();

    
    }
    window.thisCurrentRate=thisCurrentRate;
    function thisCurrentRate (){
        return currentRate;
    }

        //create speed div
    var speedBox, speedDiv;
    function _buildSpeedOverlay(){

        speedBox = document.createElement('div');
    
        speedDiv = document.getElementById(_api.id);
        
        speedBox.style.background="#14191e";
       
        speedBox.style.position="absolute";
        speedBox.style.opacity =".9";//针对所有通用浏览器
        //speedBox.style.filter ="alpha(opacity=90)";//针对IE浏览器
       // speedBox.style.font="14px,Arial";
        speedBox.style.font="14px Microsoft YaHei,SimSun,Arial";
        speedBox.style.width="80px";
        speedBox.style.height="280px";
       // speedBox.style.left="71%";
        speedBox.style.bottom="53px";
        speedBox.style.zIndex="991";
        speedBox.style.color="#787d82";

      
       speedBox.innerHTML='<ul id="speedAjust" style="cursor:pointer" class="multi-speed"><li><i></i><span>0.5x</span></li>\
        <li><i></i><span>0.75x</span></li><li><i></i><span>1.0x</span></li><li><i></i><span>1.25x</span></li><li><i></i><span>1.5x</span></li><li><i></i><span>1.75x</span></li><li><i></i><span>2.0x</span></li></ul>';

          
        speedDiv.appendChild(speedBox);
       
        var arrLen=document.getElementById('speedAjust').getElementsByTagName('span');
        for(var i=0;i<arrLen.length;i++){
            var speedButton=arrLen[i];
            speedButton.style.color="#787d82";
            speedButton.style.display="block";
            speedButton.style.width='80px';
            speedButton.style.height='40px';
            speedButton.style.textAlign='center';
            speedButton.style.padding="0";
            speedButton.style.borderTop="1px solid #363c40";
            speedButton.style.borderTop.opacity='.3';

            
            speedButton.style.verticalAlign="middle";
            speedButton.style.lineHeight="40px";

            speedButton.onmouseover=function(){
                
            var speedStr=this.innerText?String(this.innerText):String(this.textContent);
            
                if(currentRate!=speedStr.substring(0,speedStr.length-1)){
                    this.style.color='#fff';
                }
                this.style.backgroundColor="#363c40";
                this.style.backgroundColor.opacity=".3";
            };
            speedButton.onmouseout=function(){
                var speedStr=this.innerText?String(this.innerText):String(this.textContent);
            
                if(currentRate!=speedStr.substring(0,speedStr.length-1)){
                    this.style.color='#787d82';
                }else{
                   this.style.color='#f01400';
                }
                 this.style.backgroundColor='transparent';
            };
            setAllSpeedColor();
            speedButton.addEventListener("click",selectSpeed);
 
        }
       
       speedBox.style.visibility="hidden";
       speedBox.onmouseover = function() 
       { showSpeedOverlay();
       // _this.show(true);
    };
       speedBox.onmouseout = function() { speedBox.style.visibility="hidden"};
    }

    function setAllSpeedColor(){
       var arrLen=document.getElementById('speedAjust').getElementsByTagName('span');
        for(var i=0;i<arrLen.length;i++){
          var speedButton=arrLen[i];
          speedButton.style.color="#787d82";
         // speedButton.style.marginLeft='35px';
         var speedStr=speedButton.innerText?String(speedButton.innerText):String(speedButton.textContent);
            
       
          if((currentRate)==speedStr.substring(0,speedStr.length-1)){
                speedButton.style.color='#f01400';
            }
        }
    }


     ///create set window----------------------------------------
     //zhangli add-----
    var setOverlay,setTime;
    var cookies = utils.getCookies(),
         playAuto = cookies.playAuto;
         if(playAuto=='undefined'){
            playAuto=false;
         };
    
    function _buildSetOverlay(){
        if(isnext==undefined|| isnext==null){
            isnext=true;
        }
        
        setOverlay = document.createElement('div');
        setOverlay.id="setoverlay";

        var setDiv = document.getElementById(_api.id);
        
       
        setOverlay.style.position="absolute";
        setOverlay.style.zIndex="991";
        setOverlay.style.bottom="48px";
        var setImg = new Image();
       if(isnext==false || isnext=='false'){//false hide next level----------
            setImg.src='data:image/png;base64,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';
           
          }else{//true show next level----------
            setImg.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAACMCAYAAACanNcLAAAK6klEQVR4nO3dT0xbVxbH8cuAZcuGGEyxFyGp0VhW1DSa8CebthRCwq4RmUiJBItIJTI7VMHsGw37tELdBTVILBopkQiI7EgTGJrZhJiM0lQV8shuJ5WK05q4gGULKLNw7sntqw2BmhbT72cT85793rOl+7vn3GdISbXv0PcKAJRSf/mjLwDA3kEgABAEAgBBIAAQBAIAQSAAEAQCAEEgABAEAgBBIAAQBAIAQSAAEAQCAEEgABBlhT5gIBiwn2w9WWndfm/q3vPIfCTT2dXp/eHZs4xSSk1O3kkqpVTH2Q7Pk6+erETmIxnzNZ1dnd7rn12PW4/V2FTvrK097BgfG090dnV6y8vLS3Jdiz6nPsfTp9+mH87OpfT+zc5rHjMcnl3yVFXb/HV1Dr1teXl5I9e1AcVsVyqEeDy+OnR1aGF5eXlD/2vun5y8k3ytpsYeCAbsSik1PjaeyBUiuXR2dXobGpoqvF6vLdQT8ulBOXR1aCEWjabD4dmlWDSajkWjaXOgj4+NJ2prDzvMYzmdzjJrGGhDV4cW9DH1tlg0mtbbX/3TAIpHSaH/QIquEOLx+KrT6SxTSqny8vISs0LINbMGggH70TeOusbHxhN6W6gn5Ms1+HSF8OSrJyubBUk8Hl9VSimv12uz7otFo2lzxlfq5axPhYA/q10JBD2w9eDv7Or0plKpNevAjMfjq2YAWG0VCOZrdSvyWk2NPZVKrZn7GpvqnZ6qaptuUXRoxaLR9OTknWSuMDK1t592K5WtbEI9IZ/ZigD7ScHXEJTKzsihnpBPqeygVkqpB7MPVsbHxjPWQa5n43zhEAgG7PkGn14XaGhoqhi6OrTQ3n7aPT//9bI+b75ZvO51v8NsBdwHKkpTKyvrSmUHv7Vy0EI9IYdSSp1sPVl5svUkVQL2nYIHQmQ+konMRxaU2nxRUC/uXf/selzP+NbnKJUdvNZACAaPlOsQaWhoqlDqZfCYg1mHg96uB7TZviillKeq2pZY/HFVKVnoTOrXhXpCvlg0mna6XKVKZdcifsPHA+xpBQ+ExqZ6px6kSr0cqPem7j13H6goXV5e3vBUVf+qp7eqrT3sCIdnl4LBI+Xm9o6zHZ4fnj3LpFKp0vGx8UR7+2l3YvHH1YezcynrY/0aT1W1TbcHHWc7PHp7KpVaCwQDdn9dncO842G2NmY109hU79TvRynWEbD/FDwQHs7OpfTsb60QOs52eObnv162DnItEAzYTzSdcF//7Hrc6/Xa9J0Bs20YHxtPNDbVO/WMrZRSDQ1NFTqE/HV1Dv1Yz/rWx9rTp9+m9VqC3ma9lRnqCfnC4dklfR79PMIA+1HBA8Hag+sZNRaNpvUg91RV29rbT7v1rKxUdt3B6/VWDl0dWug42+HRg/TJV09WTjSdcEfmI3kHXzg8u7RZhfBaTY09+k0srdQvbzVuVqnoysA8jq4ylMqG3fY/HWBvK3ggTE7eSXZ2ddpTqdTa06ffpmtrDzucTmeZv67OoWdavVofCAbSkflIxlNVbdOLirqk1wMvMh/J1L3uz3u7UqnNK4TGpnpnKpVa0yGgZ/6Osx0ep9NZNnR1aKGzq9NrDSizNdDVhbkOYf1uBbAfFPy2o175198TiMxHMrluEzY21TuDwSPl5iBvbz/tdrpcpbkW7vQ+pbLVhJ6tzarA+vzE4o+rweCR8gezD5JH3zjq8nq9Nv3dBKV+uUCog8i8XWoeR6lsRWFWCLQM2G8KHggAihe/3ARAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgARFmhDxgM/LXgxwSQ23zkv2uFPF5Jte/Q94U8IIDiRcsAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBA7NqfO/tbY4PH5XLatvu6lZXU6n8ehhO7cU0ANrdrgeByOW3//tcXC9t93VvvvuPb6TkHBi57lFLqww//ueNAaW1ptv/93Fn3Bx/8I55r/8jIsO/ixffzvq+RkWG5fvN55y+cc77z9tvl1uP29/W6K6s8pdZrHhi47PH7/dsK1Fgstvpb3rtpZGTYd+3Ta8+npmcySm39uWB/KOo/iHr+wjnnmffOVFi3m4NSm7g9sXTzxmhKKaUGB694q6o8Jeb+7Q6m1pZme/el7spc+yZuTywde/OYw9x288Zo6tibxxz9fb3ujz7+JKm3V1Z5Sp8vJtatx8h1Lfr9bhZIO5XrM+m+1F3Zfan7F88zP9tCBhD2hqIOBKWUWlxMbGw1aw0OXvGaP+9kljNn7JGRYd+juXB64vbEkh6g5y+ccx5785jj8ZeP07kqAaWUuvv53RU94yqVDRW/32+79vndle1eT6FZr5cK4c+p6AOhUKzVhjkTPpoLp/VMqFuG/r5et36++VwzNBYXExvJ5E9rZulvzrixWGz1xbZK6/Y/eua1ViFT0zOZqekZwmCfK/pAqKrylORqEbbr5o3R1M0boylrr6/XJaxelP1JpbKDX7cJfr/f9mgunDbbAv0cc5DplsMc/P19vW7j2HnpiqfQs/V2PkezesD+UfSBsN2WId+6g1LZ3v9Vztnf1+v+33ffrR46eNB2vL7BoVsGpbIza39fr1tXCPmure1Um+vRXDj9ut9v19sqqzylj798nN7q/LdGx5Jtp9pcOoj02oh+r9a1gK3o6zQDa7NwsrZg2D+KPhC2S1cC+Xri/r5edzL5k/xvOG73gTI9SM2BkK+9MB/fGh37VZWgH+sZdnDwire1pdk+NT2T8fv9truvsJ7wonzP6CrDrGh+jx5/u4GD4lH0gbDTlqHtVJvri/v3l63b8636Dwxc9nxx//7ymffOVOh2YXDwivfW6FhyanomoxcVdflvhkdrS7NdqZd9+cjIsE+X29/EYpm2U22uhobjjlgstrqdMvxFMCwMDFz2DAxc9vye6w60C/tT0QfCTu4ytLY0293uA2W51gzyrfrrwWZtN6wLgrnCqcZXU7q4mNjIdW0fffxJcmRk2Kf8ftu1T6893+x95PNHL0Bi/yj6QNiJtlNtrlujY8nWlma7HuB6hrfO0luVx7r036xCOHTwoO2bWExu35mvN38uhln3/IVzznzhhuJX9IGw3ZZB3/vvvtRdubiY2Lh48f0F80tGub7082zh2a9aCG2rCqG1pdl+vL7BYc7+ekDp7zZM3J5YOnTwoC3XIuFeYP3W5KsuvqL4FH0gbLdl0H23uX9qeibTfalb6UHb39frPl7f4NDHn5qeyehBYZ0d891+0+dsO9Xmmrg9sVTjqynVYfFoLpzW+y0BlBwZGfaZlcZesJeuBbtr1/47+Lfefce3099l2MnrAPx2u1YhrK+v/7yTX1RaX1//eTeuB8DWdq1CAFB8+AMpAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBAEAgABIEAQBAIAASBAEAQCAAEgQBA/B9Uq6PhMoStwAAAAABJRU5ErkJggg==";
            
        }
        setOverlay.appendChild(setImg);
        
        var h5Btn = document.createElement("input"); 
        h5Btn.type= "button";
        h5Btn.value="HTML5";
        h5Btn.style.width = "100px";
        h5Btn.style.height = "30px";
        h5Btn.style.align = "center";
        h5Btn.style.font="14px Microsoft YaHei,SimSun,Arial";
        h5Btn.style.position="absolute";
        h5Btn.style.marginLeft = "-240px";
        h5Btn.style.marginTop = "40px";
        
        h5Btn.style.background = "#f01400";
        h5Btn.style.border = "1px solid " + "#f01400";
        h5Btn.style.color = "white";
        setOverlay.appendChild(h5Btn);

        var flashBtn = document.createElement("input"); 
        flashBtn.id='flashBtn';
        flashBtn.type= "button";
        flashBtn.value="FLASH";
        flashBtn.style.position="absolute";
        flashBtn.style.width = "100px";
        flashBtn.style.height = "30px";
        flashBtn.style.align = "center";
        flashBtn.style.marginLeft = "-120px";
        flashBtn.style.marginTop = "40px";
        flashBtn.style.background = "#14191e";
        flashBtn.style.backgroundColor.opacity='0';
        var isSafari=utils.isSafari();
        //console.log(isSafari+'==isSafari')
       // console.log(utils.flashVersion()+'==flash version')
 
        //if(utils.flashVersion()==0 || isSafari){
        if(utils.flashVersion()==0){
            flashBtn.style.border = "1px solid "+ "#4D5559";
            flashBtn.style.color = "#4D5559";
        }else{
           flashBtn.style.cursor="pointer";
           flashBtn.style.border = "1px solid "+ "#4D5559";
           flashBtn.style.color = "#B5B9BC";
           flashBtn.onmouseover = function() { this.style.border = "1px solid "+ "#7D888c";this.style.color = "#fff";};
           flashBtn.onmouseout  = function() { this.style.border = "1px solid "+ "#4D5559";this.style.color = "#B5B9BC";};
           flashBtn.addEventListener("click",switchToFlash);
        }
        function switchToFlash(){
            window.switchjwplayer("flash");
        }
        setOverlay.appendChild(flashBtn);

         if(isnext||isnext==undefined){

            var cbdiv = document.createElement('div');
            cbdiv.style.marginLeft = "24px";
            cbdiv.style.marginTop = "-40px";
            cbdiv.style.width="20px";
            cbdiv.style.height="20px";
            cbdiv.style.position="absolute";
            cbdiv.style.cursor="pointer";
            cbdiv.style.display="block";
            cbdiv.type= "button";
            cbdiv.style.background="rgba(0,0,0,0)";
            setOverlay.appendChild(cbdiv);
            
           
            setOverlay.appendChild(cbdiv);
            var cbImg = new Image();
            cbImg.id="imgid";
            //duigou----
            //cbImg.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAApUlEQVQYlY2QsRGCQBRE378GaMEOEK4ROwACj9ASpARSIRArkBJoAMQKtAUbuDNgFGGYkY13/9+3wlqlgY+TWlaZjfbA9TjJ/weM9nA04HrKLlEr7lcIT8ouAVCY8IjR0aJ1H55xbIB4/vZKGvhTsz5gwsfQf9SnUoxV+TdkdAQuQ9yOon39BkboAa4GmyGqQeyW0+0+bzldKQ18rMoRKor2soT1BnYaL6S4xV65AAAAAElFTkSuQmCC";
            cbImg.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAAt0lEQVQYlY3QsU3DYBDF8d85KejiDRghHiH0SDBCikh8HYzABoSOSBRmAxcZwBtgRsgGbpGIvhSYYEBIuep0+r+ndy+cOhsP6CcnwU9uhXuU4dk5WNn9A18JDXoTVeFDa687Cn/Cc6EG2cLKrsAapb3GxmyUeTbAJZaSNygkj7IaFYPbp2ODSla78fJ1jpHj6yBay0phKWslF+OU09G+kHXC3WDTCde/3/qudevdpRZn6JGkv80dACOiLYjVNwICAAAAAElFTkSuQmCC";
            cbdiv.appendChild(cbImg);
            cbImg.style.visibility='hidden';
      
            setOverlay.onmouseover = function() 
            {
                showSetOverlay();
                //_this.show(true)
            };
            setOverlay.onmouseout  = function() { this.style.visibility="hidden";var cbimg = document.getElementById("imgid");
            cbimg.style.visibility="hidden"; };
            setOverlay.style.visibility="hidden";
            setOverlay.appendChild(cbdiv);
            setDiv.appendChild(setOverlay);
            
            
            cbdiv.addEventListener("click",setPlayContinue);
        }else{
           setOverlay.onmouseover = function()
            { 
                showSetOverlay();
                //_this.show(true)
            };
           setOverlay.onmouseout  = function() { this.style.visibility="hidden"; };
            setOverlay.style.visibility="hidden";
           
            setDiv.appendChild(setOverlay);  
        }
    }
    function setPlayContinue(){
        if(isnext||isnext==undefined){
           var cbimg = document.getElementById("imgid");
         
            if(cbimg.style.visibility=="hidden"){
                
                //isplay=true;
                playAuto=true;
                utils.saveCookie('playAuto', true);
                cbimg.style.visibility="visible";
               // window.playContinue(true); 
            }else{
               // isplay=false;
                //window.playContinue(false);
                playAuto=false;
                utils.saveCookie('playAuto', false);
                cbimg.style.visibility="hidden";
            }
        }
    }
 
    function closeSetOverlay(){
        clearTimeout(setTime);
        setOverlay.style.visibility="hidden";
       if(isnext||isnext==undefined){
            var cbimg = document.getElementById("imgid");
            cbimg.style.visibility="hidden";
         }
    }
    function hideSetOverlay(){

       clearTimeout(setTime);
       setTime = setTimeout(closeSetOverlay,500);
    }
    function showSetOverlay(){
        _cbBounds = utils.bounds(_controlbar);
        var w=_cbBounds.width-280;
        clearTimeout(setTime);
        setOverlay.style.visibility="visible";
        setOverlay.style.left=w+"px";
         //duigou-----
       if(isnext||isnext==undefined){
            var cbimg = document.getElementById("imgid");
            if(playAuto==true || playAuto=='true'){
           
               cbimg.style.visibility="visible";
            }else{
               cbimg.style.visibility="hidden";   
            }
        }
    } 

    var speedTime;
    function closeSpeedOverlay(){
        clearTimeout(speedTime);
        speedBox.style.visibility="hidden";
    }
    function hideSpeedOverlay(){

        clearTimeout(speedTime);
        speedTime = setTimeout(closeSpeedOverlay,500);
    }
    function showSpeedOverlay(){
        _cbBounds = utils.bounds(_controlbar);
        var w=_cbBounds.width-218;
        clearTimeout(speedTime);
        speedBox.style.visibility="visible";
        speedBox.style.left=w+"px";
        
    } 
        function _buttonStyle(selector, out, over, off) {
            if (!out || !out.src) {
                return;
            }

            _css(selector, {
                width: out.width,
                background: 'url(' + out.src + ') no-repeat center',
                'background-size': _elementSize(out)
            });

            if (over.src && !_isMobile) {
                _css(selector + ':hover,' + selector + '.off:hover', {
                    background: 'url(' + over.src + ') no-repeat center',
                    'background-size': _elementSize(over)
                });
            }

            if (off && off.src) {
                _css(selector + '.off', {
                    background: 'url(' + off.src + ') no-repeat center',
                    'background-size': _elementSize(off)
                });
            }
        }

        function _buttonClickHandler(name) {
            return function(evt) {
                if (_buttonMapping[name]) {
                    _buttonMapping[name]();
                    if (_isMobile) {
                        _this.sendEvent(events.JWPLAYER_USER_ACTION);
                    }
                }
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
            };
        }
	///add show play and pause     
		var txtBox,videoBox,timeBox;firstPlay=true;
		function _buildCustomPauseIcon(){
				txtBox = document.createElement('div');
		
				videoBox = document.getElementById(_api.id);

				txtBox.style.background="#333333";
				txtBox.style.color="#fff";
				txtBox.style.position="absolute";
				txtBox.style.textAlign="center";
				txtBox.style.lineHeight="30px";
				txtBox.style.font="14px/2em Microsoft YaHei,SimSun,Arial";

				txtBox.style.width="80px";
				txtBox.style.height="30px";
				txtBox.style.left="47%";
				txtBox.style.top="75%";
				txtBox.style.zIndex="999";
				txtBox.style.visibility="hidden";
		   		txtBox.innerHTML="²¥·Å";
				videoBox.appendChild(txtBox);

		}

			

		function hiddenPopBox() {
			txtBox.style.visibility="hidden";
		}

		function showPopBox(s){
			if(firstPlay)
			{
				firstPlay=false;
				return;
			}
			txtBox.innerHTML =s;
			txtBox.style.visibility="visible";
			clearTimeout(timeBox);
			timeBox = setTimeout(hiddenPopBox,3000);
			 if (!_this.visible) {
               // _this.show();
            }
	}
        function _play() {
            if (_toggleStates.play) {
                _api.jwPause();
            } else {
                _api.jwPlay();
            }
        }

        function _mute() {
            var muted = !_toggleStates.mute;
            _api.jwSetMute(muted);
            if (!muted && _currentVolume === 0) {
                _api.jwSetVolume(50);
            }
            _volumeHandler();
        }

        function _hideOverlays(exception) {
            utils.foreach(_overlays, function(i, overlay) {
                if (i !== exception) {
                    if (i === 'cc') {
                        _clearCcTapTimeout();
                    }
                    if (i === 'hd') {
                        _clearHdTapTimeout();
                    }
                    overlay.hide();
                }
            });
        }

        function _toggleTimesDisplay(state) {
            if (!_controlbar || !_elements.alt) {
                return;
            }

            if (state === undefined) {
                state = (_controlbar.parentNode && _controlbar.parentNode.clientWidth >= 320);
            }

            if (state && !_instreamMode) {
                _css.style(_jwhidden, NOT_HIDDEN);
            } else {
                _css.style(_jwhidden, HIDDEN);
            }
        }
        var  volumeflag=false;
        function _showVolume() {
           if (!volumeflag) {
                return;
            }
            if (_audioMode || _instreamMode) {
                return;
            }
            _css.block(_id); // unblock on position overlay
            _volumeOverlay.show();
            _positionOverlay('volume', _volumeOverlay);
            _hideOverlays('volume');
        }

        function _volume(pct) {
            _setVolume(pct);
            if (pct < 0.1) {
                pct = 0;
            }
            if (pct > 0.9) {
                pct = 1;
            }
            _api.jwSetVolume(pct * 100);
        }

        function _seek(pct) {
            var position;
            if (_activeCue) {
                pct = _activeCue.position;
                if (pct.toString().slice(-1) === '%') {
                    // percent string
                    position = _duration * parseFloat(pct.slice(0, -1)) / 100;
                } else {
                    // time value
                    position = parseFloat(pct);
                }
            } else {
                position = pct * _duration;
            }
            _api.jwSeek(position);
        }

        function _fullscreen() {
            _api.jwSetFullscreen();
        }

        function _next() {
            _api.jwPlaylistNext();
        }

        function _prev() {
            _api.jwPlaylistPrev();
        }

        function _toggleButton(name, state) {
            if (!_.isBoolean(state)) {
                state = !_toggleStates[name];
            }

            if (_elements[name]) {
                if (state) {
                    utils.addClass(_elements[name], 'jwtoggle');
                } else {
                    utils.removeClass(_elements[name], 'jwtoggle');
                }

                // Use the jwtoggling class to temporarily disable the animation
                utils.addClass(_elements[name], 'jwtoggling');
                setTimeout(function() {
                    utils.removeClass(_elements[name], 'jwtoggling');
                }, 100);
            }
            _toggleStates[name] = state;
        }

        function _buildText(name) {
            var style = {},
                skinName = (name === 'alt') ? 'elapsed' : name,
                skinElement = _getSkinElement(skinName + 'Background');
            if (skinElement.src) {
                var element = _createSpan();
                element.id = _createElementId(_id, name);
                if (name === 'elapsed' || name === 'duration') {
                    element.className = 'jwtext jw' + name + ' jwhidden';
                    _jwhidden.push(element);
                } else {
                    element.className = 'jwtext jw' + name;
                }
                style.background = 'url(' + skinElement.src + ') repeat-x center';
                style['background-size'] = _elementSize(_getSkinElement('background'));
                _css.style(element, style);
                element.innerHTML = (name !== 'alt') ? '00:00' : '';

                _elements[name] = element;
                return element;
            }
            return null;
        }

        function _buildDivider(divider) {
            var element = _buildImage(divider.name);
            if (!element) {
                element = _createSpan();
                element.className = 'jwblankDivider';
                element.style.marginRight="15px";
				element.style.marginLeft="15px";//zhangli 
               // element.style.width='2px';
                //element.style.backgroundColor='#00ffcc';
                element.style.height='16px';
                element.style.bottom='-12px';
            }
            if (divider.className) {
                element.className += ' ' + divider.className;
            }
            return element;
        }
        var hdoverFlag=false;
        function _showHd() {
           if(!hdoverFlag){
                return;
            }
            if (_levels.length > 2) {
                
                if (_hdTimer) {
                    clearTimeout(_hdTimer);
                    _hdTimer = undefined;
                }
                _css.block(_id); // unblock on position overlay
                _hdOverlay.show();
                _positionOverlay('hd', _hdOverlay);
                _hideOverlays('hd');
            }
        }

        function _showCc() {
            if (_captions && _captions.length > 2) {
                if (_ccTimer) {
                    clearTimeout(_ccTimer);
                    _ccTimer = undefined;
                }
                _css.block(_id); // unblock on position overlay
                _ccOverlay.show();
                _positionOverlay('cc', _ccOverlay);
                _hideOverlays('cc');
            }
        }

        function _switchLevel(newlevel) {
            if (newlevel >= 0 && newlevel < _levels.length) {
                _api.jwSetCurrentQuality(newlevel);
                _clearHdTapTimeout();
                _hdOverlay.hide();
            }
        }

        function _switchCaption(newcaption) {
            if (newcaption >= 0 && newcaption < _captions.length) {
                _api.jwSetCurrentCaptions(newcaption);
                _clearCcTapTimeout();
                _ccOverlay.hide();
            }
        }

        function _cc() {
            if (_captions.length !== 2) {
                return;
            }
            _switchCaption((_currentCaptions + 1) % 2);
        }

        function _hd() {
            if (_levels.length !== 2) {
                return;
            }
            _switchLevel((_currentQuality + 1) % 2);
        }

        function _cast() {
            if (_castState.active) {
                _api.jwOpenExtension();
            } else {
                _api.jwStartCasting();
            }
        }

        function _buildSlider(name) {
            if (_isMobile && name.indexOf('volume') === 0) {
                return;
            }

            var slider = _createSpan(),
                vertical = name === 'volume',
                skinPrefix = name + (name === 'time' ? 'Slider' : ''),
                capPrefix = skinPrefix + 'Cap',
                left = vertical ? 'Top' : 'Left',
                right = vertical ? 'Bottom' : 'Right',
                capLeft = _buildImage(capPrefix + left, null, false, false, vertical),
                capRight = _buildImage(capPrefix + right, null, false, false, vertical),
                rail = _buildSliderRail(name, vertical, left, right),
                capLeftSkin = _getSkinElement(capPrefix + left),
                capRightSkin = _getSkinElement(capPrefix + left);
            //railSkin = _getSkinElement(name+'SliderRail');

            slider.className = 'jwslider jw' + name;

            if (capLeft) {
                _appendChild(slider, capLeft);
            }
            _appendChild(slider, rail);
            if (capRight) {
                if (vertical) {
                    capRight.className += ' jwcapBottom';
                }
                _appendChild(slider, capRight);
            }

            _css(_internalSelector('.jw' + name + ' .jwrail'), {
                left: vertical ? '' : capLeftSkin.width,
                right: vertical ? '' : capRightSkin.width,
                top: vertical ? capLeftSkin.height : '',
                bottom: vertical ? capRightSkin.height : '',
                width: vertical ? '100%' : '',
                height: vertical ? 'auto' : ''
            });

            _elements[name] = slider;
            slider.vertical = vertical;

            if (name === 'time') {
                _timeOverlay = new html5.overlay(_id + '_timetooltip', _skin);
                _timeOverlayThumb = new html5.thumbs(_id + '_thumb');
                _timeOverlayText = _createElement('div');
                _timeOverlayText.className = 'jwoverlaytext';
                _timeOverlayContainer = _createElement('div');
                _appendChild(_timeOverlayContainer, _timeOverlayThumb.element());
                _appendChild(_timeOverlayContainer, _timeOverlayText);
                _timeOverlay.setContents(_timeOverlayContainer);
                _timeRail = rail;
                _setTimeOverlay(0);
                _appendChild(rail, _timeOverlay.element());
                _styleTimeSlider(slider);
                _setProgress(0);
                _setBuffer(0);
            } else if (name.indexOf('volume') === 0) {
                _styleVolumeSlider(slider, vertical, left, right);
            }

            return slider;
        }
        var timeThumb;
        function _buildSliderRail(name, vertical, left, right) {
            var rail = _createSpan(),
                railElements = ['Rail', 'Buffer', 'Progress'],
                progressRail,
                sliderPrefix;

            rail.className = 'jwrail';

            for (var i = 0; i < railElements.length; i++) {
                sliderPrefix = (name === 'time' ? 'Slider' : '');
                var prefix = name + sliderPrefix + railElements[i],
                    element = _buildImage(prefix, null, !vertical, (name.indexOf('volume') === 0), vertical),
                    capLeft = _buildImage(prefix + 'Cap' + left, null, false, false, vertical),
                    capRight = _buildImage(prefix + 'Cap' + right, null, false, false, vertical),
                    capLeftSkin = _getSkinElement(prefix + 'Cap' + left),
                    capRightSkin = _getSkinElement(prefix + 'Cap' + right);

                if (element) {
                    var railElement = _createSpan();
                    railElement.className = 'jwrailgroup ' + railElements[i];
                    if (capLeft) {
                        _appendChild(railElement, capLeft);
                    }
                    _appendChild(railElement, element);
                    if (capRight) {
                        _appendChild(railElement, capRight);
                        capRight.className += ' jwcap' + (vertical ? 'Bottom' : 'Right');
                    }

                    _css(_internalSelector('.jwrailgroup.' + railElements[i]), {
                        'min-width': (vertical ? '' : capLeftSkin.width + capRightSkin.width)
                    });
                    railElement.capSize = vertical ? capLeftSkin.height + capRightSkin.height :
                        capLeftSkin.width + capRightSkin.width;

                    _css(_internalSelector('.' + element.className), {
                        left: vertical ? '' : capLeftSkin.width,
                        right: vertical ? '' : capRightSkin.width,
                        top: vertical ? capLeftSkin.height : '',
                        bottom: vertical ? capRightSkin.height : '',
                        height: vertical ? 'auto' : ''
                    });

                    if (i === 2) {
                        progressRail = railElement;
                    }

                    if (i === 2 && !vertical) {
                        var progressContainer = _createSpan();
                        progressContainer.className = 'jwprogressOverflow';
                        _appendChild(progressContainer, railElement);
                        _elements[prefix] = progressContainer;
                        _appendChild(rail, progressContainer);
                    } else {
                        _elements[prefix] = railElement;
                        _appendChild(rail, railElement);
                    }
                }
            }

            var thumb = _buildImage(name + sliderPrefix + 'Thumb', null, false, false, vertical);
            if (thumb) {
                _css(_internalSelector('.' + thumb.className), {
                    opacity: name === 'time' ? 0 : 1,
                    'margin-top': vertical ? thumb.skin.height / -2 : ''
                });
                //zhangli add volume position---
                 if(thumb.className=='jwvolumeHThumb'){
                    _css(_internalSelector('.' + thumb.className), {
                    width:'15px'
                    }); 
                }
                thumb.className += ' jwthumb';

                _appendChild(vertical && progressRail ? progressRail : rail, thumb);
            }

            if (!_isMobile) {
                var sliderName = name;
                if (sliderName === 'volume' && !vertical) {
                    sliderName += 'H';
                }
                rail.addEventListener('mousedown', _sliderMouseDown(sliderName), false);
            } else {
                var railTouch = new utils.touch(rail);
                railTouch.addEventListener(utils.touchEvents.DRAG_START, _sliderDragStart);
                railTouch.addEventListener(utils.touchEvents.DRAG, _sliderDragEvent);
                railTouch.addEventListener(utils.touchEvents.DRAG_END, _sliderDragEvent);
                railTouch.addEventListener(utils.touchEvents.TAP, _sliderTapEvent);
            }

            if (name === 'time' && !_isMobile) {
                timeThumb=thumb;
                
                timeThumb.style.visibility="hidden";
                rail.addEventListener('mousemove', _showTimeTooltip, false);
                rail.addEventListener('mouseout', _hideTimeTooltip, false);
            }

            _elements[name + 'Rail'] = rail;

            return rail;
        }

        function _idle() {
            var currentState = _api.jwGetState();
            return (currentState === states.IDLE);
        }

        function _killSelect(evt) {
            evt.preventDefault();
            document.onselectstart = function() {
                return false;
            };
        }

        function _draggingStart(name) {
            _draggingEnd();
            _dragging = name;
            window.addEventListener('mouseup', _sliderMouseEvent, false);
            window.addEventListener('mousemove', _sliderMouseEvent, false);
        }

        function _draggingEnd() {
            window.removeEventListener('mouseup', _sliderMouseEvent);
            window.removeEventListener('mousemove', _sliderMouseEvent);
            _dragging = null;
        }

        function _sliderDragStart() {
            _elements.timeRail.className = 'jwrail';
            if (!_idle()) {
                _api.jwSeekDrag(true);
                _draggingStart('time');
                _showTimeTooltip();
                _this.sendEvent(events.JWPLAYER_USER_ACTION);
            }
        }

        function _sliderDragEvent(evt) {
            if (!_dragging) {
                return;
            }
            var rail = _elements[_dragging].querySelector('.jwrail'),
                railRect = utils.bounds(rail),
                pct = evt.x / railRect.width;
            if (pct > 100) {
                pct = 100;
            }
            if (evt.type === utils.touchEvents.DRAG_END) {
                _api.jwSeekDrag(false);
                _elements.timeRail.className = 'jwrail';
                _draggingEnd();
                _sliderMapping.time(pct);
                _hideTimeTooltip();
                _this.sendEvent(events.JWPLAYER_USER_ACTION);
            } else {
                _setProgress(pct);
                var currentTime = (new Date()).getTime();
                if (currentTime - _lastSeekTime > 500) {
                    _lastSeekTime = currentTime;
                    _sliderMapping.time(pct);
                }
                _this.sendEvent(events.JWPLAYER_USER_ACTION);
            }
        }

        function _sliderTapEvent(evt) {
            var rail = _elements.time.querySelector('.jwrail'),
                railRect = utils.bounds(rail),
                pct = evt.x / railRect.width;
            if (pct > 100) {
                pct = 100;
            }
            if (!_idle()) {
                _sliderMapping.time(pct);
                _this.sendEvent(events.JWPLAYER_USER_ACTION);
            }
        }

        function _sliderMouseDown(name) {
            return function(evt) {
                if (evt.button) {
                    return;
                }

                _elements[name + 'Rail'].className = 'jwrail';

                if (name === 'time') {
                    if (!_idle()) {
                        _api.jwSeekDrag(true);
                        _draggingStart(name);
                    }
                } else {
                    _draggingStart(name);
                }
            };
        }

        function _sliderMouseEvent(evt) {
            if (!_dragging || evt.button) {
                return;
            }
            var rail = _elements[_dragging].querySelector('.jwrail'),
                railRect = utils.bounds(rail),
                name = _dragging,
                pct;

            if (_iFramedFullscreenIE()) {
                pct = _elements[name].vertical ? ((railRect.bottom * 100 - evt.pageY) / (railRect.height * 100)) :
                ((evt.pageX - (railRect.left * 100)) / (railRect.width * 100));
            } else {
                pct = _elements[name].vertical ? ((railRect.bottom - evt.pageY) / railRect.height) :
                ((evt.pageX - railRect.left) / railRect.width);
            }
            if (evt.type === 'mouseup') {
                if (name === 'time') {
                    _api.jwSeekDrag(false);
                }

                _elements[name + 'Rail'].className = 'jwrail';
                _draggingEnd();
                _sliderMapping[name.replace('H', '')](pct);
            } else {
                if (_dragging === 'time') {
                    _setProgress(pct);
                } else {
                    _setVolume(pct);
                }
                var currentTime = (new Date()).getTime();
                if (currentTime - _lastSeekTime > 500) {
                    _lastSeekTime = currentTime;
                    _sliderMapping[_dragging.replace('H', '')](pct);
                }
            }
            return false;
        }

        function _showTimeTooltip(evt) {
            if (evt) {
                _positionTimeTooltip.apply(this, arguments);
            }

            if (_timeOverlay && _duration && !_audioMode && !_isMobile) {
                _css.block(_id); // unblock on position overlay
                _timeOverlay.show();
                _positionOverlay('time', _timeOverlay);
            }
        }

        function _hideTimeTooltip() {
            if (_timeOverlay) {
                _timeOverlay.hide();
            }
        }

        function _positionTimeTooltip(evt) {
            _cbBounds = utils.bounds(_controlbar);
            _railBounds = utils.bounds(_timeRail);

            if (!_railBounds || _railBounds.width === 0) {
                return;
            }

            var position,
                width;
            if (_iFramedFullscreenIE()) {
                position = (evt.pageX ? (evt.pageX - _railBounds.left*100) : evt.x);
                width = _railBounds.width *100;
            } else {
                position = (evt.pageX ? (evt.pageX - _railBounds.left) : evt.x);
                width = _railBounds.width;
            }

            _timeOverlay.positionX(Math.round(position));
            _setTimeOverlay(_duration * position / width);
        }

        var _setTimeOverlay = (function() {
            var lastText;

            var thumbLoadedCallback = function(width) {
                _css.style(_timeOverlay.element(), {
                    'width': width
                });
                _positionOverlay('time', _timeOverlay);
            };

            return function(sec) {
                var thumbUrl = _timeOverlayThumb.updateTimeline(sec, thumbLoadedCallback);

                var text;
                if (_activeCue) {
                    text = _activeCue.text;
                    if (text && (text !== lastText)) {
                        lastText = text;
                        _css.style(_timeOverlay.element(), {
                            'width': (text.length > 32) ? 160 : ''
                        });
                    }
                } else {
                    text = utils.timeFormat(sec);
                    if (!thumbUrl) {
                        _css.style(_timeOverlay.element(), {
                            'width': ''
                        });
                    }
                }
                if (_timeOverlayText.innerHTML !== text) {
                    _timeOverlayText.innerHTML = text;
                }
                _positionOverlay('time', _timeOverlay);
            };
        })();

        function _styleTimeSlider() {

            if (!_elements.timeSliderRail) {
                _css.style(_elements.time, HIDDEN);
            }

            if (_elements.timeSliderThumb) {
                _css.style(_elements.timeSliderThumb, {
                    'margin-left': (_getSkinElement('timeSliderThumb').width / -2)
                });
            }else{

            }

            var cueClass = 'timeSliderCue',
                cue = _getSkinElement(cueClass),
                cueStyle = {
                    'z-index': 1
                };

            if (cue && cue.src) {
                _buildImage(cueClass);
                cueStyle['margin-left'] = cue.width / -2;
            } else {
                cueStyle.display = 'none';
            }
            _css(_internalSelector('.jw' + cueClass), cueStyle);

            _setBuffer(0);
            _setProgress(0);
        }

        function _addCue(timePos, text) {
            // test digits or percent
            if (/^[\d\.]+%?$/.test(timePos.toString())) {
                var cueElem = _buildImage('timeSliderCue'),
                    rail = _elements.timeSliderRail,
                    cue = {
                        position: timePos,
                        text: text,
                        element: cueElem
                    };

                if (cueElem && rail) {
                    rail.appendChild(cueElem);
                    cueElem.addEventListener('mouseover', function() {
                        _activeCue = cue;
                    }, false);
                    cueElem.addEventListener('mouseout', function() {
                        _activeCue = null;
                    }, false);
                    _cues.push(cue);
                }

            }
            _drawCues();
        }

        function _drawCues() {
            utils.foreach(_cues, function(idx, cue) {
                var style = {};
                if (cue.position.toString().slice(-1) === '%') {
                    style.left = cue.position;
                } else {
                    if (_duration > 0) {
                        style.left = (100 * cue.position / _duration).toFixed(2) + '%';
                        style.display = null;
                    } else {
                        style.left = 0;
                        style.display = 'none';
                    }
                }
                _css.style(cue.element, style);
            });
        }

        function _removeCues() {
            var rail = _elements.timeSliderRail;
            utils.foreach(_cues, function(idx, cue) {
                rail.removeChild(cue.element);
            });
            _cues.length = 0;
        }

        _this.setText = function(text) {
            _css.block(_id); //unblock on redraw
            var jwalt = _elements.alt,
                jwtime = _elements.time;
            if (!_elements.timeSliderRail) {
                _css.style(jwtime, HIDDEN);
            } else {
                _css.style(jwtime, text ? HIDDEN : SHOWING);
            }
            if (jwalt) {
                _css.style(jwalt, text ? SHOWING : HIDDEN);
                jwalt.innerHTML = text || '';
            }
            _redraw();
        };

        function _styleVolumeSlider(slider, vertical, left, right) {
            var prefix = 'volume' + (vertical ? '' : 'H'),
                direction = vertical ? 'vertical' : 'horizontal';

            _css(_internalSelector('.jw' + prefix + '.jw' + direction), {
                width: _getSkinElement(prefix + 'Rail', vertical).width + (vertical ? 0 :
                    (_getSkinElement(prefix + 'Cap' + left).width +
                        _getSkinElement(prefix + 'RailCap' + left).width +
                        _getSkinElement(prefix + 'RailCap' + right).width +
                        _getSkinElement(prefix + 'Cap' + right).width)
                ),
                height: vertical ? (
                    _getSkinElement(prefix + 'Cap' + left).height +
                    _getSkinElement(prefix + 'Rail').height +
                    _getSkinElement(prefix + 'RailCap' + left).height +
                    _getSkinElement(prefix + 'RailCap' + right).height +
                    _getSkinElement(prefix + 'Cap' + right).height
                ) : ''
            });

            slider.className += ' jw' + direction;
        }

        var _groups = {};

        function _buildLayout() {
            _buildGroup('left');
            _buildGroup('center');
            _buildGroup('right');
            _appendChild(_controlbar, _groups.left);
            _appendChild(_controlbar, _groups.center);
            _appendChild(_controlbar, _groups.right);
            _buildOverlays();

            _css.style(_groups.right, {
                right: _getSkinElement('capRight').width
            });
        }

        function _buildOverlays() {
            if (_elements.hd) {
               
                _hdOverlay = new html5.menu('hd', _id + '_hd', _skin, _switchLevel);
                if (!_isMobile) {
                   _addOverlay(_hdOverlay, _elements.hd, _showHd, _setHdTimer);
                } else {
                    _addMobileOverlay(_hdOverlay, _elements.hd, _showHd, 'hd');
                }

                _overlays.hd = _hdOverlay;

            }
            if (_elements.cc) {
                _ccOverlay = new html5.menu('cc', _id + '_cc', _skin, _switchCaption);
                if (!_isMobile) {
                    _addOverlay(_ccOverlay, _elements.cc, _showCc, _setCcTimer);
                } else {
                    _addMobileOverlay(_ccOverlay, _elements.cc, _showCc, 'cc');
                }
                _overlays.cc = _ccOverlay;
            }
            if (_elements.mute && _elements.volume && _elements.volume.vertical) {
               
                _volumeOverlay = new html5.overlay(_id + '_volumeoverlay', _skin);
                _volumeOverlay.setContents(_elements.volume);
               // _addOverlay(_volumeOverlay, _elements.mute, _showVolume);
                _overlays.volume = _volumeOverlay;
            }
        }

        function _setCcTimer() {
            _ccTimer = setTimeout(_ccOverlay.hide, 500);
        }

        function _setHdTimer() {
           // _hdTimer = setTimeout(_hdOverlay.hide, 500);
            _hdTimer = setTimeout(function() {
                _hdOverlay.hide();
                hdoverFlag=false; 
             }, 500); 
        }

        function _addOverlay(overlay, button, hoverAction,timer) {
           
            if (_isMobile) {
                return;
            }
            var element = overlay.element();
            _appendChild(button, element);
           
            button.addEventListener('mousemove', hoverAction, false);
            if (timer) {//hd----
                button.addEventListener('mouseout', timer, false);

            } else {//mute

                button.addEventListener('mouseout', overlay.hide, false);
            }
            _css.style(element, {//volume&hd position
                left: '75%',
                bottom:'45px'
            });
        }
     
        function _addMobileOverlay(overlay, button, tapAction, name) {
            if (!_isMobile) {
                return;
            }
            var element = overlay.element();
            _appendChild(button, element);
            var buttonTouch = new utils.touch(button);
            buttonTouch.addEventListener(utils.touchEvents.TAP, function() {
                _overlayTapHandler(overlay, tapAction, name);
            });
        }

        function _overlayTapHandler(overlay, tapAction, name) {
            if (name === 'cc') {
                if (_captions.length === 2) {
                    tapAction = _cc;
                }
                if (_ccTapTimer) {
                    _clearCcTapTimeout();
                    overlay.hide();
                } else {
                    _ccTapTimer = setTimeout(function() {
                        overlay.hide();
                        _ccTapTimer = undefined;
                    }, 4000);
                    tapAction();
                }
                _this.sendEvent(events.JWPLAYER_USER_ACTION);
            } else if (name === 'hd') {
                if (_levels.length === 2) {
                    tapAction = _hd;
                }
                if (_hdTapTimer) {
                    _clearHdTapTimeout();
                    overlay.hide();
                } else {
                    // TODO:: _.throttle
                    _hdTapTimer = setTimeout(function() {
                        overlay.hide();
                        _hdTapTimer = undefined;
                    }, 4000);
                    tapAction();
                }
                _this.sendEvent(events.JWPLAYER_USER_ACTION);
            }
        }

        function _buildGroup(pos) {
            var elem = _createSpan();
            elem.className = 'jwgroup jw' + pos;
            _groups[pos] = elem;
            if (_layout[pos]) {
                _buildElements(_layout[pos], _groups[pos], pos);
            }
        }

        function _buildElements(group, container, pos) {
            if (group && group.elements.length > 0) {
                for (var i = 0; i < group.elements.length; i++) {
                    var element = _buildElement(group.elements[i], pos);
                    if (element) {
                        if (group.elements[i].name === 'volume' && element.vertical) {
                            _volumeOverlay = new html5.overlay(_id + '_volumeOverlay', _skin);
                            _volumeOverlay.setContents(element);
                        } else {
                            _appendChild(container, element);
                        }
                    }
                }
            }
        }

        function _iFramedFullscreenIE() {
            return (_iFramed && utils.isIE() && _api.jwGetFullscreen());
        }

        function _redraw() {
            clearTimeout(_redrawTimeout);
            _redrawTimeout = setTimeout(_this.redraw, 0);
        }

        _this.redraw = function(resize) {
            _css.block(_id);

           
            
            _createStyles();

            // ie <= IE10 does not allow fullscreen from inside an iframe. Hide the FS button.
            var ieIframe = _iFramed && utils.isMSIE();
            var casting = _castState.active;
            _css.style(_elements.fullscreen, {
                display: (_audioMode || casting || _hideFullscreen || ieIframe) ? 'none' : ''
            });

            // TODO: hide these all by default (global styles at bottom), and update using classes when model changes:
            // jwinstream, jwaudio, jwhas-hd, jwhas-cc (see jwcancast)
	       //horizontal volume show-----
            _css.style(_elements.volumeH, {
               // display: _audioMode || _instreamMode ? 'block' : 'block'
                    display:'block',
                   //display:'none',
                   bottom: '-18px',
                   left:'5px'
            });
           
            var maxWidth = Math.floor(_settings.maxwidth);
            if (maxWidth) {
                if (_controlbar.parentNode && utils.isIE()) {
                    if (!_audioMode &&
                        _controlbar.parentNode.clientWidth > maxWidth + (Math.floor(_settings.margin) * 2)) {
                        _css.style(_controlbar, {
                            width: maxWidth
                        });
                    } else {
                        _css.style(_controlbar, {
                            width: ''
                        });
                    }
                }
            }

            if (_volumeOverlay) {
                _css.style(_volumeOverlay.element(), {
                    display: !(_audioMode || _instreamMode) ? 'block' : 'none'
                });
            }
            _css.style(_elements.hd, {
                display: !_audioMode && !casting && _hasHD() ? '' : 'none'
            });
            _css.style(_elements.cc, {
                display: !_audioMode && _hasCaptions() ? '' : 'none'
            });



            _drawCues();

            // utils.foreach(_overlays, _positionOverlay);

            _css.unblock(_id);

            if (_this.visible) {
                var capLeft  = _getSkinElement('capLeft'),
                    capRight = _getSkinElement('capRight'),
                    centerCss;
               if (_iFramedFullscreenIE()) {
                    centerCss = {
                       // left: Math.round(utils.parseDimension(_groups.left.offsetWidth*62) + capLeft.width),
                       // right: Math.round(utils.parseDimension(_groups.right.offsetWidth*86) + capRight.width)
                        left:  Math.round(capLeft.width),
                        right: Math.round(capRight.width)
                    };
                } else {
                    centerCss = {
                        //left: Math.round(utils.parseDimension(_groups.left.offsetWidth) + capLeft.width),
                       // right: Math.round(utils.parseDimension(_groups.right.offsetWidth) + capRight.width)
                        left:  Math.round(capLeft.width),
                        right: Math.round(capRight.width)
                    };
                }
                _css.style(_groups.center, centerCss);
            }

            if(controlFlag=='small' && isTween ){
               _controlbar.style.bottom='-36px';
            }
        };

        function _updateNextPrev() {
            if (!_adMode && _api.jwGetPlaylist().length > 1 && !_sidebarShowing()) {
                _css.style(_elements.next, NOT_HIDDEN);
                _css.style(_elements.prev, NOT_HIDDEN);
            } else {
                _css.style(_elements.next, HIDDEN);
                _css.style(_elements.prev, HIDDEN);
            }
        }

        function _positionOverlay(name, overlay) {
            if (!_cbBounds) {
                _cbBounds = utils.bounds(_controlbar);
            }
            var forceRedraw = true;
            overlay.constrainX(_cbBounds, forceRedraw);
            if(name=='hd'){
                overlay.positionY(55);
            }
        }


        _this.audioMode = function(mode) {
            if (mode !== undefined && mode !== _audioMode) {
                _audioMode = !!mode;
                _redraw();
            }
            return _audioMode;
        };

        _this.instreamMode = function(mode) {
            if (mode !== undefined && mode !== _instreamMode) {
                _instreamMode = !!mode;
                // TODO: redraw

                // instreamMode is when we add a second cbar overtop the original
                _css.style(_elements.cast, _instreamMode ? HIDDEN : NOT_HIDDEN);
            }
            return _instreamMode;
        };

        _this.adMode = function(mode) {
            if (_.isBoolean(mode) && mode !== _adMode) {
                _adMode = mode;

                if (mode) {
                    _removeFromArray(_jwhidden, _elements.elapsed);
                    _removeFromArray(_jwhidden, _elements.duration);
                } else {
                    _addOnceToArray(_jwhidden, _elements.elapsed);
                    _addOnceToArray(_jwhidden, _elements.duration);
                }

                _css.style([
                    _elements.cast,
                    _elements.elapsed,
                    _elements.duration
                ], mode ? HIDDEN : NOT_HIDDEN);

                _updateNextPrev();
            }

            return _adMode;
        };

        /** Whether or not to show the fullscreen icon - used when an audio file is played **/
        _this.hideFullscreen = function(mode) {
            if (mode !== undefined && mode !== _hideFullscreen) {
                _hideFullscreen = !!mode;
                _redraw();
            }
            return _hideFullscreen;
        };

        _this.element = function() {
            return _controlbar;
        };

        _this.margin = function() {
            return parseInt(_settings.margin, 10);
        };

        _this.height = function() {
            return _bgHeight;
        };


        function _setBuffer(pct) {
            if (_elements.timeSliderBuffer) {
                pct = Math.min(Math.max(0, pct), 1);
                _css.style(_elements.timeSliderBuffer, {
                    width: (pct * 100).toFixed(1) + '%',
                    opacity: pct > 0 ? 1 : 0
                });
            }
        }

        function _sliderPercent(name, pct) {
            if (!_elements[name]) {
                return;
            }
            //音量拖放不能到头修改---zhangli
            var _size=100 * Math.min(Math.max(0, pct), 1) + '%';
            if(name!='time'){//横向音量  82 * Math.min(Math.max(0, pct), 1) + '%';
                _size=82 * Math.min(Math.max(0, pct), 1) + '%';
            }//*/
            var vertical = _elements[name].vertical,
                prefix = name + (name === 'time' ? 'Slider' : ''),
                size = _size,
                progress = _elements[prefix + 'Progress'],
                thumb = _elements[prefix + 'Thumb'],
                style;

            if (progress) {
                style = {};
                if (vertical) {
                    style.height = size;
                    style.bottom = 0;
                } else {
                    style.width = size;
                }
              
                if (name !== 'volume') {
                    style.opacity = (pct > 0 || _dragging) ? 1 : 0;
                }
              
                _css.style(progress, style);
            }

            if (thumb) {
                style = {};
                if (vertical) {
                    style.top = 0;
                } else {
                    style.left = size;
                }
                _css.style(thumb, style);
            }
        }

        function _setVolume(pct) {
            _sliderPercent('volume', pct);
            _sliderPercent('volumeH', pct);
        }

        function _setProgress(pct) {
            _sliderPercent('time', pct);
        }

        function _getSkinElement(name) {
            var component = 'controlbar',
                elem, newname = name;
            if (name.indexOf('volume') === 0) {
                if (name.indexOf('volumeH') === 0) {
                    newname = name.replace('volumeH', 'volume');
                } else {
                    component = 'tooltip';
                }
            }
            elem = _skin.getSkinElement(component, newname);
            if (elem) {
                return elem;
            } else {
                return {
                    width: 0,
                    height: 0,
                    src: '',
                    image: undefined,
                    ready: false
                };
            }
        }

        function _appendChild(parent, child) {
            parent.appendChild(child);
        }


        //because of size impacting whether to show duration/elapsed time,
        // optional resize argument overrides the this.visible return clause.
         //rail---big --small---
       var bigTime,smallTime,isbig=true;
        _this.railBig = function(){
                     
            _timeRail.style.height='20px';
            _timeRail.style.bottom='10px';
            if(timeThumb) {   
             timeThumb.style.visibility="visible";
            }
	   }
        _this.railSmall=function(){

           
            _timeRail.style.height='2px';
            _timeRail.style.bottom='18px';  
            if(timeThumb) {      
                timeThumb.style.visibility="hidden";
            }
        }
        //控制栏移动--------------------------------------------

        var controlFlag='small';
        var bigbarTime,smallbarTime,isTween=true;
        var  _controlsTimeout = false;

        
        _this.show = function(resize) {
           /* if (_this.visible && !resize) {
                return;
            }*/
            if(controlFlag=='big' && !resize)
            {
               return; 
            }
            if(!isTween || controlFlag=='big')
            {
               // console.log("gobig-------back------isTween="+isTween+'  controlFlag:'+controlFlag);
                return;
            }
            if(_api.jwGetFullscreen()){ 
                var thistime=(new Date()).getTime();
                var intervalTime=thistime-fullsmallTime;

               // console.log(resize+'intervaltime='+intervalTime+'fullfirst='+fullfirst);
                if(_api.jwGetState()!=states.PAUSED)
                {
                    if(fullfirst && intervalTime<2000)
                    {
                   
                       return;
                    }
                    if(!fullfirst && intervalTime<1000){
                       
                       return;
                    }
                    fullfirst=false;
                }
            }
            _this.visible = true;

            var style = {
                display: 'inline-block'
            };

            _css.style(_controlbar, style);
            _cbBounds = utils.bounds(_controlbar);

            _toggleTimesDisplay();

            _css.block(_id); //unblock on redraw
            _css.style(_controlbar, {
                    opacity: 1
                });
            _volumeHandler();
           // _redraw();
            controlBig (resize);
        };

        var fullsmallTime=0;
        var controlbarupTime=0;


        function controlBig (s){
            if(isTween==false)
            {
                return;
            }
         
            clearInterval(bigbarTime);
            clearInterval(smallbarTime);
            var speed=-36;
            _controlbar.style.bottom='-36px';
            controlbarupTime=(new Date()).getTime();
            _controlsTimeout=false;
            isTween=false;
            bigbarTime = setInterval(function() 
            {
                   
                    speed+=2;
                    _controlbar.style.bottom=speed+'px';
                    if(speed==0){
                        clearInterval(bigbarTime);
                        _controlbar.style.bottom='0px';
                        controlFlag='big';
                        isTween=true;  
                        _clearHideTimeout();
                        _hideTimeout = setTimeout(function() {
                            _controlbar.style.bottom='0px';
                        }, 0);
                    }
                        
            }, 10)
          
        }

        _this.hide = function() {

            /*if (!_this.visible) {//hide
                return;
            }*/
            if(controlFlag=='small')
            {
               return;  
            }
            // Don't hide for mobile ads if controls are enabled
            if (_instreamMode && _isMobile && _api.jwGetControls()) {
                return;
            }
           
           /* _this.visible = false;
            _css.style(_controlbar, {
                opacity: 0
            });*/
           
            var interval=(new Date()).getTime();
            if((interval-controlbarupTime)<2000)
            {
                return;
            }
            controlSmall();
        };

        function controlSmall(){
            if(isTween && controlFlag=='big'){

                clearInterval(bigbarTime);
                clearInterval(smallbarTime);

                _clearHideTimeout();
                _hideTimeout = setTimeout(function() {
                    _css.style(_controlbar, {
                         opacity: 1
                    });
                }, JW_VISIBILITY_TIMEOUT);

             
               _controlsTimeout=false;
                var speed=0;
                _this.railSmall();
                smallbarTime = setInterval(function() {
                  
                    isTween=false;
                    speed+=-2;
                    _controlbar.style.bottom=speed+'px';
                    if(speed==-36){
                        
                        _controlbar.style.bottom='-36px';
                        clearInterval(smallbarTime);  
                        isTween=true;
                        controlFlag='small';
                        if(_api.jwGetFullscreen()){
                            fullsmallTime=(new Date()).getTime();
                        }
                       _controlsTimeout=true;
                        _clearHideTimeout();
                        _hideTimeout = setTimeout(function() {
                            _controlbar.style.bottom='-36px';
                        }, JW_VISIBILITY_TIMEOUT);
                       
                       
                    }
                        
                }, 10)
            }
        }
        

          _this.showVolume=function() {
            if (_audioMode || _instreamMode) {
                return;
            }

            _css.block(_id); // unblock on position overlay
            _volumeOverlay.show();
            _positionOverlay('volume', _volumeOverlay);
            _hideOverlays('volume');
        }
        _this.hideVolume=function(){
             _volumeOverlay.hide();
        }
        _this.showTemp = function() {
            if (!this.visible) {
                _controlbar.style.opacity = 0;
                _controlbar.style.display = 'inline-block';
            }
        };

        _this.hideTemp = function() {
            if (!this.visible) {
                _controlbar.style.display = 'none';
            }
        };


        function _clearHideTimeout() {
            clearTimeout(_hideTimeout);
            _hideTimeout = -1;
        }

        function _clearCcTapTimeout() {
            clearTimeout(_ccTapTimer);
            _ccTapTimer = undefined;
        }

        function _clearHdTapTimeout() {
            clearTimeout(_hdTapTimer);
            _hdTapTimer = undefined;
        }

        function _loadCues(vttFile) {
            if (vttFile) {
                utils.ajax(vttFile, _cueLoaded, _cueFailed, true);
            } else {
                _cues.length = 0;
            }
        }

        function _cueLoaded(xmlEvent) {
            var data = new jwplayer.parsers.srt().parse(xmlEvent.responseText, true);
            if (!_.isArray(data)) {
                return _cueFailed('Invalid data');
            }
            _this.addCues(data);
        }

        _this.addCues = function(cues) {
            utils.foreach(cues, function(idx, elem) {
                if (elem.text) {
                    _addCue(elem.begin, elem.text);
                }
            });
        };

        function _cueFailed(error) {
            utils.log('Cues failed to load: ' + error);
        }

        window.controlbar_jw=_this;
        // Call constructor
        _init();

    };

    /***************************************************************************
     * Player stylesheets - done once on script initialization; * These CSS
     * rules are used for all JW Player instances *
     **************************************************************************/

    (function() {
        var JW_CSS_ABSOLUTE = 'absolute',
            JW_CSS_RELATIVE = 'relative',
            JW_CSS_SMOOTH_EASE = 'opacity .25s, background .25s, visibility .25s',
            CB_CLASS = 'span.jwcontrolbar';

        _css(CB_CLASS, {
            position: JW_CSS_ABSOLUTE,
            margin: 'auto',
            opacity: 0,
            display: 'none'
        });

        _css(CB_CLASS + ' span', {
            height: '100%'
        });
    
        utils.dragStyle(CB_CLASS + ' span', 'none');

        _css(CB_CLASS + ' .jwgroup', {
            display: 'inline'
        });

        _css(CB_CLASS + ' span, ' + CB_CLASS + ' .jwgroup button,' + CB_CLASS + ' .jwleft', {
            position: JW_CSS_RELATIVE,
            'float': 'left'
        });

         _css( CB_CLASS + ' .jwleft', {//¿ØÖÆÀ¸×ó±ß¾àÀë
           // position: JW_CSS_RELATIVE,
         
            left: 17,
            bottom:-4
        });
        _css(CB_CLASS + ' .jwright', {//¿ØÖÆÀ¸ÓÒ±ß°´Å¥Î»ÖÃ
            position: JW_CSS_RELATIVE,
             'float': 'right',
             left:-17,
             bottom:-4

        });

        _css(CB_CLASS + ' .jwcenter', {//Õâ¸ö¸Ä±äÊ±¼ä¿ØÖÆÀ¸µÄÎ»ÖÃ
            position: JW_CSS_ABSOLUTE,
	    	left:0,
    		right:0,
    		height:12,
    		top:8
        });


        _css(CB_CLASS + ' button', {
            display: 'inline-block',
            height: '100%',
            border: 'none',
            cursor: 'pointer'
        });

        _css(CB_CLASS + ' .jwcapRight,' + CB_CLASS + ' .jwtimeSliderCapRight,' + CB_CLASS + ' .jwvolumeCapRight', {
            right: 0,
            position: JW_CSS_ABSOLUTE
        });

        _css(CB_CLASS + ' .jwcapBottom', {
            bottom: 0,
            position: JW_CSS_ABSOLUTE
        });

        _css(CB_CLASS + ' .jwtime', {
            position: JW_CSS_ABSOLUTE,
            height: '100%',
            width: '100%',
            left: 0
        });

        _css(CB_CLASS + ' .jwthumb', {
            position: JW_CSS_ABSOLUTE,
            height: '100%',

            cursor: 'pointer'
        });
        ///*
        //jwvolumeHThumb jwthumb
        _css(CB_CLASS+' .jwvolumeHThumb', {
            bottom:'12px',
            width: '15px',
            height: '16px'

        });
        _css(CB_CLASS+' .jwvolumeHThumb. jwthumb', {
            
            width: '15px'
        });
     _css(CB_CLASS+' .jwmute', {
            left: '-7px'
           
        });
//*/
        _css(CB_CLASS+' .jwspeed', {
            left: '5px'
        });
   
        _css(CB_CLASS+' .jwtext.jwelapsed.jwhidden', {
            left: '-10px'
        });
         _css(CB_CLASS + ' .jwrail', {
            position: JW_CSS_ABSOLUTE,
            // height:4,
            cursor: 'pointer',
            bottom:'18px'
        });

        _css(CB_CLASS + ' .jwrailgroup', {
            position: JW_CSS_ABSOLUTE,
            width: '100%'
        });

        _css(CB_CLASS + ' .jwrailgroup span', {
            position: JW_CSS_ABSOLUTE
        });

        _css(CB_CLASS + ' .jwdivider+.jwdivider', {
            display: 'none'
        });

        _css(CB_CLASS + ' .jwtext', {
            padding: '0 5px',
            'text-align': 'center'
        });

        _css(CB_CLASS + ' .jwcast', {
            display: 'none'
        });

        _css(CB_CLASS + ' .jwcast.jwcancast', {
            display: 'block'
        });

        _css(CB_CLASS + ' .jwalt', {
            display: 'none',
            overflow: 'hidden'
        });

        // important
        _css(CB_CLASS + ' .jwalt', {
            position: JW_CSS_ABSOLUTE,
            left: 0,
            right: 0,
            'text-align': 'left'
        }, true);

        _css(CB_CLASS + ' .jwoverlaytext', {
            padding: 3,
            'text-align': 'center'
        });

        _css(CB_CLASS + ' .jwvertical *', {
            display: 'block'
        });

        // important
        _css(CB_CLASS + ' .jwvertical .jwvolumeProgress', {
            height: 'auto'
        }, true);

        _css(CB_CLASS + ' .jwprogressOverflow', {
            position: JW_CSS_ABSOLUTE,
            overflow: 'hidden'
        });

        _setTransition(CB_CLASS, JW_CSS_SMOOTH_EASE);
        _setTransition(CB_CLASS + ' button', JW_CSS_SMOOTH_EASE);
        _setTransition(CB_CLASS + ' .jwtoggling', 'none');
    })();

})(window, document);
