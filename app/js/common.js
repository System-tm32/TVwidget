$(function() {
	var socket = new WebSocket("ws://192.168.43.41:8081");

	var video = [
		{
			author: "Свинка Пеппа",
			name: "X8Z8okhkjv8",
			time: 0
		},
		{
			author: "Bac Le",
			name: "aAWD65mFD_I",
			time: 0
		},
		{
			author: "metkii1985",
			name: "0hMTcCYdg04",
			time: 0
		},
		{
			author: "Мега ТВ",
			name: "8WdA-VI7Xyc",
			time: 0
		},
		{
			author: "Наука и Образование",
			name: "XOhJAHDWJv8",
			time: 0
		},
		{
			author: "КОСМОПОЛИС HD",
			name: "bPkC6znaauM",
			time: 0
		},
		{
			author: "Discovery Channel Россия",
			name: "z_AtxPWdFZc",
			time: 0
		},
		{
			author: "HD video",
			name: "SccyIMbrx0M",
			time: 0
		},
		{
			author: "НЕЙШЕНЕЛ ГЕОГРАФИК",
			name: "p505qUB-zXU",
			time: 0
		}

	];

	var db = firebase.database();
	var videos = db.ref().child("video");
	var fbmode = db.ref().child("control-mode");
	var mode ;
	
	

	init();
	
	function init() {
		listenFB();
		btnClick();
		btnClickOff();
		objectMove();
		objectMoveHyro();
		deleteTextInput();
		openRating();
		openVideo();
		openMenu();
		exitMenu();

	}
	function listenFB(){
		videos.once('value')
		.then( function(snapshot) {
			for ( var i = 0; i < video.length; i++){
				video[i].time = snapshot.child(i).child("time").val();
				
			}
	});
	
    fbmode.on('value', function(snapshot){

    		mode = snapshot.child("mode").val();
    		
    	});
	}
	function objectMove() {

		$( document ).mousemove(function( event ){

			var w = $(window).width()/2;
			var h = $(window).height()/2;
			var rotateX = 180*(event.pageX - w)/w;
			var rotateY = 180*(event.pageY - h)/h;

			
		   	$('.tv').css('transform', 'rotateY(' + rotateX/3 + 'deg) rotateX(' + (-1)*rotateY/3 + 'deg)' );
		   
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
				$(".rating-list").empty();
				//localStorage.setItem('mode','0');
				fbmode.update({
					mode: '0'
				});
				$('.put-video').removeClass('display');
				$('.video').css('background','black');

			} else {

				$('.ind').addClass('tv-on');
				$("iframe").attr("src","https://www.youtube.com/embed/" + video[0].name + "?showinfo=0&autoplay=1 ");
			
			}

			indicator();

		});

	}



	function btnClick() {

		$(".control-btn").on("click", function() {
			btnMark = getLastBtn(localStorage.getItem('btnsave'));
			for ( var i = 0; i < video.length; i++) {
				$(".ind").addClass("tv-on");
				if ($(this).data("video") == i) {
                    
                    if ( mode == 1 ){
                    	localStorage.setItem('btnsave', i);
                    	putTex($(this),i);
                    } 
                   	 else {
                   	 	
                   	 	$("iframe").attr("src", "https://www.youtube.com/embed/" + video[i].name + "?showinfo=0&autoplay=1&start=" + video[i].time);
                   	 	
                   	 }
                }				
			}	
			indicator();
		});
	}
	var btnMark = 0;
	var word = [];
	var count = 0;
	var q = 0;
	function getLastBtn(num) {
		return num;
	}
	function putTex(btnObj,btnNum) {
        var strArr = [];
        var letter = $(btnObj).data("let");
	    	strArr = letter.split("");

        var idTimeOut = setTimeout(function() {
				            
	      localStorage.setItem('btnsave', 0);
		  
		 }, 2000);

        if ( btnNum == btnMark ){
        	
        	clearTimeout(idTimeOut);
        	word[q]=strArr[count];

        	$("#put-name-video").val(String(word.join('')));
        	count++;


        } else {
        	q++;
        	count = 0;
        }

    }
    function openVideo() {
    	$(".control-btn-long").on("click", function() {
			
				$('.ind').addClass('tv-on');
				
				if ($(this).data('video') == 111) {

					localStorage.setItem("mode","0");
					fbmode.update({
						mode: '0'
					});
					$('.put-video').removeClass('display');
					$("iframe").attr("src", "https://www.youtube.com/embed/" + word.join('') + "?showinfo=0&autoplay=1");
				
				}				
				
			indicator();
		});
    }
     function openRating() {
    	$(".control-btn-long").on("click", function() {
			
				$('.ind').addClass('tv-on');
				
				if ($(this).data('video') == 50) {
					
					$('.rating').addClass('display');
					$('.video').css('background','radial-gradient(ellipse at center, #cfedf9 0%,#2bb0ed 100%)');
					for (var i = 0; i < video.length; i++){
						for (var k = 0; k < video.length-1; k++) {
							for (var j = 0; j < video.length-1-k; j++)
						        { if (video[j+1].time > video[j].time)
						           { var t = video[j+1].time;
						            video[j+1].time = video[j].time;
						             video[j].time = t; }
						        }
					    }
						$(".rating-list").append("<li><img src=https://i1.ytimg.com/vi/"+ video[i].name +"/3.jpg>" + video[i].author + " Просмотренно: " + video[i].time + "</li>");
					}
					
				
				}				
				
			indicator();
		});
    }
	function openMenu() {
		$(".control-btn").on("click", function() {
			
				$('.ind').addClass('tv-on');
				
				if ($(this).data('video') == 100) {

					$("iframe").attr("src"," ");
					localStorage.setItem("mode","1");
					fbmode.update({
						mode: '1'
					});
					$('.put-video').addClass('display');
					$('.video').css('background','radial-gradient(ellipse at center, #cfedf9 0%,#2bb0ed 100%)');
				
				}				
				
			indicator();
		});
	}
	function deleteTextInput() {
		$(".control-btn").on("click", function() {
			
				$('.ind').addClass('tv-on');
				
				if ($(this).data('video') == 200) {
					word = [];
					$("#put-name-video").val(" ");
					$(".rating-list").empty();
				}				
				
			indicator();
		});
	}

	function exitMenu( ) {
		$(".control-btn").on("click", function() {

				$('.ind').addClass('tv-on');

				if ($(this).data('video') == 101) {

					localStorage.setItem("mode","0");
					fbmode.update({
						mode: '0'
					});
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
	function indicator() {

		    $('.ind-1').addClass('anim');

		    setTimeout (function() {

		      $('.ind-1').removeClass('anim');

		    }, 700);	 

	}
	function getNowTime (){

		var tmp = new Date();
		return tmp.getTime()
	}

});