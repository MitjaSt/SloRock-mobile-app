  
  
  window.setAngularRoutes = function(  $stateProvider, $urlRouterProvider )
  {
    $stateProvider

    .state( 'app',
    {
      abstract: true,

      url: '/app',
      templateUrl: 'js/views/app.html'
    } )
    
    .state( 'app.leaderboard',
    {
      url: '/leaderboard',
      cache: false,
      views:
      {
        'mainContent' :
        {
          templateUrl: 'js/views/leaderboard.html'
        }
      }
    } )

    .state( 'app.song',
    {
      url: '/leaderboard/:songId',
      cache: false,
      views:
      {
        'mainContent' :
        {
          templateUrl: 'js/views/leaderboard_song.html'
        }
      }
    } )
    
    .state( 'app.events',
    {
      url: '/events',
      views:
      {
        'mainContent' :
        {
          templateUrl: 'js/views/events.html'
        }
      }
    } )
    
    .state( 'app.radio',
    {
      url: '/radio',
      views:
      {
        'mainContent' :
        {
          templateUrl: 'js/views/radio.html'
        }
      }
    } )
    
    .state( 'app.information',
    {
      url: '/information',
      views:
      {
        'mainContent' :
        {
          templateUrl: 'js/views/information.html'
        }
      }
    } )
    
    .state( 'app.about',
    {
      url: '/about',
      
      views:
      {
        'mainContent' :
        {
          templateUrl: 'js/views/about.html'
        }
      }
     } )
    
    .state( 'app.reload',
    {
  	url: '/reload',
  	cache: false,
  	views:
  	{
  		'mainContent' :
  		{
        templateUrl: 'js/views/reload.html',
  			controller: 'ReloadDataController'
  		}
  	}
    } )
    
    ;


    // If none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise( '/app/leaderboard' );
  }