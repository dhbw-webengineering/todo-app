export class ApiRoute {
    private static BASE_PATH = "http://localhost:3001";
    public static TODOS = `${ApiRoute.BASE_PATH}/todos`;
    public static LOGIN = `${ApiRoute.BASE_PATH}/login`;
    public static LOGOUT = `${ApiRoute.BASE_PATH}/logout`;
    public static REGISTER = `${ApiRoute.BASE_PATH}/register`;
}