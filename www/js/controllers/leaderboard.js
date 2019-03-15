
  /***************
  /* Leaderboard */
  ( function()
  {
    
    angular.module('sloRock.controllers' ).controller( 'LeaderboardController', [ '$scope', '$state', 'mainConfig', 'leaderboardService', 'voteService', LeaderboardController ] );

    function LeaderboardController( $scope, $state, mainConfig, leaderboardService, voteService )
    {
      var objView = this;
      
      $scope.mainConfig = mainConfig;

      voteService.getCurrentLeaderboardWeek();

      objView.selectSong = function( intSongId )
      {
        $state.go( 'app.song', { songId : intSongId } );
      }

      objView.refreshLeaderboard = function( boolForceRefresh )
      {
        voteService.getCurrentLeaderboardWeek();
        
        leaderboardService.getLeaderboard( boolForceRefresh ).then( function( objData )
        {
          objView.leaderboardData = objData;
        } ).finally( function()
        {
          $scope.$broadcast( 'scroll.refreshComplete' );
        } );
      }

      objView.refreshLeaderboard( false );
    }










    /*****************************
    /* Specific leaderboard song */
    angular.module('sloRock.controllers' ).controller( 'LeaderboardSongController', LeaderboardSongController );

    LeaderboardSongController.$inject = [ 
                                          '$scope', '$state', '$http', 'mainConfig', '$stateParams',
                                          '$sce', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', 
                                          'DSCacheFactory', '$ionicNavBarDelegate',
                                          '$timeout', '$rootScope', 'voteService',
                                          'leaderboardService', 'voteService', '$ionicPopup',
                                          'DSCacheFactory', '$cordovaPush'
                                        ]; // Prevent Minify breaking code
    
    function LeaderboardSongController( 
                                          $scope, $state, $http, mainConfig, $stateParams, 
                                          $sce, $ionicSlideBoxDelegate, $ionicScrollDelegate, 
                                          DSCacheFactory, $ionicNavBarDelegate,
                                          $timeout, $rootScope, voteService,
                                          leaderboardService, voteService, $ionicPopup,
                                          DSCacheFactory, $cordovaPush
                                      )
    {
      var objView = this;

      $scope.VoteDataCache = DSCacheFactory.get( 'VoteCache' );

      /* Get song information */
      leaderboardService.getLeaderboard().then( function( objData )
      {
        objView.leaderboardData = objData;

        /* Get selected song data */
        for( var songKey in objView.leaderboardData )
        {
          if( objView.leaderboardData[ songKey ].Id == $stateParams.songId )
          {
            $scope.Song = objView.leaderboardData[ songKey ];
            objView.Title = $scope.Song.Title;
            break;
          }
        }

        // Prevent HTML escaping
        $scope.Song.Lyrics_HTML           = $sce.trustAsHtml( objView.leaderboardData[ songKey ].Lyrics );
        $scope.Song.Band_Description_HTML = $sce.trustAsHtml( objView.leaderboardData[ songKey ].Band_Description );
        
        $scope.Song.Band_Members_All = $sce.trustAsHtml( $scope.map( $scope.Song.Band_Members ).join( ',<br />' ) );

        /* For Youtube embeded code */
        $scope.Song.YouTubeUrl = 'http://www.youtube-nocookie.com/embed/' + $scope.Song.VideoHash + '?wmode=opaque&autohide=1&showinfo=0';

      } ).finally( function()
      {
      	if( angular.isUndefined( $scope.Song ) )
      	{
       		$state.go( 'app.leaderboard' );
      	}
      } );



      /* Attach main configuration to view */
      $scope.mainConfig = mainConfig;


      /********************
      /* Tabs navigation */
      objView.selectTab = function( intSlideNo )
      {
        $scope.currentTabNo = intSlideNo -1;
        $ionicSlideBoxDelegate.slide( $scope.currentTabNo );
      }

      objView.slideChanged = function()
      {
        $ionicScrollDelegate.scrollTop( true );

        $timeout( function()
        {
          $scope.currentTabNo = $ionicSlideBoxDelegate.currentIndex();
          $ionicScrollDelegate.resize();
        }, 50 );
      }

      objView.selectTab( 1 );
      $ionicSlideBoxDelegate.update();



      /**********/
      /* Voting */

      /* Set user vote status to 0 (not known) // 1 = can vote, 2 = alrady voted */
      $scope.userVoteStatus = 0;

      /* Check if user can vote */
      voteService.canVote( $stateParams.songId ).then( function( boolCanVoteStatus )
      {
        if( boolCanVoteStatus )
        {
          $scope.userVoteStatus = 1; // Can vote
        }
        else
        {
          $scope.userVoteStatus = 2; // Cant vote
        }
      } );


      objView.songVote = function()
      {
        console.log( 'Voted for song id: ' + $scope.Song.Id );

     //   voteService.canVote( $stateParams.songId, true ); // Passing second parameter "true", makes vote happen after canVote check

        $scope.userVoteStatus = 2; // Set vote button as already voted

        PushNotificationEnabled = $scope.VoteDataCache.get( 'PushNotificationEnabled' );

        if( PushNotificationEnabled !== true )
        {
          $scope.askForPushNotifications();
        }
      }

      // A confirm dialog
      $scope.askForPushNotifications = function()
      {
        var pushNotificationPopup = $ionicPopup.confirm(
        {
          title: 'Tvoj glas je sprejet.',
          template: 'Želiš prejeti obvestilo, ko bo na voljo nova lestvica? (1× tedensko)',
          buttons: [
            { text: 'Ne hvala' },
            { 
              text: 'Hell yeah!',
              onTap: function( e )
              {
                return true;
              }
            }
          ]
        } );
        
        pushNotificationPopup.then( function( boolAnswer )
        {
          if( boolAnswer == true )
          {
            console.log( '$cordovaPush.register called.' );

            $scope.VoteDataCache.put( 'PushNotificationEnabled', true );

            var pushNotificationConfig = {
                'badge'   : true,
                'sound'   : false,
                'alert'   : false,
                'ecb'     : 'onPushNotification',
                'senderID'  : 'replace_with_sender_id'
            };

            $cordovaPush.register( pushNotificationConfig ).then( function( mixResult )
            {
              console.log( '$cordovaPush.register result:' );
              console.log( mixResult );

              var deviceToken = null;

              if( window.device.platform === 'iOS' )
              {
                deviceToken = mixResult;
              }
              else if( window.device.platform === 'Android' )
              {
                deviceToken = mixResult.deviceToken; 
              }


              var httpParams  = {
                  method: 'GET',
                  cache: false,
                  url: mainConfig.SiteApiUrl + 'api/registerPushNotification',
                  data: { 
                  userId          : mainConfig.UserId,
                  deviceToken     : deviceToken,
                  devicePlatform  : window.device.platform
                }
              };

              $http.get( httpParams );

            }, function() // Error
            {
              // Save that user didnt accept push notifications
            } );
          }
        } );
      };
    }



  } )();
