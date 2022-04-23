from getopt import getopt
import json
import sys
from wordcloud import ImageColorGenerator, WordCloud
import numpy as np
from PIL import Image
import os

min_font_size=4

opts, args = getopt(sys.argv[1:], 'm:c:a:b:',
                    ['mask=',
                     'color=',
                     'max-font-size=',
                     'min-font-size='])

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

print(wc.to_svg())
