const jieba = require('nodejieba');
const spawnSync = require('child_process').spawnSync;

module.exports = function (options, stripHtml) {
  return function (locals) {
    let content = "";
    locals.posts.forEach(function (post) {
      content += stripHtml(post.content.replace(/<pre>.*?<\/pre>/g, ''));
    });

    let frequency = {};
    for (let item of jieba.extract(content, options.word_num)) {
      frequency[item.word] = item.weight;
    }

    // return {
    //   path: options.path,
    //   data: JSON.stringify(frequency)
    // };

    var res = spawnSync(options.python_path, ['node_modules/hexo-generator-word-cloud/ext/word_cloud.py'], {
      cwd: process.cwd(),
      env: process.env,
      encoding: "utf8",
      input: JSON.stringify(frequency)
    });

    if (res.status != 0) {
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
