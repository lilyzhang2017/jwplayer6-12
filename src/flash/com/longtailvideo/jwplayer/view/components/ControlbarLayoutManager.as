package com.longtailvideo.jwplayer.view.components {
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import flash.text.TextField;
	
	
	public class ControlbarLayoutManager {
		protected var _controlbar:ControlbarComponent;
		protected var _currentLeft:Number;//左边距-----
		protected var _currentRight:Number;//右边距-----
		protected var _height:Number;
		
		protected var _tabLeft:Number;
		protected var _tabRight:Number;
		private   var width_zl:Number;
		public function ControlbarLayoutManager(controlbar:ControlbarComponent) {
			_controlbar = controlbar;
		}
		
		
		public function resize(width:Number, height:Number):void {
			if (width && height){
				_height = height;
				_currentLeft = 17;
				width_zl=width;
				if (_controlbar.getButton('capLeft')){
					_currentLeft += _controlbar.getButton('capLeft').width;
				}
				_currentRight = width;
				if (_controlbar.getButton('capRight')){
					_currentRight -= _controlbar.getButton('capRight').width;
				}
				var result:Object = (/\[(.*)\]\[(.*)\]\[(.*)\]/).exec(_controlbar.layout);
				
				_tabLeft = 300;
				_tabRight = 399;
				
				position(result[1], "left");
				position(result[3], "right");
				positionCenter();
			}
		}
		
		
		private function position(group:String, align:String):void {
			var items:Array = group.split(/(<[^>]*>)/);
			if (align == "right") { items = items.reverse(); }
			for  (var i:Number = 0; i < items.length; i++) {
				var item:String = items[i];
				if (item) {
					var dividerMatch:Array = (/<(.*)>/).exec(item);
					if (dividerMatch) {
						if (isNaN(dividerMatch[1])) {
							place(_controlbar.getButton(dividerMatch[1]), align);
						} else {
							var space:Number = Number(dividerMatch[1]);
							
							if (align == "left") {
								_currentLeft += space;
							} else if (align == "right") {
								_currentRight -= space;
							}
						}
						
					} else {
						var spacers:Array = item.split(" ");
						if (align == "right") { spacers = spacers.reverse(); }
						for (var j:Number = 0; j < spacers.length; j++) {
							var name:String = spacers[j];
							var button:DisplayObject = _controlbar.getButton(name);
							place(button, align);
						}
					}
				}
			}
		}
		
		private function place(displayObject:DisplayObject, align:String):void {
			var displayObjectSprite:Sprite = displayObject as Sprite;
			if (align == "left") {
				if (displayObjectSprite && displayObjectSprite.buttonMode) {
					//displayObjectSprite.tabIndex = _tabLeft++;
				}
				placeLeft(displayObject);
			} else if (align == "right") {
				if (displayObjectSprite && displayObjectSprite.buttonMode) {
					//displayObjectSprite.tabIndex = _tabRight--;
				}
				placeRight(displayObject);
			}
		}
		
		
		private function placeLeft(displayObject:DisplayObject):void {
			if (displayObject) {
				displayObject.visible = true;
				if (!_controlbar.contains(displayObject)) {
					_controlbar.addChild(displayObject);
				}
				
				var doc:DisplayObjectContainer = displayObject as DisplayObjectContainer;
				if (doc && doc.getChildByName('text') is TextField && !doc.getChildByName('back') ) {
					_currentLeft += 17;
				} else if (displayObject is Slider && (displayObject as Slider).capsWidth == 0) {
					
					_currentLeft += 17;
				}
				
				displayObject.x = _currentLeft;	
				displayObject.y = (_height - displayObject.height) / 2+1;
				//ExternalInterface.call("jstoFlash","left--"+displayObject.x+displayObject.name+_currentLeft);
				//+20是左边Icon 的间距
				_currentLeft = _currentLeft + displayObject.width+17;								

				if (doc && doc.getChildByName('text') is TextField && !doc.getChildByName('back')) {
					_currentLeft += 0;
				} else if (displayObject is Slider && (displayObject as Slider).capsWidth == 0) {
					_currentLeft += 0;
				}
			}
		}
		
		
		private function placeRight(displayObject:DisplayObject):void {
			if (displayObject) {
				displayObject.visible = true;
				if (!_controlbar.contains(displayObject)) {
					_controlbar.addChild(displayObject);
				}
				_currentRight -= 17;
				var doc:DisplayObjectContainer = displayObject as DisplayObjectContainer;
				if (doc && doc.getChildByName('text') is TextField && !doc.getChildByName('back')) {
					_currentRight -= 0;
				} else if (displayObject is Slider && (displayObject as Slider).capsWidth == 0) {
					_currentRight -= 0;
				}
				//-20是右边Icon 的间距
				_currentRight = _currentRight - displayObject.width-17;
				displayObject.x = _currentRight+17;
				displayObject.y = (_height - displayObject.height) / 2+1;
				//ExternalInterface.call("jstoFlash","right--"+displayObject.x+displayObject.name+_currentRight);
				
				if (doc && doc.getChildByName('text') is TextField && !doc.getChildByName('back')) {
					_currentRight -= 0;
				} else if (displayObject is Slider && (displayObject as Slider).capsWidth == 0) {
					_currentRight -= 0;
				}
			}
		}
		
		
		private function positionCenter():void {
			//var elementWidth:Number = (_currentRight - _currentLeft);
			 var  elementWidth:Number=width_zl;
			var time:Slider = _controlbar.getButton("time") as Slider;
			 
			var alt:Sprite = _controlbar.getButton("alt") as Sprite;
			if (time) {
				time.resize(elementWidth, time.height);
				if (!_controlbar.contains(time)) _controlbar.addChild(time);
				//time.x = _currentLeft;	
				//time.y = (_height - time.height) / 2;
				time.x = 0;	
				time.y = (_height - time.height) / 2-22;
				//ExternalInterface.call("jstoFlash",time.y)
				
			}

			if (alt) {
				var bg:DisplayObject = alt.getChildByName('back');
				bg.width  = elementWidth;
				
				var text:TextField = alt.getChildByName('text') as TextField;
				text.y = (bg.height - text.height) / 2;
				
				if (!_controlbar.contains(alt)) _controlbar.addChild(alt);
				alt.x = _currentLeft;	
				alt.y = (_height - alt.height) / 2;

				_controlbar.setAltMask(elementWidth,bg.height);
			}
			
			
		}
	}
}