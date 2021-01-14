# Online Academy Backend

Back-end for Advanced Web Application final project

Deployed at [Heroku](https://online-academi.herokuapp.com)

## Team member

| Student ID | Name             |
| ---------- | ---------------- |
| 1753071    | Hương Đạt Minh   |
| 1753081    | Trần Lê Hồng Nhi |
| 1753083    | Nguyễn Hưng Phát |

## Usage

### Clone this repo and install dependencies

```terminal
$ git clone https://github.com/tlhnhi/online-academy-backend
$ cd online-academy-backend
$ npm i
```

### Create an `.env` file in `src`

Including

- `MONGODB_URI`: Connection string to your mongodb
- `JWT_SECRET`: A jwt secret string
- `EMAIL`: Your gmail from which server send OTP for signup
- `PASSWORD`: Password to your gmail
- `PORT`: (optional) - default: 8000
- `DOMAIN`: (optional)

### Start

```terminal
$ npm run dev
```

http://localhost:8000 will be available
