const ogs = require('open-graph-scraper');
const error_status = require('../config/error.status');

class ParserUtil {
  async get_meta_og(link) {
    const expression = /^http[s]?\:\/\//i;

    if (!link || !expression.test(link)) {
      throw new Error(error_status.INVALID_DATA.message);
    }

    const option = { url: link, timeout: 3000 };

    try {
      const result = (await ogs(option)).data;
      const data = {
        b_og_title: '',
        b_og_description: '',
        b_og_image: '',
      };

      if (!result) {
        return data;
      }

      data.b_og_title = result.ogTitle || '';
      data.b_og_description = result.ogDescription || '';

      if (data.b_og_title.length > 40) {
        data.b_og_title = `${data.b_og_title.substring(0, 40)} ...`;
      }

      data.b_og_title = data.b_og_title.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '');

      if (data.b_og_description.length > 40) {
        data.b_og_description = `${data.b_og_description.substring(0, 40)} ...`;
      }

      data.b_og_description = data.b_og_description.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '');

      if (result.ogImage && result.ogImage.url) {
        data.b_og_image = result.ogImage.url || '';
      } else if (result.ogImage && Array.isArray(result.ogImage) && result.ogImage.length > 0) {
        data.b_og_image = result.ogImage[0].url || '';
      }

      if (data.b_og_image.indexOf('//') === 0) {
        data.b_og_image = `http:${data.b_og_image}`;
      } else if (data.b_og_image && !expression.test(data.b_og_image)) {
        data.b_og_image = `${link}${data.b_og_image}`;
      }

      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}

module.exports = new ParserUtil();
