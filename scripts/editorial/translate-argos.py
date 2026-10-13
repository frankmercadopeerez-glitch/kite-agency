import json
import pathlib
import sys

sys.path.insert(0, sys.argv[1])
import ctranslate2
import sentencepiece

package_root = pathlib.Path(sys.argv[2])
processor = sentencepiece.SentencePieceProcessor(model_file=str(package_root / "sentencepiece.model"))
translator = ctranslate2.Translator(
    str(package_root / "model"),
    device="cpu",
    compute_type="int8",
    inter_threads=1,
    intra_threads=1,
)
texts = json.load(sys.stdin)
tokenized = []
for index, text in enumerate(texts):
    try:
        tokenized.append(processor.encode_as_pieces(text))
    except Exception:
        print(f"SentencePiece failed at string {index}: {text!r}", file=sys.stderr)
        raise
translated = []
for offset in range(0, len(tokenized), 4):
    tokens = tokenized[offset:offset + 4]
    results = translator.translate_batch(tokens, beam_size=1, max_batch_size=4)
    translated.extend("".join(result.hypotheses[0]).replace("▁", " ").strip() for result in results)
    print(f"Translated {min(offset + 4, len(texts))}/{len(texts)} strings", file=sys.stderr)
json.dump(translated, sys.stdout, ensure_ascii=False)
