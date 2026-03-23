import os
import sys
import argparse
from pathlib import Path
from google import genai

def generate_visual_prompts(svg_path, output_file):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable is not set.")
        sys.exit(1)

    client = genai.Client(api_key=api_key)
    
    # Read SVG content
    svg_content = Path(svg_path).read_text()
    base_name = Path(svg_path).stem

    # Prompt to generate an image generation prompt
    meta_prompt = f"""
以下の SVG ファイルの内容を解析し、Imagen 3, DALL-E 3, Midjourney 等の画像生成 AI で使用するための「超高精度な画像生成プロンプト」を作成してください。

SVG 内容:
{svg_content}

コンセプト:
- プロジェクト名: kesson-space (欠損駆動思考)
- 世界観: 暗闇の中に浮かぶ光、有機的なつながり、未完成の美、3D的な奥行き
- スタイル: Abstract, Cinematic, 3D Render, High Contrast, Ethereal

出力形式:
1. テーマ名 (日本語)
2. 画像生成用プロンプト (英語) - 詳細な視覚的記述を含めること
3. 画像生成用プロンプト (日本語訳)
4. 意図と視覚的ポイントの解説
"""

    print(f"Generating visual prompts for {base_name}...")
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=meta_prompt
        )

        result = f"## {base_name}\n\n{response.text}\n\n---\n"
        
        # Append to output file
        with open(output_file, "a", encoding="utf-8") as f:
            f.write(result)
        
        print(f"Prompts successfully saved to: {output_file}")
    except Exception as e:
        print(f"Error calling Gemini API: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("svg_path", help="Path to the source SVG file")
    parser.add_argument("--output-file", default="creation-space/assets/img/generated/prompts.md", help="Markdown file to save prompts")
    args = parser.parse_args()

    # Ensure output directory exists
    Path(args.output_file).parent.mkdir(parents=True, exist_ok=True)
    
    generate_visual_prompts(args.svg_path, args.output_file)
