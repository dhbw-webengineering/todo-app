export enum ApiRoute {
    BASE_PATH = "http://localhost:3001",
    TODOS = `${ApiRoute.BASE_PATH}/todos`,
    LOGIN = `${ApiRoute.BASE_PATH}/login`,
    LOGOUT = `${ApiRoute.BASE_PATH}/logout`,
    REGISTER = `${ApiRoute.BASE_PATH}/register`
}