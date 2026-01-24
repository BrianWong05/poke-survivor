#!/usr/bin/env python3
"""
Asset Pipeline Script for Poke-Survivor

Downloads PMD-style Pokémon sprites from PMDCollab SpriteServer and processes them
into Phaser-compatible sprite sheets with all 8 directions.

Usage:
    python download_assets.py              # Download default Pokémon
    python download_assets.py 1 4 7        # Download specific IDs
    python download_assets.py --all-ids 1,4,7,25,133,150  # Comma-separated
"""

import argparse
import json
import os
import sys
import tempfile
import xml.etree.ElementTree as ET
import zipfile
from io import BytesIO
from pathlib import Path
from typing import NamedTuple

import requests
from PIL import Image

# =============================================================================
# Configuration
# =============================================================================

# Default Pokémon IDs to download
DEFAULT_POKEMON_IDS = [1, 4, 7, 25, 133, 150]

# PMDCollab SpriteServer URL (provides sprites.zip files)
SPRITESERVER_URL = "https://spriteserver.pmdcollab.org/assets"

# Output directories (relative to project root)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
SPRITES_OUTPUT_DIR = PROJECT_ROOT / "public" / "assets" / "sprites"
MANIFEST_OUTPUT_PATH = PROJECT_ROOT / "public" / "assets" / "manifest.json"

# Cache directory for downloaded zips (not in public, excluded from git)
CACHE_DIR = SCRIPT_DIR / ".cache"

# Pokémon name mapping (to avoid extra API calls)
POKEMON_NAMES = {
    1: "bulbasaur", 2: "ivysaur", 3: "venusaur",
    4: "charmander", 5: "charmeleon", 6: "charizard",
    7: "squirtle", 8: "wartortle", 9: "blastoise",
    10: "caterpie", 11: "metapod", 12: "butterfree",
    13: "weedle", 14: "kakuna", 15: "beedrill",
    16: "pidgey", 17: "pidgeotto", 18: "pidgeot",
    19: "rattata", 20: "raticate",
    21: "spearow", 22: "fearow",
    23: "ekans", 24: "arbok",
    25: "pikachu", 26: "raichu",
    27: "sandshrew", 28: "sandslash",
    29: "nidoran_f", 30: "nidorina", 31: "nidoqueen",
    32: "nidoran_m", 33: "nidorino", 34: "nidoking",
    35: "clefairy", 36: "clefable",
    37: "vulpix", 38: "ninetales",
    39: "jigglypuff", 40: "wigglytuff",
    41: "zubat", 42: "golbat",
    43: "oddish", 44: "gloom", 45: "vileplume",
    46: "paras", 47: "parasect",
    48: "venonat", 49: "venomoth",
    50: "diglett", 51: "dugtrio",
    52: "meowth", 53: "persian",
    54: "psyduck", 55: "golduck",
    56: "mankey", 57: "primeape",
    58: "growlithe", 59: "arcanine",
    60: "poliwag", 61: "poliwhirl", 62: "poliwrath",
    63: "abra", 64: "kadabra", 65: "alakazam",
    66: "machop", 67: "machoke", 68: "machamp",
    69: "bellsprout", 70: "weepinbell", 71: "victreebel",
    72: "tentacool", 73: "tentacruel",
    74: "geodude", 75: "graveler", 76: "golem",
    77: "ponyta", 78: "rapidash",
    79: "slowpoke", 80: "slowbro",
    81: "magnemite", 82: "magneton",
    83: "farfetchd",
    84: "doduo", 85: "dodrio",
    86: "seel", 87: "dewgong",
    88: "grimer", 89: "muk",
    90: "shellder", 91: "cloyster",
    92: "gastly", 93: "haunter", 94: "gengar",
    95: "onix",
    96: "drowzee", 97: "hypno",
    98: "krabby", 99: "kingler",
    100: "voltorb", 101: "electrode",
    102: "exeggcute", 103: "exeggutor",
    104: "cubone", 105: "marowak",
    106: "hitmonlee", 107: "hitmonchan",
    108: "lickitung",
    109: "koffing", 110: "weezing",
    111: "rhyhorn", 112: "rhydon",
    113: "chansey",
    114: "tangela",
    115: "kangaskhan",
    116: "horsea", 117: "seadra",
    118: "goldeen", 119: "seaking",
    120: "staryu", 121: "starmie",
    122: "mr_mime",
    123: "scyther",
    124: "jynx",
    125: "electabuzz",
    126: "magmar",
    127: "pinsir",
    128: "tauros",
    129: "magikarp", 130: "gyarados",
    131: "lapras",
    132: "ditto",
    133: "eevee", 134: "vaporeon", 135: "jolteon", 136: "flareon",
    137: "porygon",
    138: "omanyte", 139: "omastar",
    140: "kabuto", 141: "kabutops",
    142: "aerodactyl",
    143: "snorlax",
    144: "articuno", 145: "zapdos", 146: "moltres",
    147: "dratini", 148: "dragonair", 149: "dragonite",
    150: "mewtwo", 151: "mew",
}


