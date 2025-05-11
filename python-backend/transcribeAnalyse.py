import assemblyai as aai
import requests
import os
from collections import defaultdict, Counter
from flask import Flask, request, jsonify
from flask_cors import CORS
import config
import string
import re
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')
from docx import Document
from gtts import gTTS

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
            analysis_result = response.json()
            
            # Add most frequent words using the original text
            most_frequent_words = count_most_frequent_words(transcript_text)
            analysis_result["most_frequent_words"] = most_frequent_words
            analysis_result["original_text"] = transcript_text  # Optional, in case you want to return the text
            
            return analysis_result
        else:
            return {"error": f"Error processing text transcript: {response.json()}"}
    
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}

def extract_text_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    elif ext in ['.doc', '.docx']:
        doc = Document(file_path)
        return '\n'.join([para.text for para in doc.paragraphs])
    
    else:
        raise ValueError("Unsupported file type. Use .txt, .doc, or .docx.")

def convert_text_to_audio(file_path, output_audio_path='output.mp3', lang='en'):
    text = extract_text_from_file(file_path)
    
    if not text.strip():
        raise ValueError("The file appears to be empty or contains no readable text.")
    
    tts = gTTS(text=text, lang=lang)
    tts.save(output_audio_path)
    
    print(f"Audio saved to: {output_audio_path}")


# Function to extract highlights
def highlights_response(results):
    return [{"text": item.text, "count": item.count} for item in results]

# Function to analyze sentiment
def sentiment_response(results):
    overall_counts = {"positive": 0, "neutral": 0, "negative": 0}

    for item in results:
        sentiment = str(item.sentiment).split(".")[-1].upper()
        if sentiment == "POSITIVE":
            overall_counts["positive"] += 1
        elif sentiment == "NEUTRAL":
            overall_counts["neutral"] += 1
        elif sentiment == "NEGATIVE":
            overall_counts["negative"] += 1

    return overall_counts

# Function to extract confidence measure
def confidence_measure(results):
    return {"confidence": results}

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
        "thing": ["thing"],
    }

    # Initialize a dictionary to store counts for each disfluency word or phrase
    disfluency_counts = {key: 0 for key in disfluency_map}

    # Ensure transcript.utterances exists
    utterances = getattr(transcript, "utterances", [])

    # Compile a regex to remove punctuation and convert text to lowercase
    punctuation_remover = re.compile(r'[^\w\s]')
    
    for utterance in utterances:
        # Clean up the utterance text by removing punctuation and converting to lowercase
        cleaned_text = punctuation_remover.sub('', utterance.text.lower())

        # Check for disfluency phrases first (longer phrases first to avoid partial matches)
        for disfluency, variations in disfluency_map.items():
            for variation in variations:
                # Look for the disfluency phrase in the cleaned text
                count = cleaned_text.count(variation.lower())
                disfluency_counts[disfluency] += count
                # Remove the counted phrase to avoid overcounting
                cleaned_text = cleaned_text.replace(variation.lower(), '')

        # Now check for individual words if they aren't part of multi-word phrases
        words = cleaned_text.split()
        for word in words:
            # Check each word in the disfluency map and update the count
            for disfluency, variations in disfluency_map.items():
                if word in variations:
                    disfluency_counts[disfluency] += 1

    return disfluency_counts

def disfluency_count_from_text(text):
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
        "thing": ["thing"],
    }

    disfluency_counts = {key: 0 for key in disfluency_map}

    text = re.sub(r"[^\w\s]", "", text.lower())

    for disfluency, variations in disfluency_map.items():
        for variation in variations:
            disfluency_counts[disfluency] += text.count(variation)

    return disfluency_counts

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
            result = response.json()

            return {
                "status": "success",
                "message": "Text file processed successfully",
                "text": transcript_text,
                "summary": result.get("summary", None),
                "auto_highlights": [
                    {"text": item["text"], "count": item["count"]}
                    for item in result.get("auto_highlights_result", [])
                ],
                "sentiment_analysis": result.get("sentiment_analysis_results", []),
                "confidence": {"confidence": None},  # No confidence score from text
                "disfluencies": disfluency_count_from_text(transcript_text),
                "most_frequent_words": count_most_frequent_words(transcript_text),
            }
        else:
            return {"error": f"Error processing text transcript: {response.json()}"}

    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}

# Function to count the most frequent words
def count_most_frequent_words(transcript_text):
    # Load English stopwords
    stop_words = set(stopwords.words("english"))

    # Remove punctuation and convert to lowercase
    translator = str.maketrans("", "", string.punctuation)
    cleaned_text = transcript_text.translate(translator).lower()
    
    # Split text into words
    words = cleaned_text.split()
    
    # Filter out stopwords
    filtered_words = [word for word in words if word not in stop_words]
    
    # Count word frequencies
    word_counts = Counter(filtered_words)
    
    # Get the 10 most common words
    most_common_words = word_counts.most_common(10)
    
    return most_common_words

# Function to process file
def process_file(file_path):
    file_type = get_file_type(file_path)

    if file_type == "audio":
        transcript = transcribe_audio(file_path)

        if transcript.status == aai.TranscriptStatus.error:
            return {"error": transcript.error}

        return {
            "status": "success",
            "message": "File processed successfully",
            "text": transcript.text,
            "summary": transcript.summary,
            "auto_highlights": highlights_response(transcript.auto_highlights.results) if transcript.auto_highlights else [],
            "sentiment_analysis": sentiment_response(transcript.sentiment_analysis),
            "confidence": confidence_measure(transcript.confidence),
            "disfluencies": disfluency_count(transcript),
            "most_frequent_words": count_most_frequent_words(transcript.text),
        }

    elif file_type == "text":
        # Convert text to audio first
        audio_output_path = os.path.splitext(file_path)[0] + "_converted.mp3"
        try:
            convert_text_to_audio(file_path, output_audio_path=audio_output_path)
            # Then process the generated audio
            return process_file(audio_output_path)
        except Exception as e:
            return {"error": f"Error converting text to audio: {str(e)}"}

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
    
    print("API Response:", result)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

print("API_KEY:", config.API_KEY)
print("UPLOAD_FOLDER:", config.FILE_CONFIG["upload_folder"])
print("AUDIO_EXTENSIONS:", config.FILE_CONFIG["audio_extensions"])
print("TEXT_EXTENSIONS:", config.FILE_CONFIG["text_extensions"])