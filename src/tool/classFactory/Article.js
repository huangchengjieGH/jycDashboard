import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Article {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  add() {
    let data = {
      type: this.type,
      title: this.title,
      introduction: this.introduction,
      imgUrl: this.imgUrl,
      content: this.content
    };
    return Axios({
      url: `/api/admin/article`,
      method: 'post',
      data
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    let data = {
      type: this.type,
      title: this.title,
      introduction: this.introduction,
      imgUrl: this.imgUrl,
      content: this.content,
      createdAt: this.createdAt
    };
    return Axios({
      url: `/api/admin/article/${this.id}`,
      method: 'put',
      data
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/article/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getOne() {
    return Axios({
      url: `/api/admin/article/${this.id}`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList(search) {
    return Axios({
      url: `/api/admin/article`,
      method: 'get',
      params: search
    }).then(
      res => {
        res.data.data = res.data.data || [];
        res.data.data.map(item => {
          item.createdAt = dateFormat(item.createdAt);
        });
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }
}
