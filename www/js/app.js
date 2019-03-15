  
  // socialLab @ 2015  

  angular.module( 'sloRock', [ 'ionic', 'angular-data.DSCacheFactory', 'ngCordova', 'sloRock.controllers' ] )


  /* Global configuration */
  angular.module( 'sloRock' ).constant( 'mainConfig',
  {
    'SiteUrl'   : 'http://www.slorock.si/',
    // 'SiteApiUrl' : 'http://www.slorock.si/v2/',
    // 'SiteApiUrl' : 'http://192.168.2.100/projects/develop/slorock.si/',
    'SiteApiUrl' : 'http://www.slorock.si/v2/',
    'Port'      : 80,
    'RadioUrl'  : 'http://live4.infonetmedia.si/radios?type=.mp3&13202692901&duration=0&id=scplayer&autostart=true',
    'UserId'    : ( window.device && window.device.uuid ) ? window.device.uuid : 'd6178187a30c0c9a0a9721c77eef1e27'
  } )


  /* On init stuff */
  .run( [ '$ionicPlatform', 'DSCacheFactory', '$state', '$cordovaStatusbar', '$cordovaSplashscreen', '$rootScope', '$cordovaPush', 
  function( $ionicPlatform, DSCacheFactory, $state, $cordovaStatusbar, $cordovaSplashscreen, $rootScope, $cordovaPush )
  {
    /* CACHE */
    DSCacheFactory( 'SongDataCache',  { storageMode : 'localStorage', maxAge: ( 1000 * 60 * 60 * 8 ), deleteOnExpire : 'aggressive' } );
    DSCacheFactory( 'EventsCache',    { storageMode : 'localStorage', maxAge: ( 1000 * 60 * 60 * 8 ), deleteOnExpire : 'aggressive' } );
    
    DSCacheFactory( 'VoteCache',      { storageMode : 'localStorage', maxAge: null, deleteOnExpire : 'none' } );
    DSCacheFactory( 'LeaderboardWeekCache', { storageMode : 'localStorage', maxAge: null, deleteOnExpire : 'none' } );

    $ionicPlatform.ready( function()
    {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if( window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard )
		{
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true ); 
		}

		if( !angular.isUndefined( window.StatusBar ) )
		{
			// StatusBar.styleDefault();
		}

		if( !angular.isUndefined( window.device.uuid ) )
		{
			console.log( 'Device UUID: ' + window.device.uuid );
		}
    
		/* Toggle fullscreen mode and show status bar */
		ionic.Platform.fullScreen( true,  true );

		/* Hide cordova splashscreen */
		if( !angular.isUndefined( $cordovaSplashscreen ) )
		{
			setTimeout( function()
			{
			try
			{
				$cordovaSplashscreen.hide();  
			}
			catch( err ){ }
			}, 600 );
		}

		// On app refresh, refresh current view
		document.addEventListener("resume", function()
		{
			$state.go('app.leaderboard', { cache: false } ); 
		}, false );

		window.onPushNotification = function( objData )
		{
			if( angular.isDefined( objData.$scope ) )
			{
				$state.go( objData.$scope, { cache: false } );
			}
		}

    }  ); // End $ionicPlatform.ready
  } ] ) // End .run()
  
  .config( [ '$stateProvider', '$urlRouterProvider', '$logProvider', '$sceDelegateProvider', 'mainConfig', '$ionicConfigProvider',
  function( $stateProvider, $urlRouterProvider, $logProvider, $sceDelegateProvider, mainConfig, $ionicConfigProvider )
  {
  	window.setAngularRoutes( $stateProvider, $urlRouterProvider );
    
    /* Allow specific URLs to be loaded */
    $sceDelegateProvider.resourceUrlWhitelist(
    [
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      mainConfig.SiteUrl + '*',
      'http://www.youtube-nocookie.com/**',
//      new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
      new RegExp('^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?\(vimeo|youtube|soundcloud|mixcloud)\.com(/.*)?$'),
    ] );

    
    $logProvider.debugEnabled( true );
    
    $ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');
    $ionicConfigProvider.backButton.previousTitleText( false );
    $ionicConfigProvider.views.transition( 'ios' );

    $ionicConfigProvider.tabs.position( 'bottom' );
    $ionicConfigProvider.tabs.style( 'standard' );

    $ionicConfigProvider.navBar.alignTitle( 'center' );
    $ionicConfigProvider.navBar.positionPrimaryButtons( 'left' );

    // $ionicSideMenuDelegate.canDragContent( false ).

    // delete $httpProvider.defaults.headers.common['X-Requested-With']; // http://stackoverflow.com/questions/21470464/rootscope-onroutechangesuccess-or-rootscope-onstatechangesuccess-doe

  } ] ); // End .config



  /* Init controllers */
  angular.module('sloRock.controllers', ['ionic', 'angular-underscore'] );
  