package com.longtailvideo.jwplayer.view.components
{
	import com.longtailvideo.jwplayer.utils.Animations;
	import com.longtailvideo.jwplayer.utils.Configger;
	import com.longtailvideo.jwplayer.utils.RootReference;
	
	import flash.display.Graphics;
	import flash.display.MovieClip;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.geom.ColorTransform;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	//import fl.controls.CheckBox;
	//import imooc.swc.setwin;
	public class ToolSetOverlay extends MovieClip
	{
		
		//private var overlay:MovieClip=new MovieClip();

		private var isPlayMc:MovieClip;
		private var isPlay_cb:MovieClip;
		protected var fade:Animations;
		private var flashBtn:MovieClip=new MovieClip();
		private var h5Btn:MovieClip=new MovieClip();
		private var ish5:Boolean;
		private var isnext:Boolean=true;
		private var isautoplay:Boolean;
		public function ToolSetOverlay(_ish5,_isnext)
		{
			
			super();
			ish5=_ish5;
			isnext=_isnext;
			if(_isnext =="false"||_isnext==false){
				_isnext=false;
			}else{
				isnext=true;
			}

			
			isautoplay=Configger._playAuto;
			fade = new Animations(this);
			
			createBg();
		}
		
		private function createBg():void
		{

			var bg:Shape=new Shape();
			bg.graphics.beginFill(0x14191e,0.9);
			if(isnext){//show next
				bg.graphics.drawRect(0,0,265,140);
				
			}else{
				bg.graphics.drawRect(0,0,265,98);
				
			}
			
			bg.graphics.endFill();
			
			this.addChild(bg);
			
			h5Btn = createOverBg("HTML5",14);
			flashBtn = createOverBg("FLASH",14);
			this.addChild(h5Btn);
			this.addChild(flashBtn);
			h5Btn.x = 20;
			h5Btn.y = 40;
			flashBtn.x = 140;
			flashBtn.y = 40;
			
			var titleTxt:TextField = createTxt("默认播放器","12","0x787d82");
			
			titleTxt.x = 20;
			titleTxt.y = 12;
			this.addChild(titleTxt);
			
			
			flashBtn.active=true;
			setActiveColor(flashBtn);
			
			//line
			var line:Shape=new Shape();
			
			line.graphics.moveTo(20,90);
			line.graphics.lineStyle(1,0xffffff,0.16);
			line.graphics.lineTo(240,90);
			this.addChild(line);
			//check box---
			//check box------
			
			if(isnext){
			//html5
				var aotuPlayTxt:TextField = createTxt("自动播放下一节","14","0xb5b9bc");
				
				aotuPlayTxt.x = 50;
				aotuPlayTxt.y = 105;
				this.addChild(aotuPlayTxt);
				
				isPlay_cb=createCheckBox();
				this.addChild(isPlay_cb);
				isPlay_cb.x=20;
				isPlay_cb.y=109;
				//读取本地保存数据-返回是否连续播放--
				loacalShare();
				
			}
			if(ish5==false){
				setDisButton(h5Btn);
			}
		}
		
		//设置不可选择
		private function setDisButton(mc:MovieClip):void
		{
			
			mc.graphics.lineStyle(1, 0x4D5559);
			mc.graphics.beginFill(0x14191e,0.9);
			mc.graphics.drawRect(0, 0, 100, 30);
			mc.graphics.endFill();
			
			var txt:TextField = mc.getChildAt(0) as TextField;
			txt.textColor = 0x4D5559;
			

		}
		private function createOverBg(str:String,size:uint):MovieClip
		{
			var mc: MovieClip = new MovieClip();
			mc.graphics.lineStyle(1, 0x4D5559);
			mc.graphics.beginFill(0x14191e,0.9);
			mc.graphics.drawRect(0, 0, 100, 30);
			mc.graphics.endFill();
			
			var txt: TextField = new TextField();
			txt.width = 52;
			txt.height = 20;
			// 如果禁用html5 ,html5按钮不可点击；
			if(ish5==false && str=='HTML5'){
				
				txt.defaultTextFormat = new TextFormat("Microsoft Yahei",size,0x4D5559,null,null,null,null,null);
			}else{
				txt.defaultTextFormat = new TextFormat("Microsoft Yahei",size,0xB5B9BC,null,null,null,null,null);
				
			}
			mc.buttonMode=false;
			if(ish5==true && str=="HTML5"){
				mc.buttonMode=true;
				mc.addEventListener(MouseEvent.MOUSE_OVER, over);
				mc.addEventListener(MouseEvent.MOUSE_OUT, out);
				mc.addEventListener(MouseEvent.CLICK, dj);
			}
			txt.text = str;
			txt.selectable = false;
			txt.mouseEnabled = false;
			txt.x = Math.abs(mc.width - txt.width) / 2;
			txt.y = Math.abs(mc.height - txt.height) / 2-2 ;
			mc.addChild(txt);
			
			txt.name = "txt";
			mc.active=false;
			
			mc.name=str;
			return mc;
		}
		
		// create text
		private function createTxt(str:String,size:String,color:String):TextField
		{
			var txt:TextField=new TextField();
			txt.autoSize = TextFieldAutoSize.LEFT;
			txt.defaultTextFormat = new TextFormat("Microsoft Yahei",size,color,null,null,null,null,null);
			txt.text = str;
			txt.mouseEnabled = false;
			return txt;
		}
		
		private function over(e: MouseEvent):void
		{
			var mc:MovieClip = e.currentTarget as MovieClip;
			if(mc.active){
				return
			}
			mc.graphics.lineStyle(1, 0x7E888C);
			mc.graphics.beginFill(0x14191e,0.9);
			mc.graphics.drawRect(0, 0, 100, 30);
			mc.graphics.endFill();
			
			var txt:TextField = mc.getChildAt(0) as TextField;
			txt.textColor = 0xFFFFFF;
			
		}
		private function dj(e: MouseEvent):void
		{
			var mc:MovieClip = e.currentTarget as MovieClip;
			if(mc.active){
				return
			}
			mc.active=true;
			var otherBtn:MovieClip;
			if(mc.name=="FLASH"){
				h5Btn.active=false;
				changeOtherColor(h5Btn);;
			}else{
				flashBtn.active=false;
				changeOtherColor(flashBtn);
				ExternalInterface.call("switchjwplayer","html5");
				
			}
			setActiveColor(mc);
		}
		
		private function out(e: MouseEvent):void
		{
			
			var mc:MovieClip = e.currentTarget as MovieClip;
			//mc.graphics.lineStyle(1, 0x4D5559);
			var txt:TextField = mc.getChildAt(0) as TextField;
			
			if(mc.active){
				mc.graphics.lineStyle(1, 0xF01400);
				mc.graphics.beginFill(0xF01400);
				txt.textColor = 0xFFFFFF;
			
			}else{
				mc.graphics.lineStyle(1, 0x4D5559);
				mc.graphics.beginFill(0x14191e,0.9);
				txt.textColor = 0xB5B9BC;
			}
			mc.graphics.drawRect(0, 0, 100, 30);
			mc.graphics.endFill();
		}
		private function setActiveColor(mc:MovieClip):void{
			
			mc.graphics.lineStyle(1, 0xF01400);
			mc.graphics.beginFill(0xF01400);
			mc.graphics.drawRect(0, 0, 100, 30);
			mc.graphics.endFill();
			var txt:TextField = mc.getChildAt(0) as TextField;
			txt.textColor = 0xFFFFFF;
			

		}
		private function changeOtherColor(otherBtn:MovieClip):void{
			
			//trace("flash:",flashBtn.active,"h5:",h5Btn.active)
			var txt:TextField = otherBtn.getChildAt(0) as TextField;
			otherBtn.graphics.lineStyle(1, 0x4D5559);
			otherBtn.graphics.beginFill(0x14191e,0.9);
			txt.textColor = 0xB5B9BC;
			otherBtn.graphics.drawRect(0, 0, 100, 30);
			otherBtn.graphics.endFill();
		}
		//createCheckBo--------
		private function createCheckBox():MovieClip{
			var mc:MovieClip = new MovieClip;
			
			mc.graphics.lineStyle(1, 0x4d5559);
			mc.graphics.beginFill(0x14191e,0.9);
			mc.graphics.drawRect(0, 0, 16, 16);
			mc.graphics.endFill();
			mc.buttonMode=true;
			
			isPlayMc = createSelect();
			
			mc.addChild(isPlayMc);
			mc.addEventListener(MouseEvent.MOUSE_OVER, checkBoxOver);
			mc.addEventListener(MouseEvent.MOUSE_OUT, checkBoxOut);
			mc.addEventListener(MouseEvent.CLICK, checkBoxClick);
			return mc;
		}
		
		private function createSelect():MovieClip{
			var line:MovieClip = new MovieClip();
			line.graphics.moveTo(3,7);
			line.graphics.lineStyle(2,0x009900);
			line.graphics.lineTo(7,12);
			line.graphics.lineTo(13,4);
			line.graphics.endFill()
			return line;
		}
		private function checkBoxOver(e:MouseEvent):void{
			isPlayMc.visible=true;
			var mc:MovieClip = e.currentTarget as MovieClip;;
			mc.graphics.lineStyle(1, 0x7E888C);
			mc.graphics.beginFill(0x14191e,0.9);
			mc.graphics.drawRect(0, 0, 16, 16);
			mc.graphics.endFill();
			
			
		}
		private function checkBoxOut(e:MouseEvent):void{
			
			var mc:MovieClip = e.currentTarget as MovieClip;;
			mc.graphics.lineStyle(1, 0x4d5559);
			mc.graphics.beginFill(0x14191e,0.9);
			mc.graphics.drawRect(0, 0, 16, 16);
			mc.graphics.endFill();
			setIsPlayFlag();
			
		}
		import com.longtailvideo.jwplayer.player.JavascriptAPI;
		private function checkBoxClick(e:MouseEvent):void{
			
			isPlayMc.flag=!isPlayMc.flag;
			isPlayMc.visible=isPlayMc.flag;
			if(isPlayMc.flag==null){
				isPlayMc.flag=false;
			}
			//通知页面是否需要连续播放---save to flash cookie
			Configger.saveCookie('playAuto', isPlayMc.flag);//name,value
			//将flash 保存信息保存到浏览器缓存。
			JavascriptAPI.callJS("function(state) { try { jwplayer.utils.saveCookie('playAuto', state) } catch(e) {} }", isPlayMc.flag);
			//ExternalInterface.call("playContinue",isPlayMc.flag);

		}
		private function setIsPlayFlag():void{
			
			if(isPlayMc.flag){
				isPlayMc.visible=true;
			}else{
				isPlayMc.visible=false;
			}
			
		}
		

		private function loacalShare():void
		{
			var isPlay=isautoplay;
		
			switch(isPlay){
				//case "null":
				//case "undefined":
				case "false":
				case false:
					isPlayMc.flag=false;
					break;
				
				case "true":
				case true:
					isPlayMc.flag=true;
					break;
			}
			if(isPlayMc.flag){
				isPlayMc.visible=true;
			}else{
				isPlayMc.visible=false;
			}
		}
		
		public function hide():void {
			fade.cancelAnimation();
			fade.fade(0);
		}
		public function show():void {
			fade.cancelAnimation();
			fade.fade(1);
			
		}
	}
}