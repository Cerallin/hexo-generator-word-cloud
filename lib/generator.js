const jieba = require('nodejieba');
const spawnSync = require('child_process').spawnSync;

module.exports = function (options, stripHtml) {
  jieba.load({
    userDict: options.user_dict || jieba.DEFAULT_USER_DICT,
    stopWordDict: options.stop_word_dict || jieba.DEFAULT_STOP_WORD_DICT,
  });

  return function (locals) {
    const content = locals.posts.map((post) => {
      return stripHtml(post.content.replace(/<pre>.*?<\/pre>/g, ''));
    }).join();

    let frequency = {};
    for (let item of jieba.extract(content, options.word_num)) {
      if (/[0-9]+/.test(item.word))
        continue;
      frequency[item.word] = item.weight;
    }

    args = [require.resolve('../ext/word_cloud.py')];
    if (options.mask_image) {
      args.push(...['-m', options.mask_image]);
    }
    if (options.mask_image_color) {
      args.push(...['-c', options.mask_image_color]);
    }
    if (options.max_font_size) {
      args.push('--max-font-size=' + options.max_font_size);
    }
    if (options.min_font_size) {
      args.push('--min-font-size=' + options.min_font_size);
    }
    if (options.image_format) {
      args.push('--image-format=' + options.image_format);
    }

    var res = spawnSync(options.python_path,
      args, {
      cwd: process.cwd(),
      env: process.env,
      encoding: "utf8",
      input: JSON.stringify(frequency)
    });

    if (res.status !== 0) {
      var error_msg = '\n'
        + '[ERROR][hexo-generator-word-cloud] python exited with code ' + res.status + (res.stderr ? ': ' + res.stderr : '.');
      throw Error(error_msg);
    }

    if (res.stderr) {
      var warn_msg = ''
        + '[WARNING][hexo-generator-word-cloud] ' + res.stderr;
      console.log(warn_msg);
    }

    return {
      path: options.output_path,
      data: res.stdout,
    };
  }
}
