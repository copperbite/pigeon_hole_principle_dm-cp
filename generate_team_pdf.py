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
        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header (pages after first)
        if self._pageNumber > 1:
            self.drawString(54, 11 * 72 - 36, "Pigeonhole Principle Backend — 4-Person Code Explanation Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E0"))
            self.setLineWidth(0.75)
            self.line(54, 11 * 72 - 42, 8.5 * 72 - 54, 11 * 72 - 42)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * 72 - 54, 36, footer_text)
        self.drawString(54, 36, "Presentation & Viva Guide | C++ Data Structures & Discrete Mathematics")
        self.setStrokeColor(colors.HexColor("#CBD5E0"))
        self.setLineWidth(0.75)
        self.line(54, 48, 8.5 * 72 - 54, 48)
        self.restoreState()

def build_pdf(filename="Pigeonhole_Principle_4_Person_Team_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=50,
        rightMargin=50,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()
    
    # Palette
    c_primary = colors.HexColor("#1A365D")    # Deep Navy
    c_secondary = colors.HexColor("#2B6CB0")  # Slate Blue
    c_accent = colors.HexColor("#3182CE")     # Vibrant Blue
    c_dark = colors.HexColor("#2D3748")       # Charcoal
    c_light = colors.HexColor("#F7FAFC")      # Off white
    c_border = colors.HexColor("#E2E8F0")     # Light gray
    c_script_bg = colors.HexColor("#EDF2F7")  # Script bubble
    c_p1 = colors.HexColor("#DD6B20")         # Orange accent
    c_p2 = colors.HexColor("#3182CE")         # Blue accent
    c_p3 = colors.HexColor("#38A169")         # Green accent
    c_p4 = colors.HexColor("#805AD5")         # Purple accent

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_primary,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=c_secondary,
        spaceAfter=10
    )

    person_title_style = ParagraphStyle(
        'PersonTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=c_primary,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=c_dark,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2
    )

    script_style = ParagraphStyle(
        'SpeakingScript',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1A202C")
    )

    code_inline = ParagraphStyle(
        'CodeInline',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#2C5282")
    )

    story = []

    # Title Banner
    story.append(Paragraph("Backend Code Walkthrough: 4-Person Team Guide", title_style))
    story.append(Paragraph("Structured breakdown, speaking scripts, and Q&A points for backend.cpp", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_accent, spaceBefore=0, spaceAfter=8))

    # Overview Table
    summary_data = [
        [
            Paragraph("<b>Member</b>", body_style),
            Paragraph("<b>Assigned Section & Lines</b>", body_style),
            Paragraph("<b>Core Focus / DSA Concepts</b>", body_style)
        ],
        [
            Paragraph("<font color='#C05621'><b>Person 1</b></font>", body_style),
            Paragraph("Lines 1–46 (<code>Pigeon</code> & <code>Pigeonhole</code>)", code_inline),
            Paragraph("Domain entities, dynamic vector container, bucket encapsulation.", body_style)
        ],
        [
            Paragraph("<font color='#2B6CB0'><b>Person 2</b></font>", body_style),
            Paragraph("Lines 48–118 (<code>PigeonholeTable</code>)", code_inline),
            Paragraph("Hash table mapping, O(1) modulo hash, theorem calculation ⌈n/k⌉.", body_style)
        ],
        [
            Paragraph("<font color='#276749'><b>Person 3</b></font>", body_style),
            Paragraph("Lines 120–195 (Service & Serialization)", code_inline),
            Paragraph("Simulation bounds clamping, URL parsing, JSON formatting & CORS.", body_style)
        ],
        [
            Paragraph("<font color='#6B46C1'><b>Person 4</b></font>", body_style),
            Paragraph("Lines 197–257 (Winsock2 Networking)", code_inline),
            Paragraph("Socket setup, TCP binding/listening, event loop, HTTP request dispatch.", body_style)
        ],
    ]
    sum_table = Table(summary_data, colWidths=[70, 180, 260])
    sum_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EDF2F7")),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(sum_table)
    story.append(Spacer(1, 8))

    # ------------------ PERSON 1 ------------------
    story.append(Paragraph("<font color='#DD6B20'><b>👤 Person 1: Domain Entities & Bucket Data Structures</b></font> (Lines 1–46)", person_title_style))
    story.append(Paragraph("<b>Code Scope:</b> Header inclusions, <code>struct Pigeon</code>, and <code>class Pigeonhole</code>", body_style))
    story.append(Paragraph("• <b>Item Node (<code>struct Pigeon</code>):</b> Encapsulates individual objects with a unique identifier <code>id</code>.", bullet_style))
    story.append(Paragraph("• <b>Bucket Container (<code>class Pigeonhole</code>):</b> Uses dynamic array <code>std::vector&lt;Pigeon&gt; occupants</code> to store placed items.", bullet_style))
    story.append(Paragraph("• <b>Methods:</b> <code>addPigeon()</code> (inserts item), <code>getCount()</code> (returns load), <code>hasCollision()</code> (returns true when count &gt; 1).", bullet_style))
    
    p1_script = [
        [Paragraph("<b>🗣️ Speaking Script:</b><br/><i>\"I am responsible for the foundational data models in our backend. We modeled the Pigeonhole problem using Object-Oriented principles. 'Pigeon' represents an individual item node with an ID. 'Pigeonhole' represents each container bucket, utilizing a dynamic array (std::vector) to store its occupants. It provides helper methods such as addPigeon() and hasCollision(), which instantly detects if more than one object lands in the same slot.\"</i>", script_style)]
    ]
    p1_table = Table(p1_script, colWidths=[510])
    p1_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FFFAF0")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#FEEBC8")),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p1_table)
    story.append(Spacer(1, 8))

    # ------------------ PERSON 2 ------------------
    story.append(Paragraph("<font color='#3182CE'><b>👤 Person 2: Hash Table & Mathematical Engine</b></font> (Lines 48–118)", person_title_style))
    story.append(Paragraph("<b>Code Scope:</b> <code>class PigeonholeTable</code> (Hash function, distribution, and mathematical theorems)", body_style))
    story.append(Paragraph("• <b>Hash Table Model:</b> Maintains an array of buckets <code>vector&lt;Pigeonhole&gt; holes</code> and an assignment map <code>vector&lt;int&gt; assignments</code>.", bullet_style))
    story.append(Paragraph("• <b>Hash Mapping:</b> <code>hashFunction(i) = i % numHoles</code> runs in <b>O(1)</b> time complexity.", bullet_style))
    story.append(Paragraph("• <b>Distribution:</b> <code>distribute()</code> iterates through all <i>n</i> objects and inserts them into mapped buckets in <b>O(n)</b> time.", bullet_style))
    story.append(Paragraph("• <b>Pigeonhole Guarantee:</b> Implements <code>(totalObjects + numHoles - 1) / numHoles</code> to compute &lceil;n / k&rceil;.", bullet_style))
    
    p2_script = [
        [Paragraph("<b>🗣️ Speaking Script:</b><br/><i>\"I handle the core computational structure, PigeonholeTable. It functions as a Hash Table with separate chaining. The hashFunction maps each item using modulo hashing in O(1) time. The distribute() method places all n objects into their corresponding buckets in O(n) time. It also computes the mathematical guarantee ceil(n/k) using integer ceiling division, mathematically proving the minimum density in the maximally occupied bucket.\"</i>", script_style)]
    ]
    p2_table = Table(p2_script, colWidths=[510])
    p2_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EBF8FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#BEE3F8")),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p2_table)
    story.append(Spacer(1, 8))

    # ------------------ PERSON 3 ------------------
    story.append(Paragraph("<font color='#38A169'><b>👤 Person 3: Service Layer, Query Parser & JSON Serializer</b></font> (Lines 120–195)", person_title_style))
    story.append(Paragraph("<b>Code Scope:</b> <code>SimulationResult</code>, <code>runSimulation()</code>, <code>parseQueryParameters()</code>, and <code>serializeToJson()</code>", body_style))
    story.append(Paragraph("• <b>DTO & Clamping:</b> <code>SimulationResult</code> packages output; <code>clampValue()</code> ensures valid safe ranges (objects: 1–30, boxes: 1–12).", bullet_style))
    story.append(Paragraph("• <b>URL Query Parser:</b> Uses <code>std::stringstream</code> and string splitting to parse key-value pairs into a <code>std::map</code>.", bullet_style))
    story.append(Paragraph("• <b>JSON & Response:</b> Serializes distribution arrays into JSON and attaches HTTP headers (including CORS <code>Access-Control-Allow-Origin: *</code>).", bullet_style))
    
    p3_script = [
        [Paragraph("<b>🗣️ Speaking Script:</b><br/><i>\"My part connects the core data structures with the web API. runSimulation() validates and clamps user inputs before executing the table distribution. I implemented parseQueryParameters() using stringstream to extract URL parameters like objects and boxes. Finally, serializeToJson() converts the simulation results into JSON, and sendHttpResponse() wraps it with standard HTTP/1.1 headers and CORS support so our frontend can display it seamlessly.\"</i>", script_style)]
    ]
    p3_table = Table(p3_script, colWidths=[510])
    p3_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F0FFF4")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#C6F6D5")),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p3_table)
    story.append(Spacer(1, 8))

    # ------------------ PERSON 4 ------------------
    story.append(Paragraph("<font color='#805AD5'><b>👤 Person 4: Winsock Networking & Server Main Loop</b></font> (Lines 197–257)", person_title_style))
    story.append(Paragraph("<b>Code Scope:</b> <code>main()</code> entry point, Winsock2 socket setup, listening loop, and client connection management", body_style))
    story.append(Paragraph("• <b>Winsock Setup:</b> Initializes Windows Sockets with <code>WSAStartup(2.2)</code> and creates a TCP socket (<code>AF_INET</code>, <code>SOCK_STREAM</code>).", bullet_style))
    story.append(Paragraph("• <b>Binding & Listening:</b> Binds socket to localhost on port <code>8080</code> and starts listening via <code>listen(server, SOMAXCONN)</code>.", bullet_style))
    story.append(Paragraph("• <b>Event Loop & Routing:</b> Listens in a <code>while(true)</code> loop, accepts client connections via <code>accept()</code>, reads buffer via <code>recv()</code>, routes <code>GET /api/simulate</code>, and safely closes client sockets.", bullet_style))
    
    p4_script = [
        [Paragraph("<b>🗣️ Speaking Script:</b><br/><i>\"I handle the networking infrastructure and runtime server loop. We utilized the native Windows Sockets (Winsock2) library to implement a high-performance HTTP server without external third-party dependencies. In main(), we initialize Winsock, bind to port 8080, and enter an accept loop. When a request arrives, the server checks the route, executes Person 3's simulation pipeline, returns the HTTP response, and gracefully closes the connection.\"</i>", script_style)]
    ]
    p4_table = Table(p4_script, colWidths=[510])
    p4_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#FAF5FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E9D8FD")),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(p4_table)
    story.append(Spacer(1, 10))

    # Q&A Cheat Sheet
    story.append(Paragraph("<b>💡 Viva & Presentation Q&A Cheat Sheet</b>", person_title_style))
    qa_data = [
        [Paragraph("<b>Question</b>", body_style), Paragraph("<b>Target Person & Short Answer</b>", body_style)],
        [Paragraph("Why use <code>std::vector</code> inside <code>Pigeonhole</code>?", body_style), Paragraph("<b>Person 1:</b> To support dynamic separate chaining without fixed size limits.", body_style)],
        [Paragraph("What is the time complexity of the distribution?", body_style), Paragraph("<b>Person 2:</b> <i>O(n)</i> overall because hashing each item takes <i>O(1)</i> time.", body_style)],
        [Paragraph("Why is CORS header needed in HTTP response?", body_style), Paragraph("<b>Person 3:</b> To allow the frontend running on port 3000 to fetch from port 8080.", body_style)],
        [Paragraph("Why use <code>SO_REUSEADDR</code> on the socket?", body_style), Paragraph("<b>Person 4:</b> To allow immediate rebinding to port 8080 without port lock errors.", body_style)],
    ]
    qa_table = Table(qa_data, colWidths=[200, 310])
    qa_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EDF2F7")),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(qa_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Team Guide PDF successfully generated: {filename}")

if __name__ == "__main__":
    build_pdf()
