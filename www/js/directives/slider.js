


angular.module( 'sloRock' ).directive( 'sliderFixHeight', [ '$document', '$timeout', function( $document, $timeout )
{
  return {
    restrict: 'C',
    link: function()
    {
      window.getOffset = function ( el )
      {
        var _x = 0;
        var _y = 0;

        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) )
        {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        return { top: _y, left: _x };
      }
      
      $timeout( function( e )
      {
        var intYtIframeHeight = ( window.innerHeight - getOffset( document.getElementsByClassName( 'songSlide' )[0] ).top - 49 /* Footer bar */ );
        
        objStyle = document.getElementById( 'customStyles' );

        objStyleSheet = objStyle.sheet ? objStyle.sheet : objStyle.styleSheet;
        
        objStyleSheet.insertRule( '.songSlide { height: ' + intYtIframeHeight + 'px; }', 0 );
      }, 30 );
    }
  };
} ] );
