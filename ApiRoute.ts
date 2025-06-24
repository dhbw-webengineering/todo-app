const basePath = "http://localhost:3001/api";

export enum ApiRoute {
    ENTRY_LIST = basePath + "/entry/list",
    ENTRY_LIST_NEXT = ENTRY_LIST + "/next"
}