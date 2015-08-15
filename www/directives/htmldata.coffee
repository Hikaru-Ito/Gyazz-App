###
  生HTMLを表示するDirective
###
angular.module('gyazzapp.directives.htmldata', [])
.directive 'htmlData', ($compile, $parse) ->
  {
    restrict: 'C'
    link: (scope, element, attr) ->
      scope.$watch attr.content, ->
        element.html $parse(attr.content)(scope)
        $compile(element.contents()) scope
      , true
  }