# =============================================================================
# Data Structures
# =============================================================================

class AnimationData(NamedTuple):
    """Metadata for a single animation from AnimData.xml"""
    name: str
    index: int
    frame_width: int
    frame_height: int
    frame_count: int


class SpriteInfo(NamedTuple):
    """Processed sprite information for manifest"""
    id: str
    name: str
    path: str
    frame_width: int
    frame_height: int
    frame_count: int
    directions: int  # Number of direction rows (8 for full, 1 for single)


# =============================================================================
# PMDCollab Integration
# =============================================================================

def fetch_url(url: str, timeout: int = 30) -> bytes | None:
    """Fetch URL content with error handling."""
    try:
        response = requests.get(url, timeout=timeout)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        print(f"  ⚠️  Failed to fetch {url}: {e}")
        return None


def parse_anim_data(xml_content: bytes) -> dict[str, AnimationData]:
    """Parse AnimData.xml to extract animation metadata."""
    animations: dict[str, AnimationData] = {}
    
    try:
        root = ET.fromstring(xml_content)
        anims_elem = root.find("Anims")
        
        if anims_elem is None:
            return animations
        
        for anim_elem in anims_elem.findall("Anim"):
            name_elem = anim_elem.find("Name")
            index_elem = anim_elem.find("Index")
            frame_width_elem = anim_elem.find("FrameWidth")
            frame_height_elem = anim_elem.find("FrameHeight")
            durations_elem = anim_elem.find("Durations")
            
            if name_elem is None or name_elem.text is None:
                continue
            
            name = name_elem.text
            index = int(index_elem.text) if index_elem is not None and index_elem.text else 0
            frame_width = int(frame_width_elem.text) if frame_width_elem is not None and frame_width_elem.text else 48
            frame_height = int(frame_height_elem.text) if frame_height_elem is not None and frame_height_elem.text else 48
            
            # Count frames from Duration elements
            frame_count = len(durations_elem.findall("Duration")) if durations_elem is not None else 1
            
            animations[name] = AnimationData(
                name=name,
                index=index,
                frame_width=frame_width,
                frame_height=frame_height,
                frame_count=frame_count
            )
    
    except ET.ParseError as e:
        print(f"  ⚠️  Failed to parse AnimData.xml: {e}")
    
    return animations


def get_walk_animation(animations: dict[str, AnimationData]) -> AnimationData | None:
    """Get the Walk animation, falling back to Idle if not found."""
    # Try Walk first, then Idle as fallback
    for anim_name in ["Walk", "Idle", "Sleep"]:
        if anim_name in animations:
            return animations[anim_name]
    
    # Return first available animation if neither Walk nor Idle
    if animations:
        return next(iter(animations.values()))
    
    return None


# =============================================================================
# Image Processing
# =============================================================================

