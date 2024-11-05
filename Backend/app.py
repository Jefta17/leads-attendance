# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import cv2
from mtcnn import MTCNN
import tensorflow as tf
import os

# Inisialisasi aplikasi Flask dan konfigurasi CORS
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# Gunakan path absolut untuk file model
model_path = os.path.join(os.path.dirname(__file__), "model.tflite")
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

# Dapatkan detail input dan output model
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Label yang dimuat langsung dalam file ini
label_names = ['Heydar', 'Jefta']  # Ganti dengan label aktual

# Inisialisasi MTCNN untuk deteksi wajah
detector = MTCNN()

# Fungsi untuk ekstrak wajah dari gambar dan mengubah ukurannya
def extract_face(image_data, required_size=(160, 160)):
    img_str = base64.b64decode(image_data)
    np_arr = np.frombuffer(img_str, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    results = detector.detect_faces(img_rgb)
    if results:
        x1, y1, width, height = results[0]['box']
        x1, y1 = abs(x1), abs(y1)
        x2, y2 = x1 + width, y1 + height
        face = img_rgb[y1:y2, x1:x2]
        face_resized = cv2.resize(face, required_size)
        return face_resized
    else:
        return None

# Fungsi untuk mengenali wajah menggunakan model TensorFlow Lite
def recognize_face(face_pixels):
    face_pixels = np.expand_dims(face_pixels, axis=0).astype('float32') / 255.0
    interpreter.set_tensor(input_details[0]['index'], face_pixels)
    interpreter.invoke()

    predictions = interpreter.get_tensor(output_details[0]['index'])[0]
    predicted_index = np.argmax(predictions)
    confidence = predictions[predicted_index]

    detected_name = label_names[predicted_index]
    return detected_name, confidence

@app.route('/predict', methods=['POST'])
def predict_route():
    try:
        data = request.get_json()
        image_data = data['image'].split(",")[1]

        print("Menerima permintaan dengan data gambar.")

        face = extract_face(image_data)
        if face is not None:
            name, confidence = recognize_face(face)
            if confidence > 0.8:
                return jsonify({
                    "recognized": True,
                    "name": name,
                    "accuracy": f"{confidence * 100:.2f}%"
                })
            else:
                return jsonify({
                    "recognized": False,
                    "name": None,
                    "accuracy": f"{confidence * 100:.2f}%"
                })
        else:
            return jsonify({
                "recognized": False,
                "name": None,
                "accuracy": "0%"
            })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
