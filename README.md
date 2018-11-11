# sql-judger-backend

## `/api/archive`

- `GET`

### response data

A JSON array, each element is a problem ID.

```
["problemA", "problemB". "problemC"]
```

## `/api/submitCode`

- `POST`

### request data

```
{"problemID": "problemA", "code": "whatever code"}
```

### response data

A JSON:

- `${status}` is the final result. False means wrong while true means correct.
- `${reason}` is empty when `${status}` is true. And it contains the error message when submission is incorrect.

```
{"status": false, "reason": "Compile error!"}
```

## `/api/description/${problemID}`

- `GET`

### response data

A Markdown document which is the description of this problem.

```
# some markdown document
```

