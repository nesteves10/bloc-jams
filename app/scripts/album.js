var albumPicasso = {
  name: "The Colors",
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '/images/album-placeholder.png',
  songs: [
    { name: 'Blue', length: '4:21' },
    { name: 'Green', length: '4:22' },
    { name: 'Red', length: '4:23' },
    { name: 'Pink', length: '4:24' },
    { name: 'Magenta', length: '4:25' },
  ]
};

var albumMarconi = {
  name: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'images/album-placeholder.png',
  songs: [
       { name: 'Hello, Operator?', length: '1:01' },
       { name: 'Ring, ring, ring', length: '5:01' },
       { name: 'Fits in your pocket', length: '3:21'},
       { name: 'Can you hear me now?', length: '3:14' },
       { name: 'Wrong phone number', length: '2:15'}
     ]
};

var currentlyPlayingSong = null;

var createSongRow = function(songNumber, songName, songLength) {

  var template =
      '<tr>'
    + '  <td class="song-number col-md-1" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="col-md-9">' + songName + '</td>'
    + '  <td class="col-md-2">' + songLength + '</td>'
    + '</tr>'
  ;

  // Instead of returning the row immediately, we'll attach hover
  // functionality to it first.
   var $row = $(template);
 
   var onHover = function(event) {
     songNumberCell = $(this).find('.song-number');
     songNumber = songNumberCell.data('song-number');
     if (songNumber !== currentlyPlayingSong) {
       songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
    }
   };
 
   var offHover = function(event) {
     songNumberCell = $(this).find('.song-number');
     songNumber = songNumberCell.data('song-number');
     if (songNumber !== currentlyPlayingSong) {
      songNumberCell.html(songNumber);
    }
   };
   
    // Toggle the play, pause, and song number based on the button clicked.
   var clickHandler = function(event) {
     songNumber = $(this).data('song-number');
 
     if (currentlyPlayingSong !== null) {
       // Revert to song number for currently playing song because user started playing new song.
       currentlyPlayingCell = $('.song-number[data-song-number="' + currentlyPlayingSong + '"]');
       currentlyPlayingCell.html(currentlyPlayingSong);
     }
 
     if (currentlyPlayingSong !== songNumber) {
       // Switch from Play -> Pause button to indicate new song is playing.
       $(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>');
       currentlyPlayingSong = songNumber;
     }
     else if (currentlyPlayingSong === songNumber) {
       // Switch from Pause -> Play button to pause currently playing song.
       $(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
       currentlyPlayingSong = null;
     }
   };

   $row.find('.song-number').click(clickHandler); 
   $row.hover(onHover, offHover);
   return $row;

  };


var changeAlbumView = function(album) {

      var $albumTitle = $('.album-title');
      $albumTitle.text(album.name);

      var $albumArtist = $('.album-artist');
      $albumArtist.text(album.artist);

      var $albumMeta = $('.album-meta-info');
      $albumMeta.text(album.year + " on " + album.label);

      var $albumImage = $('.album-image img');
      $albumImage.attr('src', album.albumArtUrl);

      var $songList = $('.album-song-listing');
      $songList.empty();
      var songs = album.songs;
      for (var i = 0; i < songs.length; i++) {
        var songData = songs[i];
        var $newRow = createSongRow(i + 1, songData.name, songData.length);
        $songList.append($newRow);
      }
}

var updateSeekPercentage = function($seekBar, event) {
  var barWidth = $seekBar.width();
  var offsetX = event.pageX - $seekBar.offset().left;

  var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
}

var setupSeekBars = function() {
  $seekBars = $('.player-bar .seek-bar');
  $seekBars.click(function(event) {
    updateSeekPercentage($(this), event);
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();

    $seekBar.addClass('no-animate');

    $(document).bind('mousemove.thumb', function(event) {
      updateSeekPercentage($seekBar, event);
    });

    $(document).bind('mouseup.thumb', function(event) {
      $seekBar.removeClass('no-animate');
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

// This 'if' condition is used to prevent the jQuery modifications
 // from happening on non-Album view pages.
 //  - Use a regex to validate that the url has "/album" in its path.
 if (document.URL.match(/\/album.html/)) {
   $(document).ready(function() {

    changeAlbumView(albumPicasso);
    setupSeekBars();
   });
 }
