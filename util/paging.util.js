const constant = require('./constant');

class PagingUtil {
  paging(params) {
    this.totalRow = Number(params.totalRow) || 0;
    this.rowPerPage = Number(params.rowPerPage) || constant.DEFAULT_PAGING_LIMIT;
    this.pagePerGroup = Number(params.pagePerGroup) || constant.DEFAULT_GROUP_LIMIT;
    this.page = Number(params.page) || 1;

    this.totalPage = Math.ceil(this.totalRow / this.rowPerPage);
    this.totalGroup = Math.ceil(this.totalPage / this.pagePerGroup);
    this.group = Math.ceil(this.page / this.pagePerGroup);

    const prevGroup = this.prevGroup();
    const prevPage = this.prevPage();
    const nextPage = this.nextPage();
    const nextGroup = this.nextGroup();

    const start = (this.group - 1) * this.pagePerGroup + 1;
    const end = this.group * this.pagePerGroup > this.totalPage ? this.totalPage : this.group * this.pagePerGroup;

    params.startRow = (this.page - 1) * this.rowPerPage;
    params.endRow = this.rowPerPage;
    params.page = this.page;
    params.rowPerPage = this.rowPerPage;

    if (this.totalPage === 0) {
      return '';
    }

    let template = '';

    template += `<li><a href="javascript:;" onclick="goPage(${prevGroup})"><i class="fas fa-angle-double-left"></i></a></li>`;

    if (prevPage > -1) {
      template += `<li><a href="javascript:;" onclick="goPage(${prevPage})"><i class="fas fa-angle-left"></i></a></li>`;
    }

    for (let i = start; i <= end; i++) {
      if (i === this.page) {
        template += `<li class="on"><a href="javascript:;">${i}</a></li>`;
      } else {
        template += `<li><a href="javascript:;" onclick="goPage(${i})">${i}</a></li>`;
      }
    }

    if (nextPage > -1) {
      template += `<li><a href="javascript:;" onclick="goPage(${nextPage})"><i class="fas fa-angle-right"></i></a></li>`;
    }

    template += `<li><a href="javascript:;" onclick="goPage(${nextGroup})"><i class="fas fa-angle-double-right"></i></a></li>`;

    this.template = template;

    return template;
  }

  prevGroup() {
    if (this.group > 1) {
      return (this.group - 1) * this.pagePerGroup;
    }

    return 1;
  }

  nextGroup() {
    if (this.group < this.totalGroup) {
      return this.group * this.pagePerGroup + 1;
    }

    return this.totalPage;
  }

  prevPage() {
    if (this.page > 1) {
      return this.page - 1;
    }

    return 1;
  }

  nextPage() {
    if (this.page < this.totalPage) {
      return this.page + 1;
    }

    return this.totalPage;
  }
}

module.exports = PagingUtil;
