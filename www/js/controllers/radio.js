

  /***************
  /* Leaderboard */
  ( function()
  {
    
    angular.module('sloRock.controllers' ).controller( 'RadioController', [ '$scope', '$state', 'mainConfig', '$cordovaMedia', RadioController ] );

    function RadioController( $scope, $state, mainConfig, $cordovaMedia )
    {
      var objView = this;

      $scope.mainConfig = mainConfig;
      
      objView.radioPaused = true;
      
      objView.audioControlState = 'ion-play';

      objView.playRadio = function()
      {
        if(  objView.radioPaused )
        {
          document.getElementById( 'RadioAudio' ).play();
          objView.radioPaused = false;

          objView.audioControlState = 'ion-pause';

        }
        else
        {
          document.getElementById( 'RadioAudio' ).pause();  
          objView.radioPaused = true;

          objView.audioControlState = 'ion-play';
        }
        
        

        /*
        var media = new Media( mainConfig.RadioUrl, null, null, mediaStatusCallback );

        $cordovaMedia.play( media );
        */
      }

      var mediaStatusCallback = function( status )
      {
          if( status == 1 )
          {
            $ionicLoading.show( { template: 'Loading...' } );
          }
          else
          {
            $ionicLoading.hide();
          }
      }


    }



  } )();
