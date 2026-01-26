import argparse
import sys
import os
import json
import math
from typing import List, Optional

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow library is not installed. Please install it using 'pip install Pillow'")
    sys.exit(1)

def get_frames_from_gif(path: str) -> List[Image.Image]:
    """Extracts frames from a GIF file."""
    try:
        gif = Image.open(path)
        frames = []
        try:
            while True:
                # Copy frame to avoid issues with seek
                frame = gif.copy().convert('RGBA')
                frames.append(frame)
                gif.seek(gif.tell() + 1)
        except EOFError:
            pass
        return frames
    except Exception as e:
        print(f"Error reading GIF: {e}")
        sys.exit(1)

def get_frames_from_dir(path: str) -> List[Image.Image]:
    """Loads all images from a directory, sorted alphanumerically."""
    valid_exts = {'.png', '.jpg', '.jpeg', '.bmp', '.tiff'}
    files = sorted([
        os.path.join(path, f) for f in os.listdir(path)
        if os.path.splitext(f.lower())[1] in valid_exts
    ])
    
    if not files:
        print(f"No image files found in {path}")
        sys.exit(1)
        
    images = []
    for f in files:
        try:
            img = Image.open(f).convert('RGBA')
            images.append(img)
        except Exception as e:
            print(f"Warning: Could not open {f}: {e}")
            
    return images

def create_spritesheet(frames: List[Image.Image], output_path: str, rows: int):
    if not frames:
        print("No frames identified.")
        sys.exit(1)

    # Assume all frames should be the size of the first one
    frame_width, frame_height = frames[0].size
    
    # Calculate columns based on rows
    total_frames = len(frames)
    cols = math.ceil(total_frames / rows)
    
    if total_frames % rows != 0:
        print(f"Warning: Total frames ({total_frames}) is not evenly divisible by rows ({rows}). Last row will be incomplete.")

    # Create canvas
    sheet_width = cols * frame_width
    sheet_height = rows * frame_height
    spritesheet = Image.new('RGBA', (sheet_width, sheet_height), (0, 0, 0, 0))

    # Paste frames
    for i, frame in enumerate(frames):
        # Resize if necessary (optional, but good for robustness)
        if frame.size != (frame_width, frame_height):
            print(f"Warning: Frame {i} size {frame.size} differs from base {frames[0].size}. Resizing.")
            frame = frame.resize((frame_width, frame_height))
            
        row = i // cols
        col = i % cols
        
        x = col * frame_width
        y = row * frame_height
        
        spritesheet.paste(frame, (x, y))

    # Save
    spritesheet.save(output_path)
    print(f"Spritesheet saved to {output_path}")
    
    # Generate Manifest info
    manifest_snippet = {
        "key": "TODO_KEY_NAME",
        "path": f"assets/sprites/{os.path.basename(output_path)}",
        "frameWidth": frame_width,
        "frameHeight": frame_height,
        "frameCount": cols,
        "directions": rows
    }
    
    print("\nManifest JSON Snippet:")
    print(json.dumps(manifest_snippet, indent=2))

def main():
    parser = argparse.ArgumentParser(description="Generate a spritesheet from images or a GIF.")
    parser.add_argument('input', help="Path to a GIF file or a directory of images")
    parser.add_argument('--output', '-o', default='output_sprite.png', help="Output path for the spritesheet")
    parser.add_argument('--rows', '-r', type=int, default=8, help="Number of rows (directions). Default 8.")

    args = parser.parse_args()
    
    input_path = args.input
    if os.path.isfile(input_path):
        # Assume GIF if single file (or try to load as image)
        # Check extension?
        if input_path.lower().endswith('.gif'):
             frames = get_frames_from_gif(input_path)
        else:
             print("Single file input provided. Assuming it is a GIF or you wanted a 1-frame sprite.")
             # Try loading as single image
             try:
                 frames = [Image.open(input_path).convert('RGBA')]
             except:
                  # Maybe it's a GIF?
                  frames = get_frames_from_gif(input_path)
    elif os.path.isdir(input_path):
        frames = get_frames_from_dir(input_path)
    else:
        print(f"Error: Input {input_path} not found.")
        sys.exit(1)

    create_spritesheet(frames, args.output, args.rows)

if __name__ == "__main__":
    main()
