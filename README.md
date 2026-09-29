The code for my personal page [dobbikov.com](https://dobbikov.com)


## Building

`index.html`, `index-fr.html` and `index-ua.html` are generated. Edit
`templates/index.html` (markup) or `locales/{en,fr,uk}.yaml` (text), then run:

```bash
python3 build.py
```

Needs Jinja2 and PyYAML (`pip install jinja2 pyyaml`). Commit the generated files too.
