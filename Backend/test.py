# kode untuk mengetes model

import os
import cv2
import numpy as np
from mtcnn import MTCNN
import tensorflow as tf
import keras
from keras.models import load_model
import sys

sys.stdout.reconfigure(encoding='utf-8')  # For Python 3.7+ 
os.environ["PYTHONIOENCODING"] = "utf-8"
# Load the trained model
model = load_model('my_model.h5')

# Initialize MTCNN for face detection
detector = MTCNN()

# Load the label names
label_names = ['Heydar', 'Jefta']  # Replace this with actual label names

# Function to detect and extract face
def extract_face_from_frame(frame, required_size=(160, 160)):
    # Convert the frame to RGB
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Detect faces
    results = detector.detect_faces(image_rgb)
    
    if len(results) > 0:
        # Extract the bounding box from the first detected face
        x1, y1, width, height = results[0]['box']
        x1, y1 = abs(x1), abs(y1)
        x2, y2 = x1 + width, y1 + height
        
        # Crop and resize the face
        face = image_rgb[y1:y2, x1:x2]
        face_resized = cv2.resize(face, required_size)
        return face_resized, (x1, y1, x2, y2)
    else:
        return None, None

# Function to recognize the face
def recognize_face(face_pixels):
    face_pixels = np.expand_dims(face_pixels, axis=0)  # Add batch dimension
    face_pixels = face_pixels.astype('float32') / 255.0  # Normalize

    # Predict the class of the face
    predictions = model.predict(face_pixels)
    predicted_index = np.argmax(predictions)
    confidence = np.max(predictions)
    
    return label_names[predicted_index], confidence

# Open the webcam
cap = cv2.VideoCapture(0)

# Real-time face recognition
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    if not ret:
        break

    # Detect and extract face from the frame
    face, box = extract_face_from_frame(frame)

    if face is not None:
        # Recognize the face
        name, confidence = recognize_face(face)

        # Draw a bounding box around the detected face
        x1, y1, x2, y2 = box
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        
        # Display the label and confidence
        label = f"{name} ({confidence * 100:.2f}%)"
        cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

    # Display the resulting frame
    cv2.imshow('Real-time Face Recognition', frame)

    # Press 'q' to exit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything is done, release the capture and close windows
cap.release()
cv2.destroyAllWindows()