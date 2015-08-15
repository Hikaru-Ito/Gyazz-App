angular.module('gyazzapp.services.values', [])

# GyazzURL
.value 'GYAZZ_URL', 'http://gyazz.masuilab.org/'

# 増井研のWikiネーム
.value 'GYAZZ_WIKI_NAME', '増井研'

# GyazzAppのGithubリポジトリのIssueAPIのエンドポイント
.value 'GITHUB_ISSUE_API_URL', 'https://api.github.com/repos/Hikaru-Ito/Gyazz-App/issues'

# 増井研のGithubToDoリポジトリのIsseuAPIのエンドポイント
.value 'GITHUB_MASUILAB_TODO_API_URL', 'https://api.github.com/repos/masuilab/todo/issues'

# Androidプッシュ通知（GCM）のSenderID
.value 'ANDROID_GCM_SENDER_ID', '545984238773'

# Parse.comの認証情報
.value 'PARSE_API_URL', 'https://api.parse.com/1/installations'
.value 'X_Parse_Application_Id', 'pVATfByzSVGuH1cfC7q9sdfZhOSBBZjoToIRVXli'
.value 'X_Parse_REST_API_Key', 'lyQJVyUEVzJCqq2A5HYNRx5ytlSuNtbjlqkwA6R6'

# GyazzBackendのURLエンドポイント
.value 'GYAZZ_APP_BACKEND_URL', 'http://gyazz-app-api.herokuapp.com'