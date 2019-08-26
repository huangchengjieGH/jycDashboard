import Axios from '../axios'

export default class My {
    constructor(options) {
        options = options || {};
        for (let name in options) {
            this[name] = options[name] || '';
        }
    }

    currentUser() {
        return Axios({
            url: '/api/user/current',
            method: 'get'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }
}