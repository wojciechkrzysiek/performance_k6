export class TestContext {
    constructor() {
        this.host = `${__ENV.apphost}`;
        this.baseUrl = `https://${this.host}`;
        this.authorization = `${__ENV.authorization}`;
        this.defaultParams = {
            headers: {
                'Host': `${this.host}`,
                'Authorization': `Basic ${this.authorization}`,
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
        };
    }
}

export default TestContext;