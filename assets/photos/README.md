# Entry photos

Drop a `.jpg` here with the exact filename below and it appears automatically
on the matching About-Me entry (thumbnail on the right, enlarges on hover/tap).
No HTML edits needed — until a file exists, a "photo coming soon" placeholder
box is shown. Landscape ~4:3 crops look best in the enlarged preview.

Each photo needs two files: `name.jpg` (longest side 1200px, loaded only on
hover/tap) and `thumbs/name.jpg` (shortest side 160px, shown in the list).
Strip metadata (phone photos carry GPS). Originals live outside the repo in
`~/Desktop/my_site/photo-originals/`. To process a new original:

    python3 -c "from PIL import Image,ImageOps;import sys;f=sys.argv[1];n=f.split('/')[-1];im=ImageOps.exif_transpose(Image.open(f)).convert('RGB');a=im.copy();a.thumbnail((1200,1200));a.save(n,quality=80,optimize=True,progressive=True);s=160/min(im.size);im.resize((round(im.width*s),round(im.height*s))).save('thumbs/'+n,quality=78,optimize=True)" ~/Desktop/my_site/photo-originals/NAME.jpg

## Education
- `edu-polytechnique.jpg`   — École Polytechnique
- `edu-saclay.jpg`          — Université Paris-Saclay

## Experience
- `exp-sdis-firefighter.jpg` — SDIS 77, Volunteer Firefighter
- `exp-sdis-rd.jpg`          — SDIS 77, R&D Engineer
- `exp-lisn-2026.jpg`        — LISN, Research Engineer Intern (2026)
- `exp-tutoring.jpg`         — Personal Mathematics Tutor
- `exp-centralesupelec.jpg`  — CentraleSupélec, Independent SWE
- `exp-lisn-2025.jpg`        — LISN, Research Intern (2025)
- `exp-devdjsua.jpg`         — DevDJsUa, Software Engineer

(The Freelance entry has no photo slot yet — ask to add one.)
