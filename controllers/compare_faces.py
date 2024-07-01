import sys
import cv2
import numpy as np
from deepface import DeepFace

MODEL_NAME = 'OpenFace'
THRESHOLD = 0.7

def find_encoding(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Failed to read image: {image_path}")

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        embedding = DeepFace.represent(img_path=image_rgb, model_name=MODEL_NAME)[0]['embedding']
        return embedding
    except Exception as e:
        print(f"Error in find_encoding: {e}")
        raise e

def compare_faces(image_path1, image_path2):
    try:
        encoding1 = find_encoding(image_path1)
        encoding2 = find_encoding(image_path2)

        distance = np.linalg.norm(np.array(encoding1) - np.array(encoding2))
        is_match = distance < THRESHOLD
        return {"match": bool(is_match)}
    except Exception as e:
        print(f"Error in compare_faces: {e}")
        raise e

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python compare_faces.py <image_path1> <image_path2>")
        sys.exit(1)

    image_path1 = sys.argv[1]
    image_path2 = sys.argv[2]
    
    result = compare_faces(image_path1, image_path2)
    print(result)
