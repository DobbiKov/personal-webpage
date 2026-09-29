#!/usr/bin/env python3
"""Render templates/index.html once per language.

    python3 build.py

Writes index.html (en), index-fr.html (fr) and index-ua.html (uk) next to this
file. Translatable text lives in locales/<code>.yaml; links, file names and
list order that are the same in every language live in SITE below.

Requires Jinja2 and PyYAML (pip install jinja2 pyyaml).
"""

from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined

ROOT = Path(__file__).resolve().parent
BASE_URL = "https://korotenky.com/"

# English stays at index.html so existing links keep working. "uk" is the
# ISO 639-1 code for Ukrainian (used for lang/hreflang); the file is "-ua".
LANGUAGES = [
    {"code": "en", "file": "index.html", "short": "EN", "name": "English", "og_locale": "en_US"},
    {"code": "fr", "file": "index-fr.html", "short": "FR", "name": "Français", "og_locale": "fr_FR"},
    {"code": "uk", "file": "index-ua.html", "short": "UA", "name": "Українська", "og_locale": "uk_UA"},
]
for lang in LANGUAGES:
    lang["url"] = BASE_URL if lang["file"] == "index.html" else BASE_URL + lang["file"]

# Language-independent structure. Each "key" points into the locale files.
SITE = {
    # The SDIS 77 group with its two roles is written out in the template.
    "experience_entries": [
        {"key": "lisn_2026", "href": "https://www.lisn.upsaclay.fr/", "photo": "exp-lisn-2026"},
        {"key": "tutor", "href": None, "photo": "exp-tutoring"},
        {"key": "centralesupelec", "href": "https://www.centralesupelec.fr/", "photo": "exp-centralesupelec"},
        {"key": "lisn_2025", "href": "https://www.lisn.upsaclay.fr/", "photo": "exp-lisn-2025"},
        {"key": "devdjsua", "href": None, "photo": "exp-devdjsua"},
        {"key": "freelance", "href": None, "photo": None},
    ],
    "projects": [
        {"key": "lesia", "repo": "lesia"},
        {"key": "loggit", "repo": "loggit"},
        {"key": "open_digraph", "repo": "open_digraph_lib"},
        {"key": "music_sorting", "repo": "melodic-track-mixing-lib"},
        {"key": "gta", "repo": "crmpmode"},
    ],
    "dj_sets": [
        {"name": "2026 Promo Mix", "year": 2026, "slug": "promo-mix-2026"},
        {"name": "Dnipro Last Dance", "year": 2023, "slug": "last-dnipro-dance"},
    ],
    "emails": [
        {"label": "email", "address": "yehor.korotenko@polytechnique.org"},
        {"label": "university_email", "address": "yehor.korotenko@polytechnique.edu"},
    ],
}


def main():
    env = Environment(
        loader=FileSystemLoader(ROOT / "templates"),
        # Locale strings are trusted HTML fragments (see templates/index.html).
        autoescape=False,
        # A key missing from a locale fails the build instead of rendering "".
        undefined=StrictUndefined,
        keep_trailing_newline=True,
    )
    template = env.get_template("index.html")

    for lang in LANGUAGES:
        with open(ROOT / "locales" / f"{lang['code']}.yaml", encoding="utf-8") as f:
            strings = yaml.safe_load(f)
        html = template.render(t=strings, lang=lang, languages=LANGUAGES, **SITE)
        (ROOT / lang["file"]).write_text(html, encoding="utf-8")
        print(f"wrote {lang['file']}")


if __name__ == "__main__":
    main()
