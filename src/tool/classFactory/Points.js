import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Points {
    constructor(options) {
        options = options || {};
        for (let attr in options) {
            this[attr] = options[attr];
        }
    }

    add() {
        return Axios({
            url: `/api/admin/points`,
            method: 'post',
            data: {
                name: this.name,
                classify: this.classify,
                points: this.points
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    edit() {
        return Axios({
            url: `/api/admin/points/${this.id}`,
            method: 'put',
            data: {
                name: this.name,
                classify: this.classify,
                points: this.points
            }
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    delete() {
        return Axios({
            url: `/api/admin/points/${this.id}`,
            method: 'delete'
        }).then(
            res => Promise.resolve(res),
            err => Promise.reject(err)
        );
    }

    getList(data) {
        return Axios({
            url: `/api/admin/points`,
            method: 'get',
            params: data
        }).then(
            res => {
                res.data.data = res.data.data || [];
                let list = res.data.data;
                list.map(item => {
                    item.createdAt = dateFormat(item.createdAt);
                });
                return Promise.resolve(res);
            },
            err => Promise.reject(err)
        );
    }
}
