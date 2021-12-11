export default class UserException {
    constructor(message) {
        this.message = message;
        this.name = "UserException";
    }
    static toString() { return this.name + ': "' + this.message + '"'; }
}