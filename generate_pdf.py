import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header (pages after first)
        if self._pageNumber > 1:
            self.drawString(54, 11 * 72 - 36, "Pigeonhole Principle Lab — Project & Data Structures Report")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 11 * 72 - 42, 8.5 * 72 - 54, 11 * 72 - 42)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 54, 36, footer_text)
        self.drawString(54, 36, "Confidential — Discrete Mathematics & Data Structures")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 48, 8.5 * 72 - 54, 48)
        self.restoreState()

def build_pdf(filename="Pigeonhole_Principle_Project_Report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#1A365D")    # Deep Navy
    c_secondary = colors.HexColor("#2B6CB0")  # Slate Blue
    c_accent = colors.HexColor("#3182CE")     # Vibrant Blue
    c_dark = colors.HexColor("#2D3748")       # Charcoal
    c_light = colors.HexColor("#F7FAFC")      # Off white
    c_border = colors.HexColor("#E2E8F0")     # Light gray

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_primary,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_secondary,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=c_primary,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_secondary,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_dark,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#1A202C")
    )

    story = []

    # Title & Metadata Banner
    story.append(Paragraph("Pigeonhole Principle Simulation", title_style))
    story.append(Paragraph("Complete Project Architecture, Data Structures & Implementation Report", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_accent, spaceBefore=0, spaceAfter=12))

    meta_data = [
        [
            Paragraph("<b>Subject:</b> Discrete Mathematics & Data Structures", body_style),
            Paragraph("<b>Language / Stack:</b> C++ (C++17), JS, HTML5, CSS3", body_style)
        ],
        [
            Paragraph("<b>Backend:</b> Winsock2 Socket Server & DSA Engine", body_style),
            Paragraph("<b>Frontend:</b> Vanilla JS Interactive Visualizer", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[250, 250])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_light),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('BOX', (0, 0), (-1, -1), 1, c_border),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # Section 1: Executive Summary
    story.append(Paragraph("1. Executive Summary", h1_style))
    story.append(Paragraph(
        "This project implements a full-stack educational laboratory demonstrating the <b>Pigeonhole Principle</b>. "
        "The system separates concerns into a lightweight, high-performance C++ backend that handles discrete math calculations "
        "and data structures management, coupled with a responsive web frontend that visualizes the distribution of items into "
        "buckets in real-time.",
        body_style
    ))

    # Section 2: Mathematical Foundations
    story.append(Paragraph("2. Discrete Mathematical Foundations", h1_style))
    story.append(Paragraph(
        "<b>Theorem (Pigeonhole Principle):</b> If <i>n</i> items are put into <i>k</i> containers (where <i>n</i> > <i>k</i>), "
        "then at least one container must contain more than one item.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Generalized Pigeonhole Principle:</b> If <i>n</i> items are distributed among <i>k</i> pigeonholes, then at least one "
        "pigeonhole must contain at least <b>&lceil;n / k&rceil;</b> items, calculated computationally as:",
        body_style
    ))
    
    formula_data = [[
        Paragraph("<font size='10'><b>&lceil; n / k &rceil; = &lfloor; (n + k - 1) / k &rfloor;</b></font><br/><font size='8' color='#718096'>Guaranteed minimum capacity in the maximally occupied bucket</font>", body_style)
    ]]
    formula_table = Table(formula_data, colWidths=[500])
    formula_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EBF8FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#BEE3F8")),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(formula_table)
    story.append(Spacer(1, 10))

    # Section 3: Data Structures in backend.cpp
    story.append(Paragraph("3. Backend Data Structures (C++)", h1_style))
    story.append(Paragraph(
        "The C++ backend (<code>backend.cpp</code>) models the problem domain using standard Object-Oriented Data Structures "
        "patterned after Hash Tables with Separate Chaining:",
        body_style
    ))

    ds_table_data = [
        [
            Paragraph("<b>Data Structure</b>", body_style),
            Paragraph("<b>DSA Concept</b>", body_style),
            Paragraph("<b>Description & Methods</b>", body_style)
        ],
        [
            Paragraph("<code>struct Pigeon</code>", body_style),
            Paragraph("Item Node", body_style),
            Paragraph("Encapsulates individual objects with a unique identifier (<code>int id</code>).", body_style)
        ],
        [
            Paragraph("<code>class Pigeonhole</code>", body_style),
            Paragraph("Bucket / Container", body_style),
            Paragraph("Encapsulates a container holding dynamic item storage (<code>std::vector&lt;Pigeon&gt;</code>). Provides <code>addPigeon()</code>, <code>getCount()</code>, and <code>hasCollision()</code>.", body_style)
        ],
        [
            Paragraph("<code>class PigeonholeTable</code>", body_style),
            Paragraph("Hash Table / Bucket Array", body_style),
            Paragraph("The core mapping structure. Manages the array of buckets (<code>vector&lt;Pigeonhole&gt;</code>) and distribution lookup array (<code>vector&lt;int&gt;</code>).", body_style)
        ],
        [
            Paragraph("<code>std::vector&lt;T&gt;</code>", body_style),
            Paragraph("Dynamic Array", body_style),
            Paragraph("Underlying container for buckets, occupants, and mapped assignments.", body_style)
        ],
        [
            Paragraph("<code>std::map&lt;str, str&gt;</code>", body_style),
            Paragraph("Red-Black Tree Map", body_style),
            Paragraph("Used during HTTP query parsing for key-value extraction.", body_style)
        ]
    ]
    ds_table = Table(ds_table_data, colWidths=[120, 110, 270])
    ds_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EDF2F7")),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(ds_table)
    story.append(Spacer(1, 10))

    # Section 4: Algorithms & Complexity Analysis
    story.append(Paragraph("4. Algorithms & Complexity Analysis", h1_style))
    
    comp_data = [
        [Paragraph("<b>Operation</b>", body_style), Paragraph("<b>Algorithm / Method</b>", body_style), Paragraph("<b>Time Complexity</b>", body_style), Paragraph("<b>Space Complexity</b>", body_style)],
        [Paragraph("Bucket Hash", body_style), Paragraph("<code>objectIndex % numHoles</code>", body_style), Paragraph("<b>O(1)</b>", body_style), Paragraph("O(1)", body_style)],
        [Paragraph("Distribution", body_style), Paragraph("Sequential bucket insertion", body_style), Paragraph("<b>O(n)</b>", body_style), Paragraph("O(n + k)", body_style)],
        [Paragraph("Guarantee Calc", body_style), Paragraph("<code>(n + k - 1) / k</code>", body_style), Paragraph("<b>O(1)</b>", body_style), Paragraph("O(1)", body_style)],
        [Paragraph("Collision Check", body_style), Paragraph("Bucket occupancy count scan", body_style), Paragraph("<b>O(k)</b>", body_style), Paragraph("O(1)", body_style)],
    ]
    comp_table = Table(comp_data, colWidths=[110, 190, 100, 100])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EDF2F7")),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 10))

    # Section 5: Architecture & Networking
    story.append(Paragraph("5. System Architecture & REST Communication", h1_style))
    story.append(Paragraph(
        "Communication between the frontend client and C++ backend uses standard HTTP REST protocols over TCP sockets:",
        body_style
    ))
    story.append(Paragraph("• <b>Client Endpoint Request:</b> <code>GET /api/simulate?objects=25&boxes=12</code>", bullet_style))
    story.append(Paragraph("• <b>Winsock TCP Server:</b> Built with <code>socket()</code>, <code>bind()</code>, <code>listen()</code>, and <code>accept()</code> listening on port <code>8080</code>.", bullet_style))
    story.append(Paragraph("• <b>JSON Response Structure:</b>", bullet_style))

    json_snippet = (
        "{\n"
        '  "objects": 8,\n'
        '  "boxes": 5,\n'
        '  "guarantee": 2,\n'
        '  "assignments": [0, 1, 2, 3, 4, 0, 1, 2]\n'
        "}"
    )
    json_table = Table([[Paragraph(f"<pre>{json_snippet}</pre>", code_style)]], colWidths=[500])
    json_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F7FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, c_border),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(json_table)
    story.append(Spacer(1, 10))

    # Section 6: How to Run the Project
    story.append(Paragraph("6. Project Execution Guide", h1_style))
    
    run_steps = [
        [Paragraph("<b>Step</b>", body_style), Paragraph("<b>Command / Action</b>", body_style), Paragraph("<b>Description</b>", body_style)],
        [Paragraph("1. Compile C++", body_style), Paragraph("<code>g++ -std=c++17 backend.cpp -o backend.exe -lws2_32</code>", code_style), Paragraph("Compiles backend with Winsock library.", body_style)],
        [Paragraph("2. Run Backend", body_style), Paragraph("<code>.\\backend.exe</code>", code_style), Paragraph("Launches HTTP API at port 8080.", body_style)],
        [Paragraph("3. Serve Frontend", body_style), Paragraph("<code>python -m http.server 3000</code>", code_style), Paragraph("Hosts web visualizer at port 3000.", body_style)],
        [Paragraph("4. Open Browser", body_style), Paragraph("<code>http://localhost:3000</code>", code_style), Paragraph("Access interactive UI in browser.", body_style)]
    ]
    run_table = Table(run_steps, colWidths=[80, 240, 180])
    run_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EDF2F7")),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(run_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")

if __name__ == "__main__":
    build_pdf()
