import io
import re
from xml.sax.saxutils import escape

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

# Gutenberg wraps every plain-text release with a standard legal preamble
# and postamble around these markers — stripping them is explicitly
# permitted by their license as long as the result isn't redistributed
# under the "Project Gutenberg" name, which this isn't: it's a personal
# reading copy generated for one youth on our own platform.
_START_RE = re.compile(r'^\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*$', re.IGNORECASE | re.MULTILINE)
_END_RE = re.compile(r'^\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*$', re.IGNORECASE | re.MULTILINE)


def _strip_boilerplate(text):
    start_match = _START_RE.search(text)
    end_match = _END_RE.search(text)
    start = start_match.end() if start_match else 0
    end = end_match.start() if end_match else len(text)
    return text[start:end].strip()


def _to_paragraphs(text):
    """Gutenberg's plain text hard-wraps every line at ~70 characters, which
    looks broken if rendered as-is. Blank lines are the only reliable
    paragraph boundary in these files, so join each paragraph's lines back
    into one logical line and let reportlab's Paragraph flow it properly.
    """
    text = text.replace('\r\n', '\n')
    for block in re.split(r'\n\s*\n', text):
        joined = ' '.join(line.strip() for line in block.splitlines() if line.strip())
        if joined:
            yield joined


def _draw_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont('Times-Roman', 9)
    canvas.setFillColor('#888888')
    canvas.drawCentredString(doc.pagesize[0] / 2, 0.6 * inch, str(canvas.getPageNumber()))
    canvas.restoreState()


def build_book_brief_pdf(book):
    """Renders a one-page 'DERA Book Brief' for a curated, copyrighted book:
    our own summary and recommendation notes, never the book's own text —
    we hold no rights to redistribute that. Clearly labelled as a brief, and
    points the reader to the real book via the platform's Start Reading
    link, so nobody mistakes it for a substitute for actually reading it.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=LETTER,
        topMargin=1 * inch,
        bottomMargin=1 * inch,
        leftMargin=1.15 * inch,
        rightMargin=1.15 * inch,
        title=f'{book.title} — DERA Book Brief',
        author=book.author,
    )

    styles = getSampleStyleSheet()
    label_style = ParagraphStyle(
        'BriefLabel', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10,
        textColor='#366800', spaceAfter=8,
    )
    title_style = ParagraphStyle(
        'BriefTitle', parent=styles['Title'], fontName='Times-Bold', fontSize=24, leading=30, spaceAfter=4,
    )
    author_style = ParagraphStyle(
        'BriefAuthor', parent=styles['Normal'], fontName='Times-Italic', fontSize=13,
        textColor='#555555', spaceAfter=14,
    )
    meta_style = ParagraphStyle(
        'BriefMeta', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5,
        textColor='#666666', spaceAfter=18,
    )
    heading_style = ParagraphStyle(
        'BriefHeading', parent=styles['Heading2'], fontName='Times-Bold', fontSize=13,
        spaceBefore=16, spaceAfter=6, textColor='#1B4332',
    )
    body_style = ParagraphStyle(
        'BriefBody', parent=styles['Normal'], fontName='Times-Roman', fontSize=11, leading=16,
        alignment=TA_JUSTIFY, spaceAfter=8,
    )
    bullet_style = ParagraphStyle('BriefBullet', parent=body_style, leftIndent=16, bulletIndent=4, spaceAfter=6)
    footer_style = ParagraphStyle(
        'BriefFooter', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=9,
        textColor='#888888', spaceBefore=24,
    )

    meta_bits = [book.get_category_display(), book.get_reading_level_display()]
    if book.estimated_reading_time:
        meta_bits.append(book.estimated_reading_time)

    story = [
        Paragraph('DERA BOOK BRIEF', label_style),
        Paragraph(escape(book.title), title_style),
        Paragraph(f'by {escape(book.author)}', author_style),
        Paragraph(escape('  •  '.join(meta_bits)), meta_style),
    ]

    if book.who_should_read:
        story.append(Paragraph('Who Should Read This', heading_style))
        story.append(Paragraph(escape(book.who_should_read), body_style))

    if book.why_recommended:
        story.append(Paragraph('Why We Recommend It', heading_style))
        story.append(Paragraph(escape(book.why_recommended), body_style))

    if book.key_lessons:
        story.append(Paragraph('Key Lessons', heading_style))
        for lesson in book.key_lessons:
            story.append(Paragraph(f'•  {escape(str(lesson))}', bullet_style))

    story.append(Paragraph(
        "This brief is DERA's own summary and recommendation notes — not the book's text, which we don't "
        'hold rights to distribute. Use the Start Reading link on the platform to get the real book.',
        footer_style,
    ))

    doc.build(story, onFirstPage=_draw_page_number, onLaterPages=_draw_page_number)
    return buffer.getvalue()


def build_pdf(title, author, raw_text):
    """Renders a Self Development Library book into a proper typeset PDF:
    a title page, justified serif body paragraphs (not a monospaced dump of
    Gutenberg's hard-wrapped lines), and page numbers.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=LETTER,
        topMargin=1 * inch,
        bottomMargin=1 * inch,
        leftMargin=1.15 * inch,
        rightMargin=1.15 * inch,
        title=title,
        author=author,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'BookTitle', parent=styles['Title'], fontName='Times-Bold', fontSize=28, leading=34, alignment=TA_CENTER,
    )
    author_style = ParagraphStyle(
        'BookAuthor', parent=styles['Normal'], fontName='Times-Italic', fontSize=15,
        alignment=TA_CENTER, textColor='#555555', spaceBefore=12,
    )
    body_style = ParagraphStyle(
        'Body', parent=styles['Normal'], fontName='Times-Roman', fontSize=11, leading=16,
        alignment=TA_JUSTIFY, spaceAfter=10, firstLineIndent=18,
    )

    story = [
        Spacer(1, 2.4 * inch),
        Paragraph(escape(title), title_style),
        Paragraph(f'by {escape(author)}', author_style),
        PageBreak(),
    ]
    for paragraph in _to_paragraphs(_strip_boilerplate(raw_text)):
        story.append(Paragraph(escape(paragraph), body_style))

    doc.build(story, onFirstPage=_draw_page_number, onLaterPages=_draw_page_number)
    return buffer.getvalue()
