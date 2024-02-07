export default class ResponseError extends Error {
    status;
    constructor(status: number, message) {
        super(message);
        this.status = status;
    }
}
