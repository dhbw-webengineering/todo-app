const BASE_PATH = process.env.NEXT_PUBLIC_BACKEND_BASE_PATH;

if (!BASE_PATH) {
    throw new Error("NEXT_PUBLIC_BACKEND_BASE_PATH is not defined");
}

export class ApiRoute {
    static readonly BASE_PATH = BASE_PATH;
    static readonly TODOS = `${ApiRoute.BASE_PATH}/todos`;
    static readonly LOGIN = `${ApiRoute.BASE_PATH}/login`;
    static readonly LOGOUT = `${ApiRoute.BASE_PATH}/logout`;
    static readonly REGISTER = `${ApiRoute.BASE_PATH}/register`;
    static readonly CATEGORY = `${ApiRoute.BASE_PATH}/category`;
    static readonly TAGS = `${ApiRoute.BASE_PATH}/tags`;
    static readonly RESET_PASSWORD_TOKEN_VERIFY = `${ApiRoute.BASE_PATH}/reset-password-token-verify`;
    static readonly RESET_PASSWORD_REQUEST = `${ApiRoute.BASE_PATH}/reset-password-request`;
    static readonly RESET_PASSWORD = `${ApiRoute.BASE_PATH}/reset-password`;
    static readonly SEARCH = `${ApiRoute.BASE_PATH}/todos/search`;
    static readonly ME = `${ApiRoute.BASE_PATH}/me`;
    static readonly USER = `${ApiRoute.BASE_PATH}/user`;
}