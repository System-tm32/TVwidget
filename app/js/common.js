$(function() {
	var socket = new WebSocket("ws://192.168.0.214:8081");

	var video = [
		{
			author: "События",
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

	var db = firebase.database(),
		videos = db.ref().child("video"),
		fbmode = db.ref().child("control-mode"),
		history = db.ref().child("history"),
		historyLimit = db.ref().child("history").limitToLast(10),
		smoothie = new SmoothieChart({tooltip:true,millisPerPixel:15}),
		mode,
		gyro,
		light,
		updGyro,
		alpha = 0,
		beta = 0,
		gamma = 0,
		updateLux = 0,
		onMessageCallbacks = [],
		firstTime = 0,
		btnMark = 0,
		word = [],
		count = 0,
		q = 0;

	init();
	
	function init() {

		listenFB();
		btnClick();
		btnClickOff();
		objectMove();
		objectMoveHyro();
		deleteTextInput();
		openRating();
		openHistory();
		openVideo();
		updateGyro();
		openMenu();
		exitMenu();
		deviceLight();
		giveSocketMessage();
		lightUpdate();
		chartistDraw();
		openChart();

	}
	function openChart(){
		$(".control-btn-long").on("click", function() {
			
				if ($(this).data('video') == 27) {
	
					$('#chart').toggleClass('display');	
					$('.legend').toggleClass('display');
				}				
				
		});
	}
	function chartistDraw() {
		
		smoothie.streamTo(document.getElementById("chart"),1000);
		
		var lineBeta = new TimeSeries();
		var lineGamma = new TimeSeries();
		var lineAlpha = new TimeSeries();
		
		setInterval(function() {
		  lineBeta.append(new Date().getTime(), gyro.data.beta);
		  lineGamma.append(new Date().getTime(), gyro.data.gamma);
		  lineAlpha.append(new Date().getTime(), gyro.data.alpha);
		}, 1000);

		smoothie.addTimeSeries(lineBeta,{
			strokeStyle:'#00ff00'
		});
		smoothie.addTimeSeries(lineGamma,{
			strokeStyle:'#0a6cff'
		});
		smoothie.addTimeSeries(lineAlpha,{
			strokeStyle:'#ff0a0a'
		});
	}

	function giveSocketMessage(){
		socket.onmessage = function(event){
			var that = this;
			var _event = JSON.parse(event.data);

			onMessageCallbacks.forEach(function(onMessage) {
				
				if (_event.name === onMessage.name) {
					
					onMessage.callback.call(that, event);
				}
			});
		};

		subscribe('gyro', function onMessage(event){

			window.isMobile = function() {
			  var check = false;
			  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
			  return check;
			}

			if (!window.isMobile()) {
				 gyro = JSON.parse(event.data);	
			  		
			  		$(".control").css("transform", "rotateY(" + (gyro.data.gamma - gamma) + "deg) rotateX(" + (-1)*(gyro.data.beta - beta) + "deg) rotateZ(" + (-1)*(gyro.data.alpha - alpha) + "deg)");
		  		
			}

		});

		subscribe('light', function onMessage(event){

			light = JSON.parse(event.data);
			if ( light.name == "light") {
				var lux = (1-1*light.data.lux/1000).toFixed(2);
				
				$(document.body).css({
					background: "rgba(0, 0, 0,"+ (lux-updateLux) + ")"
				});
				if (!isOn()){
					$(".video").css({
						background: "rgba(31, 31, 31,"+ (lux-updateLux) + ")"
					})
				}
			}

		});

		function subscribe(name, onMessage){
			onMessageCallbacks.push({
				name: name,
				callback: onMessage
			});
		}
	}
	function lightUpdate(){
		$(".control-btn").on("click", function() {

			if ($(this).data('video') == 33) {
				
				updateLux = ((1-1*light.data.lux/1000).toFixed(2));
				
				}		
		});

	}
	function deviceLight() {
		var throttledSend = throttle(function(event) {
		  
		  var lightDev = {
		  	name: "light",
		  	data: {
		  		lux: event.value
		  	}
		  }
		  socket.send(JSON.stringify(lightDev));
		  
		}, 500);

		window.addEventListener('devicelight', throttledSend  );

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
		  
                var position = {
                	name: "gyro",
                	data: {
                		alpha: event.alpha,
                		beta: event.beta,
                		gamma: event.gamma
                	}
                };
                socket.send(JSON.stringify(position));
		}
	window.addEventListener('deviceorientation', handleOrientation);	
	}

	function btnClickOff(){

		$(".control-btn-on").on("click", function() {

			if (isOn()) {

				fbmode.update({
					mode: '0'
				});
				firstTime = 0;
				clearMenu($(this).data('video'))
				$('.video').css('background','black');

			} else {

				$('.ind').addClass('tv-on');
				$("iframe").attr("src","https://www.youtube.com/embed/" + video[0].name + "?showinfo=0&autoplay=1 ");
			
			}
			indicator();
		});

	}

	function btnClick() { //!!!!!!!!
		var prevbtn;
		$(".control-btn").on("click", function() {
			btnMark = localStorage.getItem('btnsave');
			for ( var i = 0; i < video.length; i++) {
				$(".ind").addClass("tv-on");
				if ($(this).data("video") == i) {
					if ( typeof prevbtn !== 'undefined' ) {
						
						video[prevbtn].time += (new Date().getTime() - firstTime)/1000;
						
						db.ref().child('/video/' + prevbtn).update({
							 time: video[prevbtn].time
						  });
		
					} 

                    prevbtn = $(this).data("video");
                    firstTime = new Date().getTime();
                    if ( mode == 1 ){
                    	firstTime = 0;
                    	localStorage.setItem('btnsave', i);
                    	putTex($(this),i);
                    } 
                   	 else {
                   	 	// history.push({
                   	 	// 	"name": video[i].author
                   	 	// });
                   	 	$("iframe").attr("src", "https://www.youtube.com/embed/" + video[i].name + "?showinfo=0&autoplay=1&start=" + Math.round(video[i].time));
                   	 	
                   	 }
                }				
			}	
			indicator();
		});
	}
	
	function getLastBtn(num) { //!!!!!!!!
		return num;
	}

	function putTex(btnObj,btnNum) { //!!!!!!!!
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

					fbmode.update({
						mode: '0'
					});
					
					clearMenu($(this).data('video'));
					$("iframe").attr("src", "https://www.youtube.com/embed/" + word.join('') + "?showinfo=0&autoplay=1");
				
				}				
				
			indicator();
		});
    }
     function openRating() {
     	var fullTime = 0;
    	$(".control-btn-long").on("click", function() {
				$("iframe").attr("src"," ");
				$('.ind').addClass('tv-on');
				
				if ($(this).data('video') == 50) {
					
					clearMenu($(this).data('video'));
					$('.rating').addClass('display');
					$('.video').css('background','radial-gradient(ellipse at center, #cfedf9 0%,#2bb0ed 100%)');
					for (var i = 0; i < video.length; i++){

						$(".rating-list").append("<li><img src=https://i1.ytimg.com/vi/"+ video[i].name +"/3.jpg>" + "<span class=author-video>" +video[i].author + "</span>"+" <span class=\"right\"> " + Math.round(video[i].time/60) + " мин.</span></li>");
						fullTime+= Math.round(video[i].time/60);
					}
						$(".rating-list").append("<li> <span class=\"right\"> Всего" + fullTime + " мин.</span></li>");
				
				}				
			indicator();
		});
    }

    function updateGyro(){

    	$(".control-btn").on("click", function() {

			if ($(this).data('video') == 18) {
				
				alpha = Math.round(gyro.data.alpha);
				beta = Math.round(gyro.data.beta);
				gamma = Math.round(gyro.data.gamma);
				
				}		
		});

    }

    function openHistory() {
    	$(".control-btn-long").on("click", function() {
			
				$('.ind').addClass('tv-on');
				$("iframe").attr("src"," ");
				
				if ($(this).data('video') == 51) {
					
					clearMenu($(this).data('video'));
					$('.history').addClass('display');
					$('.video').css('background','radial-gradient(ellipse at center, #cfedf9 0%,#2bb0ed 100%)');
					historyLimit.once('value', function(snapshot){

			    		snapshot.forEach(function(childSnapshot){
			    			
			    			var childData = childSnapshot.child("name").val();
			    			$(".history-list").append("<li>"+ childData +"</li>");

			    		})
			    			 
			    	});
				}				
			indicator();
		});
    }
	function openMenu() {
		$(".control-btn").on("click", function() {
			
				$('.ind').addClass('tv-on');
				
				if ($(this).data('video') == 100) {

					clearMenu($(this).data('video'));
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
					clearMenu($(this).data('video'));
					
				}				
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
					clearMenu($(this).data('video'));
					
				}				
		});
	}

	function clearMenu(numberBtn){

		switch ( numberBtn ) {
			case 102://btnclickoff
				$('.ind').removeClass('tv-on');
				$("iframe").attr("src"," ");
				$(".rating-list").empty();
				$('.ind').removeClass('tv-on');
				$(".history-list").empty();
				$('.put-video').removeClass('display');
				$('.history').removeClass('display');
				$('.put-video').removeClass('display');
			break;
			case 111:// openvideo
				$('.put-video').removeClass('display');
			break;
			case 50://openRaiting
				$("iframe").attr("src"," ");
				$('.history').removeClass('display');
				$(".history-list").empty();
				$('.history').removeClass('display');
				$('.put-video').removeClass('display');
			break;
			case 51://openhistory
				$('.rating').removeClass('display');
				$("iframe").attr("src"," ");
				$(".rating-list").empty();
				$('.put-video').removeClass('display');
			break;
			case 100: //openmenu
				$("iframe").attr("src"," ");
				$(".rating-list").empty();
				$(".history-list").empty();
				$('.history').removeClass('display');
			break;
			case 101://exitmenu
				$('.ind').removeClass('tv-on');
				$("iframe").attr("src"," ");
				$(".rating-list").empty();
				$(".history-list").empty();
				$('.put-video').removeClass('display');
				$('.history').removeClass('display');
			break;
			case 200://deletetextinput
				word = [];
				$("#put-name-video").val(" ");
			break;

		}
		
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

	function throttle(func, ms) {

	  var isThrottled = false,
		    savedArgs,
		    savedThis;

	  function wrapper() {

	    if (isThrottled) {
	      savedArgs = arguments;
	      savedThis = this;
	      return;
	    }

  	  func.apply(this, arguments);

    	isThrottled = true;

	    setTimeout(function() {
	      isThrottled = false;
	      if (savedArgs) {
	        wrapper.apply(savedThis, savedArgs);
	        savedArgs = savedThis = null;
	      }
	    }, ms);
  	}

 	 return wrapper;
	}

});