# Welcome to Lexica 👋📖🗣️

Lexica is a web application that analyzes users' speech or uploaded text/audio files, providing personalised feedback on vocabulary usage, filler words, and sentiment.
The frontend was created using React Native with [Expo](https://expo.dev), and the backend using Python with [Flask API](https://flask.palletsprojects.com/en/stable/).

## Running the app locally
You will need two separate terminals.

1. Start the Flask Backend
- Navigate to the [`python-backend`] directory.

- Install the required Python packages.
   ```bash
    pip intall -r requirements.txt
   ```

- Start the Flask API server.
   ```bash
    python transcribeAnalyse.py
   ```

- Ensure that the backend URL (e.g., http://localhost:5000/upload) is correctly set inside the frontend files:
   - [`FileSelectorUpload.js`]
   - [`AudioRecorderUpload.js`]


2. Start the React Native Frontend
- Navigate to the [`react-native-frontend`] directory.

- Install the expo dependencies

   ```bash
   npm install
   ```
- Start the app 
   ```bash
    npx expo start
   ```
- In the terminal, type [`w`] to open the web version in your browser.

## Viewing the app online

The web app is available online @ [Lexica]( https://lexica-vt.vercel.app/)

- Frontend deployed using [Vercel](https://vercel.com/home)
- Backend deployed using [Render](https://render.com/docs/web-services).

## License

This project is licensed under "All Rights Reserved."  
Unauthorized use, copying, or distribution of the code and materials is not permitted without explicit permission from the author.
