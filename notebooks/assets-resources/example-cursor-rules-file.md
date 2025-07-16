# Example 1

## Course Slide Creator - Project Instructions

## Project Goal
Create professional, engaging slides in HTML/Markdown format using the Remark.js framework from a course outline. The slides should be presentation-ready, visually organized, and structured to facilitate effective teaching.

## Slide Structure & Format
- Create slides in HTML format with Remark.js, using markdown syntax within the `<textarea id="source">` element
- Use three dashes `---` to separate individual slides
- Include the proper HTML boilerplate and styling as shown in the example
- Create a cohesive visual style that enhances learning
- Follow modern slide design principles: clean layout, readable fonts, appropriate white space

## Required Slide Elements
For each slide set, include:
- Title slide with course name, instructor name, and date
- Table of contents/agenda slide
- Clearly marked section dividers
- Properly formatted code examples (when needed)
- Summary/conclusion slide
- Reference slide (if applicable)

## Content Development Guidelines
- Transform bullet-point outlines into fully-developed slides
- Use the principle of "one main idea per slide"
- Create appropriate transitions between topics
- Add visual hierarchy through headers (h1, h2, h3)
- Include presenter notes where helpful
- Break complex concepts into sequential slides
- Use `--` for incremental reveal of content within slides
- Format code blocks with appropriate syntax highlighting
- Include placeholders for images with proper formatting (`<img src="path_to_image.png" width="400">`)

## Special Slide Types
- Create different slide layouts using Remark classes:
  - `class: center, middle` for centered title slides
  - Custom layouts using CSS grid/flex for complex content
- Include demo placeholders clearly marked with highlighted backgrounds
- Create useful visual elements like diagrams, flowcharts, etc. using HTML/CSS

## CSS Styling
- Include appropriate font imports (Google Fonts)
- Ensure consistent color scheme throughout
- Provide readable text contrast
- Style code blocks appropriately
- Include CSS for responsive design
- Format lists, tables, and other elements consistently

## Technical Requirements
- Ensure HTML is properly formatted and valid
- Include all necessary script tags and CSS
- Structure content to be readable in the source textarea
- Format the markdown content with proper indentation
- Enable proper rendering in browser
- Follow best practices for accessibility

## Input Requirements
I will provide:
- Course title and instructor information
- Date of presentation
- Detailed outline or bullet points for content
- Notes about specific examples or demos to include
- Any particular stylistic preferences

## Output Format
The complete HTML file with embedded markdown content that can be directly opened in a browser using Remark.js to present the slides.

## Examples
I've provided a sample slide deck in the prompt that shows the structure and formatting I prefer. Please follow this style while incorporating the content I provide.

## Process
1. Start by creating the basic HTML structure with proper styling
2. Develop a title slide and table of contents
3. Transform each section of my outline into appropriate slides
4. Add visual elements, code examples, and formatting
5. Include proper transitions and incremental reveals
6. Finalize with conclusion and reference slides

# Example 2
You are instructing, a senior developer with superpowers!

# Agent Behavior

The AI should:
- Read the 'Roadmap.md' file in the '/docs' folder first to see thi
product requirements.
- Before coding, write a short plan
- Once approved, implement the code in Next.js with ShadCN UI
components.
- Write basic tests to confirm each new feature works.
•• •

# General Code Standards

- Use TypeScript for all 'ts' and '.tsx files.
- Avoid inline CSS
- Don't push changes until tests pass.
.. •

# Additional Guidance

- We use the Next.js App Router (*app/ folder).
- Do not remove or overwrite existing *cursor/rules