def extract_all_directions(
    sprite_sheet: Image.Image,
    anim_data: AnimationData,
) -> tuple[Image.Image, int]:
    """
    Extract animation frames for ALL directions (full sprite sheet).
    
    PMDCollab animation sheets ({Anim}-Anim.png) are organized as:
    - Each row = one direction (Down, DownLeft, Left, UpLeft, Up, UpRight, Right, DownRight)
    - Each column = one frame of the animation
    - Rows: 8 directions total
    
    We keep the full grid structure for Phaser's spritesheet loader.
    Returns: (cropped_sprite_sheet, num_directions)
    """
    fw = anim_data.frame_width
    fh = anim_data.frame_height
    frame_count = anim_data.frame_count
    
    # Validate frame dimensions
    if fw <= 0 or fh <= 0:
        print(f"  ⚠️  Invalid frame dimensions ({fw}x{fh}), using full image")
        return sprite_sheet, 1
    
    # Calculate expected dimensions
    expected_width = fw * frame_count
    expected_height = fh * 8  # 8 directions
    
    # Determine actual number of direction rows
    actual_directions = min(8, sprite_sheet.height // fh) if fh > 0 else 1
    
    if actual_directions < 1:
        print(f"  ⚠️  Sprite sheet height ({sprite_sheet.height}) < frame height ({fh}), using 1 direction")
        actual_directions = 1
    
    # Calculate the crop area to get only the valid frames
    crop_width = min(expected_width, sprite_sheet.width)
    crop_height = fh * actual_directions
    
    # Check if we need to crop at all
    if sprite_sheet.width == crop_width and sprite_sheet.height == crop_height:
        print(f"  ✓ Keeping full sheet: {actual_directions} directions × {frame_count} frames")
        return sprite_sheet, actual_directions
    
    # Crop to remove any padding/extra space
    cropped = sprite_sheet.crop((0, 0, crop_width, crop_height))
    print(f"  ✓ Cropped to {crop_width}×{crop_height}: {actual_directions} directions × {frame_count} frames")
    
    return cropped, actual_directions


# =============================================================================
# Main Processing
# =============================================================================

def download_and_process_pokemon(pokemon_id: int) -> SpriteInfo | None:
    """Download and process a single Pokémon's sprite from SpriteServer."""
    name = POKEMON_NAMES.get(pokemon_id, f"pokemon_{pokemon_id}")
    print(f"📥 Processing #{pokemon_id} ({name})...")
    
    # Pad ID with leading zeros for PMDCollab format
    padded_id = str(pokemon_id).zfill(4)
    
    # Check if we have a cached zip
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = CACHE_DIR / f"{padded_id}_sprites.zip"
    
    if cache_path.exists():
        print(f"  ✓ Using cached zip: {cache_path.name}")
        zip_data = cache_path.read_bytes()
    else:
        # Download sprites.zip from SpriteServer
        zip_url = f"{SPRITESERVER_URL}/{padded_id}/sprites.zip"
        zip_data = fetch_url(zip_url)
        
        if zip_data is None:
            print(f"  ❌ Could not fetch sprites.zip for #{pokemon_id}")
            return None
        
        # Save to cache
        cache_path.write_bytes(zip_data)
        print(f"  ✓ Cached zip to {cache_path.name}")
    
    # Extract files from zip
    try:
        with zipfile.ZipFile(BytesIO(zip_data)) as zf:
            # Read AnimData.xml
            if "AnimData.xml" not in zf.namelist():
                print(f"  ❌ AnimData.xml not found in zip for #{pokemon_id}")
                return None
            
            anim_xml = zf.read("AnimData.xml")
            
            # Parse animation data
            animations = parse_anim_data(anim_xml)
            walk_anim = get_walk_animation(animations)
            
            if walk_anim is None:
                print(f"  ❌ No suitable animation found for #{pokemon_id}")
                return None
            
            print(f"  ✓ Found '{walk_anim.name}' animation: {walk_anim.frame_width}x{walk_anim.frame_height}, {walk_anim.frame_count} frames")
            
            # Read the animation sprite sheet
            anim_name = walk_anim.name  # e.g., "Walk", "Idle"
            anim_filename = f"{anim_name}-Anim.png"
            
            if anim_filename not in zf.namelist():
                print(f"  ❌ {anim_filename} not found in zip for #{pokemon_id}")
                return None
            
            sprite_data = zf.read(anim_filename)
    
    except zipfile.BadZipFile:
        print(f"  ❌ Invalid zip file for #{pokemon_id}")
        return None
    except Exception as e:
        print(f"  ❌ Error extracting zip: {e}")
        return None
    
    # Process sprite
    try:
        sprite_sheet = Image.open(BytesIO(sprite_data))
        sprite_sheet = sprite_sheet.convert("RGBA")
    except Exception as e:
        print(f"  ❌ Failed to open sprite sheet: {e}")
        return None
    
    # Extract all directions from the animation sheet (keep full grid)
    processed_sheet, directions = extract_all_directions(sprite_sheet, walk_anim)
    
    # Save output
    output_path = SPRITES_OUTPUT_DIR / f"{pokemon_id}.png"
    SPRITES_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    processed_sheet.save(output_path, "PNG")
    
    print(f"  ✓ Saved sprite sheet to {output_path}")
    
    return SpriteInfo(
        id=str(pokemon_id),
        name=name,
        path=f"assets/sprites/{pokemon_id}.png",
        frame_width=walk_anim.frame_width,
        frame_height=walk_anim.frame_height,
        frame_count=walk_anim.frame_count,
        directions=directions
    )


def generate_manifest(sprites: list[SpriteInfo]) -> None:
    """Generate manifest.json file."""
    manifest = [
        {
            "id": sprite.id,
            "name": sprite.name,
            "path": sprite.path,
            "frameWidth": sprite.frame_width,
            "frameHeight": sprite.frame_height,
            "frameCount": sprite.frame_count,
            "directions": sprite.directions
        }
        for sprite in sprites
    ]
    
    MANIFEST_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    with open(MANIFEST_OUTPUT_PATH, "w") as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n📄 Generated manifest at {MANIFEST_OUTPUT_PATH}")


# =============================================================================
# CLI
# =============================================================================

def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Download and process PMD-style Pokémon sprites for Phaser.",
        epilog="Examples:\n"
               "  python download_assets.py              # Download default Pokémon\n"
               "  python download_assets.py 1 4 7        # Download specific IDs\n"
               "  python download_assets.py --ids 1,4,7  # Comma-separated IDs",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument(
        "pokemon_ids",
        nargs="*",
        type=int,
        help="Pokémon IDs to download (space-separated)"
    )
    
    parser.add_argument(
        "--ids",
        type=str,
        help="Comma-separated list of Pokémon IDs"
    )
    
    return parser.parse_args()


def main() -> int:
    """Main entry point."""
    args = parse_args()
    
    # Determine which IDs to download
    pokemon_ids: list[int] = []
    
    if args.ids:
        # Parse comma-separated IDs
        pokemon_ids = [int(x.strip()) for x in args.ids.split(",")]
    elif args.pokemon_ids:
        pokemon_ids = args.pokemon_ids
    else:
        pokemon_ids = DEFAULT_POKEMON_IDS
    
    print("=" * 60)
    print("🎮 Poke-Survivor Asset Pipeline")
    print("=" * 60)
    print(f"Downloading {len(pokemon_ids)} Pokémon: {pokemon_ids}")
    print(f"Output directory: {SPRITES_OUTPUT_DIR}")
    print()
    
    # Process each Pokémon
    successful_sprites: list[SpriteInfo] = []
    
    for pokemon_id in pokemon_ids:
        sprite_info = download_and_process_pokemon(pokemon_id)
        if sprite_info:
            successful_sprites.append(sprite_info)
        print()
    
    # Generate manifest
    if successful_sprites:
        generate_manifest(successful_sprites)
    
    # Summary
    print("=" * 60)
    print(f"✅ Successfully processed {len(successful_sprites)}/{len(pokemon_ids)} Pokémon")
    
    if len(successful_sprites) < len(pokemon_ids):
        failed = len(pokemon_ids) - len(successful_sprites)
        print(f"⚠️  Failed to process {failed} Pokémon")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
