import assemblyai as aai
import requests
import os
from collections import defaultdict
from flask import Flask, request, jsonify
from flask_cors import CORS
import config

app = Flask(__name__)
CORS(app)

# Set API Key
aai.settings.api_key = config.API_KEY

AUDIO_EXTENSIONS = config.FILE_CONFIG["audio_extensions"]
TEXT_EXTENSIONS = config.FILE_CONFIG["text_extensions"]
UPLOAD_FOLDER = config.FILE_CONFIG["upload_folder"]
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Function to check file type
def get_file_type(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    if ext in AUDIO_EXTENSIONS:
        return "audio"
    elif ext in TEXT_EXTENSIONS:
        return "text"
    return None

# Function to upload audio for transcription
def transcribe_audio(file_path):
    config = aai.TranscriptionConfig(
        speech_model=aai.SpeechModel.best,
        summarization=True,
        iab_categories=True,
        content_safety=True,
        auto_highlights=True,
        sentiment_analysis=True,
        entity_detection=True,
        speaker_labels=True,
        filter_profanity=True,
        language_detection=True,
        disfluencies=True,
    )

    transcriber = aai.Transcriber(config=config)
    transcript = transcriber.transcribe(file_path)

    return transcript

# Function to analyze a text transcript
def analyze_text_transcript(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            transcript_text = f.read()

        API_KEY = aai.settings.api_key
        headers = {"authorization": API_KEY, "content-type": "application/json"}

        data = {
            "text": transcript_text,
            "sentiment_analysis": True,
            "entity_detection": True,
            "iab_categories": True,
            "auto_highlights": True,
            "disfluencies": True,
        }

        response = requests.post("https://api.assemblyai.com/v2/review", json=data, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Error processing text transcript: {response.json()}"}
    
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}

# Function to extract highlights
def highlights_response(results):
    return [{"text": item.text, "count": item.count} for item in results]

# Function to analyze sentiment
def sentiment_response(results):
    sentiment_counts = defaultdict(lambda: {"POSITIVE": 0, "NEUTRAL": 0, "NEGATIVE": 0})
    
    for item in results:
        speaker = getattr(item, "speaker", "Unknown")  # Use getattr to safely get the speaker
        sentiment = str(item.sentiment).split(".")[-1].upper()  # Extract sentiment label
        sentiment_counts[speaker][sentiment] += 1

    return sentiment_counts

# Function to extract confidence measure
def confidence_measure(results):
    return {"confidence": results}

# Function to count disfluencies
def disfluency_count(transcript):
    disfluency_map = {
        "uh": ["uh"],
        "um": ["um"],
        "you know": ["you know"],
        "like": ["like"],
        "hmm": ["hmm"],
        "mhm": ["mhm"],
        "uh-huh": ["uh-huh"],
        "ah": ["ah"],
        "huh": ["huh"],
        "hm": ["hm"],
        "m": ["m"],
        "thing": ["thing"],
    }

    speaker_counts = {}

    # Ensure transcript.utterances exists
    utterances = getattr(transcript, "utterances", [])

    for utterance in utterances:
        speaker = utterance.speaker if utterance.speaker else "Unknown"
        words = utterance.text.lower().split()

        if speaker not in speaker_counts:
            speaker_counts[speaker] = {word: 0 for word in disfluency_map}

        for word in words:
            for disfluency, variations in disfluency_map.items():
                if word in variations:
                    speaker_counts[speaker][disfluency] += 1

    return speaker_counts

# Function to process file
def process_file(file_path):
    file_type = get_file_type(file_path)

    if file_type == "audio":
        transcript = transcribe_audio(file_path)

        if transcript.status == aai.TranscriptStatus.error:
            return {"error": transcript.error}

        return {
            "text": transcript.text,
            "summary": transcript.summary,
            "auto_highlights": highlights_response(transcript.auto_highlights.results),
            "sentiment_analysis": sentiment_response(transcript.sentiment_analysis),
            "confidence": confidence_measure(transcript.confidence),
            "disfluencies": disfluency_count(transcript),
        }

    elif file_type == "text":
        response = analyze_text_transcript(file_path)

        if "error" in response:
            return {"error": response["error"]}

        return response

    return {"error": "Unsupported file type"}

# Route to upload file and process it
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    file_ext = os.path.splitext(file.filename)[-1].lower()
    if file_ext not in AUDIO_EXTENSIONS and file_ext not in TEXT_EXTENSIONS:
        return jsonify({"error": "Unsupported file type"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)

    result = process_file(file_path)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

print("API_KEY:", config.API_KEY)
print("UPLOAD_FOLDER:", config.FILE_CONFIG["upload_folder"])
print("AUDIO_EXTENSIONS:", config.FILE_CONFIG["audio_extensions"])
print("TEXT_EXTENSIONS:", config.FILE_CONFIG["text_extensions"])