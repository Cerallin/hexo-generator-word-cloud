# hexo-generator-word-cloud

A hexo plugin to generate word cloud.

## Requirements

Python 3 and [word_cloud](https://github.com/amueller/word_cloud) are required.

## Installation

```
npm install hexo-generator-word-cloud
```

## Options

```yml
word_cloud:
  python_path: python3
  output_path: word-cloud.svg
  word_num: 100

  # Generation options
  mask_image: source/_jieba/mask.png
  mask_image_color: source/_jieba/mask-color.png
  max_font_size: 80
  min_font_size: 4
  image_format: svg

  # User dicts
  user_dict: source/_jieba/user_dict.utf-8
  stop_word_dict: source/_jieba/stop_word_dict.utf-8
```

## TODOs

- [x] specify mask image
- [x] specify stop words
- [ ] more options for word_cloud
