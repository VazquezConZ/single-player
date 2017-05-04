/*Single player*/
'use strict';
var  $_beginCounter = 0
	,$_totalSecondsTrack = 0
	,$_timerSeconds = 0
	,$_timerMinutes = 0
	,$_interval
	,$_timerAuxSeconds = 0;

(function() {
	//play music
	$('body').on('click', '.ready-play', function ( event ) {
		event.stopImmediatePropagation();
		$(this).hide();
		document.getElementsByClassName('stop-play')[0].style.display = 'block';
		$('.body-indicators-player').html('Cargando pista...');
		_startPlayer();
	});
	//stop music
	$('body').on('click', '.stop-play', function ( event ) {
		event.stopImmediatePropagation();
		_stopPlayer()
		_resetPlayer(['.player-seconds','.player-minutes']);
	});
})();

function _startPlayer()
{
	_setTimer(['.player-seconds','.player-minutes']);	
}
function _stopPlayer()
{
	$('.stop-play').hide();
	document.getElementsByClassName('ready-play')[0].style.display = 'block';
	$('.body-indicators-player').html('Detenido');
}

function _setTimer(_filters)
{
	_resetPlayer(_filters);
	try {
		setTimeout(function() {
			ID3.loadTags($('#player-tag').attr('src'), function() {
			  showTags($('#player-tag').attr('src'));
			}, {
			  tags: ["title","artist","album","picture"]
			});

			var audio = new Audio();
			audio.src = $('#player-tag').attr('src');
			audio.addEventListener('loadedmetadata', function() {
				$_totalSecondsTrack = Math.round(audio.duration);
				
				var  to_sencods = $(_filters[0])
					,to_minutes = $(_filters[1]);
					try {
						$('#player-tag')[0].play();
						$('.total-track-time').html(_setTimerTrack($_totalSecondsTrack));
						$_interval = setInterval(function() {
							$_timerSeconds++;
							$_timerAuxSeconds++;
							
							if ( $_timerSeconds == $_totalSecondsTrack ) {
								_stopPlayer()
								_resetPlayer(_filters);
							}
							else {
								if ( $_timerAuxSeconds == 60 ) {
									$_timerMinutes++;
									if ( $_timerMinutes < 10 ) {
										to_minutes.html('0' + $_timerMinutes);
									}
									else {
										to_minutes.html($_timerMinutes);
									}								
									to_sencods.html('00');
									$_timerAuxSeconds = 0;
								}
								else {
									if ( $_timerAuxSeconds < 10 ) {
										to_sencods.html('0' + $_timerAuxSeconds);
									} 
									else {
										to_sencods.html($_timerAuxSeconds);
									}
								}
							}
						}, 1000);
					} catch (e) {

					}
			});
		},100);
	} catch (e) {

	}
}

function _resetPlayer(_filters)
{
  	 $_beginCounter = 0
	,$_totalSecondsTrack = 0
	,$_timerSeconds = 0
	,$_timerMinutes = 0
	,$_timerAuxSeconds = 0;
	$('#player-tag')[0].load();
	$(_filters[0]).html('00');
	$(_filters[1]).html('00');
	$('.total-track-time').html('00:00');
	try {
		clearInterval($_interval);
	} catch (e) {

	}
}

function _setTimerTrack(_seconds)
{
	var _relativeMinutes = (_seconds / 60).toString();
	var _buildTime =  _relativeMinutes.split('.');
	var _buildMinutes = parseInt(_buildTime[0]),
		_buildSeconds = parseFloat('.'+_buildTime[1]);
	var _roundSegs = Math.round((_buildSeconds*60));
	var _finalSeconds = (_buildTime[1] > 1) ? (_roundSegs < 10) ? '0'+_roundSegs : _roundSegs : ( _seconds % 60 == 0 ) ? '00' : '01';
	var _finalMinutes = ( _buildMinutes < 10 ) ? '0'+_buildMinutes : _buildMinutes;
	return _finalMinutes+':'+_finalSeconds;
}


/**
 * Loading the tags using the FileAPI.
 */
function loadFile(input) {
  var file = input.files[0],
    url = file.urn || file.name;

  ID3.loadTags(url, function() {
    showTags(url);
  }, {
    tags: ["title","artist","album","picture"],
    dataReader: ID3.FileAPIReader(file)
  });
}
/**
 * Generic function to get the tags after they have been loaded.
 */
function showTags(url) {
  var tags = ID3.getAllTags(url);
  try {
  	$('.body-indicators-player').html(function() {
  		var titulo = (typeof(tags.title) == 'undefined') ? 'Track desconocido' : tags.title;
  		var artista = (typeof(tags.artist) == 'undefined') ? 'Artista desconocido' : tags.artist;
  		return '<b>'+artista+'</b>' + ' - ' + '<b>'+titulo+'</b>'
  	});
  } catch(e) {
  	
  }
}
