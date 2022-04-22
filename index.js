const generator = require('./lib/generator');
const stripHtml = hexo.extend.helper.get('strip_html').bind(hexo);

const options = Object.assign({
  python_path: 'python3',
  output_path: 'word-cloud.svg',
  word_num: 100,
}, hexo.config.word_cloud);

hexo.extend.generator.register('word-cloud', generator(options, stripHtml));
