package com.longtailvideo.jwplayer.player.imoocAddClass {
	import com.greensock.TweenLite;
	import com.longtailvideo.jwplayer.utils.Base64Decoder;
	import com.longtailvideo.jwplayer.utils.RootReference;
	
	import flash.display.Graphics;
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.navigateToURL;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.utils.ByteArray;
	
	public class ErrorWindow  extends MovieClip{
		
		
		static private var _instance:ErrorWindow; 
		
		private var pauseBase64:String="iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZmE4ZmU1YS1lZmEyLWI0NGQtODNhYy1lYzE1NWI4MzNmYjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUM0QzIyOTY5MThEMTFFNThBQTNFOTdEMzE1NkM4NUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUM0QzIyOTU5MThEMTFFNThBQTNFOTdEMzE1NkM4NUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REQ0NEVCQzUyRjg3MTFFNUEwMTZDMDZBRjlEMDUzNzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REQ0NEVCQzYyRjg3MTFFNUEwMTZDMDZBRjlEMDUzNzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7YPjWwAAAAdElEQVR42uzasQ2AMAxFwW/ErOwEy5ouTRoEBUXu1Y6lk9tUkjMLtWWxgIGBgYGBgYGBgYHftX953N3Hk7mquv7Y58LAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAo4rftMDAwMDAwMDAwMDAwHO3AAMAfw4Jq71QhG8AAAAASUVORK5CYII=";
		private var playBase64:String="iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZmE4ZmU1YS1lZmEyLWI0NGQtODNhYy1lYzE1NWI4MzNmYjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkNFNjM4NEI5MThEMTFFNTkzMDRCNzZDRjkwQ0Y5MTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkNFNjM4NEE5MThEMTFFNTkzMDRCNzZDRjkwQ0Y5MTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REQ0NEVCQzUyRjg3MTFFNUEwMTZDMDZBRjlEMDUzNzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REQ0NEVCQzYyRjg3MTFFNUEwMTZDMDZBRjlEMDUzNzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ZitpPAAACsElEQVR42uyaS08aURSAUYpAZSXjtrW4gkKXPKZrKcENRvAH8AgJz2hi/BUSQiBQ/gIEwitRu6sBgYEVOAEW1K55rCCBTqK9N6lJt7UDXLn3rGYz9+bLmfudc25mQyAQfBVgFJsCzIIAE2ACTIAJMAEmwASYABNgFIFrtZpRo9HIsAHWarV7DMPYwuGwWiwWb2LxSQNQUTAYpFmWtRweHlLYnGGFQkHl83lLJpOh5XK5CAtpbYI4OjpS93o9m9/v38PG0js7O7JIJGKsVqtGtVq9jU1Z0ul0UGonoVBILRKJNrCowxKJRHR6ekp3Oh2L2Wym1h74L6ntFgoFSzqdNixTaiutlVBqx8fHGig1r9f7HpvWEkotGo1+ubu7O1CpVNtrD/wcer3+Q7PZtEGpCYXCjbUH/iO1LSi1brdrMZlM1NoDP8f+/v5uqVSypFIpPZ9SQ3o8hFKzWq2fQAmzeTyed9jMwxRFyWKxmKlSqRwolcq32FwAGAwGKLWTy8vLjy+V2qu78ZBKpVtnZ2efs9ksjQXwbDb7BcpWBUxhlZe8/+Y1wYLG5IfT6aywLDtd6zM8Go0mPp/vmqbpb/8Di3yGH0GAs3rvdrsbAJrjY01kgfv9/gAMFLdXV1dDPtdFDhhIiYvH48zFxcU9x3FPfK+PFHC1Wn1wuVzldrs9XdQeSEhrPB5P/H7/NWgsbhYJu/IMQynlcjkWZJXhS0rIAgMpDQOBwHcwEQ2Xue/SgefzOZdIJJjz8/OFSAkp4Hq9/uBwOMqLPqcrlxaQ0jQYDN7odLqbVcIuPMPASU9ASrBTYgaDASdAIBYGDKUEsnpbLBYHKNV63oGhlJLJZANKCTw/otbJ8QrcaDR+2u32cqvVmqDao8NrEvK/NAEmwASYABNgAkyACTABJsD/Hr8FGAASoQ9aN88ErAAAAABJRU5ErkJggg==";
		var xx:int;
		var yy:int;
		//error---
		public var errorWin:MovieClip=new MovieClip();
		
		public function ErrorWindow(singleEnforce:SingleEnforce)
		{
			
		}
		public static function getInstance() : ErrorWindow
		{
			if (ErrorWindow._instance == null)
			{
				ErrorWindow._instance = new ErrorWindow(new SingleEnforce());
			}
			
			return ErrorWindow._instance;
		}
		
		
	public function hideErrorwin(){

		errorWin.visible=false;
	}
	
	public function showErrorWin():void{
	
		errorWin.visible=true;
		RootReference.stage.addChild(errorWin);
		
		var w:int=RootReference.stage.stageWidth;
		var h:int=RootReference.stage.stageHeight;
		var bg:Shape=new Shape();
		bg.graphics.beginFill(0x000000,1);
		//bg.graphics.drawRect(0,0,400,200);
		bg.graphics.drawRect(0,0,w,h);
		bg.graphics.endFill();
		errorWin.addChild(bg);
		//errorWin.x=RootReference.stage.stageWidth/2-163;
		//errorWin.y=RootReference.stage.stageHeight/2-100;
		xx=w/2-163;
		yy=h/2-100;
		//error---
		var errBase64:String="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";
		var errByteArr:ByteArray = Base64Decoder.decode(errBase64);
		var errLoader:Loader = new Loader();
		errLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, onErrImageLoaded);
		errLoader.loadBytes(errByteArr);
		
		var t1:TextField=new TextField();
		t1.defaultTextFormat=new TextFormat("Microsoft Yahei",16,0xffffff,null,null,null,null,null,"left",null,null,null,null);
		t1.text="咦？加载失败了！";
		t1.width=150;
		t1.x=xx+85;
		t1.y=yy+50;
		errorWin.addChild(t1);
		t1.selectable =false;
	
		// or
		var t3:TextField=new TextField();
		t3.defaultTextFormat=new TextFormat("Microsoft Yahei",12,0x787d82,null,null,null,null,null,"left",null,null,null,null);
		t3.text="首先联络网络管理员，确认是否屏蔽swf/flv/mp4";
		t3.width=300;
		t3.x=xx+85;
		t3.y=yy+82;
		errorWin.addChild(t3);
		t3.selectable =false;
		// or还是无法观看？请查看---
		var t5:TextField=new TextField();
		t5.defaultTextFormat=new TextFormat("Microsoft Yahei",12,0x787d82,null,null,null,null,null,"left",null,null,null,null);
		t5.text="还是无法观看？请查看";
		t5.width=130;
		t5.x=xx+85;
		t5.y=yy+102
		errorWin.addChild(t5);
		t5.selectable =false;
		
		//帮助
		var t4:TextField=new TextField();
		t4.defaultTextFormat=new TextFormat("Microsoft Yahei",14,0xf01400,null,null,null,null,null,"left",null,null,null,null);
		
		t4.htmlText = "<a href=\"event:\">常见问题</a>";
		t4.height=30;
		t4.x=xx+207;
		t4.y=yy+100;
		errorWin.addChild(t4);
		t4.mouseEnabled=true;
	//t4.addEventListener(MouseEvent.CLICK,function (e:MouseEvent){gotoUrl(e, "http://www.imooc.com/user/feedback" )});
		t4.addEventListener(MouseEvent.CLICK, function () { navigateToURL(new URLRequest("http://www.imooc.com/about/faq"), "_blank"); } );
		t4.addEventListener(MouseEvent.MOUSE_OUT,textOut);
		t4.addEventListener(MouseEvent.MOUSE_OVER,textOver);
		//----------
		var t6:TextField=new TextField();
		t6.defaultTextFormat=new TextFormat("Microsoft Yahei",12,0x787d82,null,null,null,null,null,"left",null,null,null,null);
		t6.text="或提";
		t6.width=130;
		t6.x=xx+265;
		t6.y=yy+102
		errorWin.addChild(t6);
		t6.selectable =false;
		//
		//意见反馈
		var t7:TextField=new TextField();
		t7.defaultTextFormat=new TextFormat("Microsoft Yahei",14,0xf01400,null,null,null,null,null,"left",null,null,null,null);
		//t4.text="意见反馈";
		t7.htmlText = "<a href=\"event:\">意见反馈</a>";
		t7.height=30;
		t7.x=xx+290;
		t7.y=yy+100;
		errorWin.addChild(t7);
		t7.mouseEnabled=true;
		//t4.addEventListener(MouseEvent.CLICK,function (e:MouseEvent){gotoUrl(e, "http://www.imooc.com/user/feedback" )});
		t7.addEventListener(MouseEvent.CLICK, function () { navigateToURL(new URLRequest("http://www.imooc.com/user/feedback"), "_blank"); } );
		t7.addEventListener(MouseEvent.MOUSE_OUT,textOut);
		t7.addEventListener(MouseEvent.MOUSE_OVER,textOver);
	}
		private function onErrImageLoaded(e:Event):void{
			var loader:Loader = Loader(e.target.loader);
			errorWin.addChild(loader);
			loader.x=xx+5
			loader.y=yy+55;
			
		}
		private function goRefresh(e:MouseEvent):void {
			
			//var url:URLRequest = new URLRequest("http://www.imooc.com/user/feedback");
			navigateToURL(new URLRequest("javascript:location.reload();"),"_self")
		}
		private function textOver(e:MouseEvent):void{
			var txt:TextField=e.currentTarget as TextField;
			//txt.defaultTextFormat=new TextFormat("Microsoft Yahei",14,0xff4d4d,null,null,null,null,null,"left",null,null,null,null);
			txt.textColor = 0xff4d4d;
		}
		private function textOut(e:MouseEvent):void{
			var txt:TextField=e.currentTarget as TextField;
			//txt.defaultTextFormat=new TextFormat("Microsoft Yahei",14,0xf01400,null,null,null,null,null,"left",null,null,null,null);
			txt.textColor = 0xf01400;
		}
	}

}

class SingleEnforce{}
