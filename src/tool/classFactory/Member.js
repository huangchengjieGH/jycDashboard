import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Member {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  add() {
    return Axios({
      url: `/api/admin/member`,
      method: 'post',
      data: {
        name: this.name,
        username: this.username,
        classify: this.classify,
        headImgUrl: this.headImgUrl,
        politicalStatus: this.politicalStatus,
        isAdmin: this.isAdmin || false,
        isScorer: this.isScorer || false,
        isSecretary: this.isSecretary || false
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    return Axios({
      url: `/api/admin/member/${this.id}`,
      method: 'put',
      data: {
        name: this.name,
        username: this.username,
        classify: this.classify,
        headImgUrl: this.headImgUrl,
        politicalStatus: this.politicalStatus,
        isAdmin: this.isAdmin || false,
        isScorer: this.isScorer || false,
        isSecretary: this.isSecretary || false
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/member/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList(search) {
    return Axios({
      url: `/api/admin/member`,
      method: 'get',
      params: search
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
