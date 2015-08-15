angular.module('gyazzapp.model.todos', [])
.factory 'Todos', ($http, GITHUB_MASUILAB_TODO_API_URL) ->
  return {

    # 増井研GITHUBのTodoリポジトリのISSUE取得
    getTodos: ->
      $.ajax(url: GITHUB_MASUILAB_TODO_API_URL).then (data) ->
        i = 0
        todos = []
        $.each data, (i, value) ->
          todo =
            id: i
            number: value['number']
            title: value['title']
            url: value['html_url']
            user_name: value['user']['login']
            user_icon: value['user']['avatar_url']
            body: value['body']
            labels: value['labels']
          todos.push todo
        return todos
 }