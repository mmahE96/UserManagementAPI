interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  secret: string;
}

interface Profile {
  id: string;
  firstname: string;
  lastname: string;
  userId: string?;
  phoneNumber: string?;
  country: string?;
  state: string?;
  city: string?;
  address: string?;
  zipCode: string?;
  user: string?;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      BASE_URL: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_LIFE: string;
      REFRESH_TOKEN_LIFE: string;
      USER: string;
      PASS: string;
      SERVICE: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URI: string;
      REFRESH_TOKEN: string;
      ORIGIN_URL: string;
      AUTH_TOKEN: string;
    }
  }
}

export { User };
