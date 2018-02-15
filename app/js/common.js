$(function() {

	var video = [
		{
			name: "X8Z8okhkjv8",
			time: 0
		},
		{
			name: "aAWD65mFD_I",
			time: 0
		},
		{
			name: "0hMTcCYdg04",
			time: 0
		},
		{
			name: "8WdA-VI7Xyc",
			time: 0
		},
		{
			name: "XOhJAHDWJv8",
			time: 0
		},
		{
			name: "bPkC6znaauM",
			time: 0
		},
		{
			name: "z_AtxPWdFZc",
			time: 0
		},
		{
			name: "z_AtxPWdFZc",
			time: 0
		},
		{
			name: "p505qUB-zXU",
			time: 0
		},
		{
			name: "SccyIMbrx0M",
			time: 0
		}
	];
	var socket = new WebSocket("ws://192.168.43.41:8081");
	
	init();
//var db = firebase.database();
	
	function init() {

		btnClick();
		btnClickOff();
		objectMove();
		objectMoveHyro();
		openMenu();
		exitMenu();

	}

	function objectMove() {

		$( document ).mousemove(function( event ){

			var w = $(window).width()/2;
			var h = $(window).height()/2;
			var rotateX = 180*(event.pageX - w)/w;
			var rotateY = 180*(event.pageY - h)/h;

			
		   	$('.tv').css('transform', 'rotateY(' + rotateX/3 + 'deg) rotateX(' + rotateY/3 + 'deg)' );
		   
		  });
	}

	function objectMoveHyro() {
		function handleOrientation(event) {
		  
		  var alpha    = event.alpha;
		  var beta     = event.beta;
		  var gamma    = event.gamma;
                var a = '{"beta" : ' + beta + ',"gamma" :' + gamma + ',"alpha": ' + alpha + "}";
                socket.send(a);
		}

	window.addEventListener('deviceorientation', handleOrientation);

	socket.onmessage = function(event) {
	  var gyro = JSON.parse(even.data);
	  $(".tv").css("transform", "rotateY(" + gyro.gamma + "deg) rotateX(" + -1 * gyro.beta + "deg)");
	};
	}

	
	function btnClickOff(){

		$(".control-btn-on").on("click", function() {

			if (isOn()) {
				$('.ind').removeClass('tv-on');
				$("iframe").attr("src"," ");
				localStorage.setItem('mode','0');
				$('.put-video').removeClass('display');
				$('.video').css('background','black');
			} else {
				$('.ind').addClass('tv-on');
				$("iframe").attr("src","https://www.youtube.com/embed/" + video[0].name + "?showinfo=0&autoplay=1 ");
			}

			indicator();

		});

	}
	
	function indicator() {

		    $('.ind-1').addClass('anim');

		    setTimeout (function() {

		      $('.ind-1').removeClass('anim');

		    }, 700);	 

	}
	function btnClick() {

		$(".control-btn").on("click", function() {

			for ( var i = 0; i < video.length; i++) {
				$(".ind").addClass("tv-on");
				if ($(this).data("video") == i) {
                    var mode = localStorage.getItem("mode");

                    if ( mode == 1 ){
                    	
                    } 
                   	 else {
                   	 	
                   	 	$("iframe").attr("src", "https://www.youtube.com/embed/" + video[i].name + "?showinfo=0&autoplay=1&start=" + video[i].time);
                   	 	
                   	 }
                }				
			}	
			indicator();
		});
	}


	function openMenu() {
		$(".control-btn").on("click", function() {
			
				$('.ind').addClass('tv-on');
				$("iframe").attr("src"," ");
				if ($(this).data('video') == 100) {
					localStorage.setItem("mode","1");
					$('.put-video').addClass('display');
					$('.video').css('background','radial-gradient(ellipse at center, #cfedf9 0%,#2bb0ed 100%)');
				
				}				
				
			indicator();
		});
	}

	function exitMenu( ) {
		$(".control-btn").on("click", function() {

				$('.ind').addClass('tv-on');

				if ($(this).data('video') == 101) {
					localStorage.setItem("mode","0");
					$('.put-video').removeClass('display');
					
				}				
				
			indicator();
		});
	}

	function isOn(){

		if ($('.ind').hasClass('tv-on')){
			return true;
		} else {
			return false;
		}

	}
	function timer (){

		var tmp = new Date();
		return tmp.getTime()
	}

});