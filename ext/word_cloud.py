import json
import sys
from wordcloud import WordCloud

print(WordCloud(
    width=800,
    height=480,
    max_font_size=64,
    mode="RGBA",
    background_color=None
).generate_from_frequencies(json.loads(''.join(sys.stdin.readlines()))).to_svg())
