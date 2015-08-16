angular.module('gyazzapp.model.db', [])

# Database information
.factory 'DB', ($q) ->
  db
  self = this

  errorCB = (err) ->
    console.log "SQL 実行中にエラーが発生しました:#{err.code}"

  initQuery = (tx) ->
    tx.executeSql 'CREATE TABLE IF NOT EXISTS TestTable (
      id integer primary key autoincrement,
      title text unique,
      created datetime default current_timestamp)'

  successCB = ->

  db = window.openDatabase "Database", "1.0", "TestDatabase", 200000
  db.transaction initQuery, errorCB, successCB

  self.query = (query) ->
    deferred =  do $q.defer
    db.transaction (transaction) ->
      transaction.executeSql query, [], (transaction, result) ->
        deferred.resolve result
      , (transaction, error) ->
        deferred.reject error

    return deferred.promise

  return self
