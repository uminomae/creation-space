import os
import sys
import argparse
from pathlib import Path
from datetime import datetime
from google import genai
from google.genai import types

def generate_diagram_image(svg_path, output_dir):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is not set.")
        sys.exit(1)

    client = genai.Client(api_key=api_key)
    
    # Read SVG content to understand the theme
    svg_content = Path(svg_path).read_text()
    
    # Define the output filename based on input
    base_name = Path(svg_path).stem
    output_path = Path(output_dir) / f"{base_name}.png"

    # Construct a high-quality prompt for Gemini image generation
    # We want a "kesson-space" aesthetic: dark, glowing, organic, abstract, 3D-like
    prompt = f"""
Create a high-fidelity conceptual diagram image based on the following theme and structure.

Theme: {base_name}
Context: This is for a project called 'kesson-space' (missing-driven thinking).
Aesthetic: Dark void background, glowing ethereal lights, organic connections, 3D-like depth, minimalist but sophisticated.

SVG Content for Structure:
{svg_content}

Visual Description:
- The central node should be a soft, glowing core representing the main theme.
- The categories (clusters) should be groups of smaller glowing orbs or geometric shapes floating in 3D space.
- Use thin, pulsing lines of light (like neural pathways or star charts) to connect the nodes.
- Color palette: Deep blacks/charcoals for background, with accent glows in muted red, blue, and gold (as indicated in SVG colors).
- The atmosphere should feel like a 'consciousness space' or 'cosmic network'.
- Do NOT include text from the SVG directly in the image, but represent the 'weight' and 'importance' of the text through visual intensity.
- Style: Cinematic, abstract 3D render, high contrast, soft bokeh.
"""

    print(f"Generating image for {base_name}...")
    
    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-image-preview", # Using the preview image model
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            ),
        )

        # Check if we got an image
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                output_path.write_bytes(part.inline_data.data)
                print(f"Successfully saved image to: {output_path}")
                return

        print("Error: No image data found in response.")
    except Exception as e:
        print(f"Error calling Gemini API: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("svg_path", help="Path to the source SVG file")
    parser.add_argument("--output-dir", default="creation-space/assets/img/generated/", help="Directory to save the image")
    args = parser.parse_args()

    generate_diagram_image(args.svg_path, args.output_dir)
