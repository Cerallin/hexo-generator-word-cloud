from getopt import getopt
import json
import sys
from wordcloud import ImageColorGenerator, WordCloud
import numpy as np
from PIL import Image
import os

min_font_size = 4
image_format = 'SVG'

opts, args = getopt(sys.argv[1:], 'm:c:a:b:f:',
                    ['mask=',
                     'color=',
                     'max-font-size=',
                     'min-font-size=',
                     'image-format='])

for opt_name, opt_value in opts:
    if opt_name in ('-m', '--mask'):
        mask_image = np.array(Image.open(os.path.join(os.getcwd(), opt_value)))
    if opt_name in ('-c', '--color'):
        mask_color = ImageColorGenerator(
            np.array(Image.open(os.path.join(os.getcwd(), opt_value))))
    if opt_name in ('-a', '--max-font-size'):
        size = opt_value
        max_font_size = int(size)
    if opt_name in ('-b', '--min-font-size'):
        size = opt_value
        min_font_size = int(size)
    if opt_name in ('-f', '--image-format'):
        image_format=opt_value.upper()
        if image_format not in ('SVG', 'PNG'):
            raise ValueError("Unsupported image format: %s" % image_format)

wc = WordCloud(
    mask=mask_image,
    width=400,
    height=240,
    mode="RGBA",
    background_color=None,
    min_font_size=min_font_size,
    max_font_size=max_font_size,
)

wc.generate_from_frequencies(json.loads(''.join(sys.stdin.readlines())))

if mask_color:
    wc.recolor(color_func=mask_color)

if image_format == 'SVG':
    print(wc.to_svg())
elif image_format == 'PNG':
    print(wc.to_image())
