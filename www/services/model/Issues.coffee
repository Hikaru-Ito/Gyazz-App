angular.module('gyazzapp.model.issues', [])
.factory 'Issues', ($http, GITHUB_ISSUE_API_URL) ->

  return {

    # GITHUBのISSUEを取得する
    getIssues: (label) ->
      $.ajax
        url: GITHUB_ISSUE_API_URL + '?labels=' + label
      .then (data) ->
        i = 0
        issues = []
        $.each data, (i, value) ->
          issue =
            id: i
            number: value['number']
            title: value['title']
            url: value['html_url']
            user_name: value['user']['login']
            user_icon: value['user']['avatar_url']
            body: value['body']
          issues.push issue
        return issues

    # Issueのタイトルを取得（だからなんだこれは）
    getIssue: (title) ->
      issue = title: title
      return issue

  }