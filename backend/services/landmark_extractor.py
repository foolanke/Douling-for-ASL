import cv2
import mediapipe as mp
import json
from pathlib import Path

mp_face_mesh = mp.solutions.face_mesh
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

def extract_landmarks_from_video(video_path, word, show_preview=True):
    """
    Extract hand and face landmarks from a reference video
    
    Args:
        video_path: Path to the reference video file
        word: The ASL word being signed
        show_preview: If True, shows a preview window while processing
    """
    
    print(f"\n{'='*60}")
    print(f"Extracting landmarks from: {video_path}")
    print(f"Word: {word}")
    print(f"{'='*60}\n")
    
    # Initialize MediaPipe
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=2,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    
    face_mesh = mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    
    # Open video
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print(f"❌ Error: Could not open video file: {video_path}")
        return None
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    print(f"📹 Video info:")
    print(f"   FPS: {fps}")
    print(f"   Total frames: {total_frames}")
    print(f"   Duration: {total_frames/fps:.2f} seconds\n")
    
    landmarks_data = []
    frame_count = 0
    frames_with_hands = 0
    
    print("Processing frames...")
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Flip horizontally (mirror mode) - optional, comment out if not needed
        frame = cv2.flip(frame, 1)
        
        # Convert to RGB for MediaPipe
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process with MediaPipe
        results_hands = hands.process(rgb)
        results_face = face_mesh.process(rgb)
        
        # Prepare frame data
        frame_data = {
            'frame_number': frame_count,
            'hands': [],
            'face': None
        }
        
        # Extract hand landmarks
        if results_hands.multi_hand_landmarks:
            frames_with_hands += 1
            
            for hand_idx, hand_landmarks in enumerate(results_hands.multi_hand_landmarks):
                handedness = results_hands.multi_handedness[hand_idx].classification[0].label
                
                landmarks_list = []
                for lm in hand_landmarks.landmark:
                    landmarks_list.append({
                        'x': lm.x,
                        'y': lm.y,
                        'z': lm.z
                    })
                
                frame_data['hands'].append({
                    'handedness': handedness,
                    'landmarks': landmarks_list
                })
                
                # Draw on preview if enabled
                if show_preview:
                    mp_drawing.draw_landmarks(
                        frame,
                        hand_landmarks,
                        mp_hands.HAND_CONNECTIONS,
                        mp_drawing_styles.get_default_hand_landmarks_style(),
                        mp_drawing_styles.get_default_hand_connections_style()
                    )
        
        # Extract face landmarks
        if results_face.multi_face_landmarks:
            face_landmarks_list = []
            for lm in results_face.multi_face_landmarks[0].landmark:
                face_landmarks_list.append({
                    'x': lm.x,
                    'y': lm.y,
                    'z': lm.z
                })
            frame_data['face'] = face_landmarks_list
            
            # Draw on preview if enabled
            if show_preview:
                mp_drawing.draw_landmarks(
                    image=frame,
                    landmark_list=results_face.multi_face_landmarks[0],
                    connections=mp_face_mesh.FACEMESH_CONTOURS,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_contours_style()
                )
        
        landmarks_data.append(frame_data)
        frame_count += 1
        
        # Progress indicator
        if frame_count % 30 == 0:
            print(f"  Processed {frame_count}/{total_frames} frames ({frame_count/total_frames*100:.1f}%)")
        
        # Show preview window
        if show_preview:
            # Add status text
            cv2.putText(frame, f"Frame: {frame_count}/{total_frames}", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, f"Hands detected: {frames_with_hands}", (10, 60),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            
            cv2.imshow("Processing Reference Video (Press Q to skip preview)", frame)
            
            # Press 'q' to skip preview
            if cv2.waitKey(1) & 0xFF == ord('q'):
                show_preview = False
                cv2.destroyAllWindows()
    
    cap.release()
    hands.close()
    face_mesh.close()
    
    if show_preview:
        cv2.destroyAllWindows()
    
    print(f"\n✅ Processing complete!")
    print(f"   Total frames: {frame_count}")
    print(f"   Frames with hands: {frames_with_hands} ({frames_with_hands/frame_count*100:.1f}%)")
    
    if frames_with_hands == 0:
        print(f"\n⚠️ WARNING: No hands detected in any frame!")
        print(f"   The video might have:")
        print(f"   - Hands too far from camera")
        print(f"   - Poor lighting")
        print(f"   - Hands moving too fast")
        return None
    
    # Save JSON
    output_data = {
        'word': word,
        'total_frames': frame_count,
        'frames_with_hands': frames_with_hands,
        'fps': fps,
        'video_file': video_path,
        'frames': landmarks_data
    }
    
    # Create output directory
    Path('reference_landmarks').mkdir(exist_ok=True)
    
    output_path = f'reference_landmarks/{word}.json'
    
    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n💾 Saved landmarks to: {output_path}")
    print(f"📊 File size: {Path(output_path).stat().st_size / 1024:.1f} KB")
    
    return output_path


def extract_multiple_videos(video_folder='reference_videos'):
    """
    Extract landmarks from all videos in a folder
    Assumes videos are named like: hello.mp4, goodbye.mp4, etc.
    """
    
    video_folder = Path(video_folder)
    
    if not video_folder.exists():
        print(f"❌ Folder not found: {video_folder}")
        print(f"   Please create the folder and add your reference videos")
        return
    
    # Find all video files
    video_files = list(video_folder.glob('*.mp4')) + list(video_folder.glob('*.avi')) + list(video_folder.glob('*.mov'))
    
    if not video_files:
        print(f"❌ No video files found in {video_folder}")
        print(f"   Supported formats: .mp4, .avi, .mov")
        return
    
    print(f"\n📁 Found {len(video_files)} video(s) in {video_folder}")
    
    for video_path in video_files:
        # Extract word from filename (without extension)
        word = video_path.stem
        
        print(f"\n{'='*60}")
        print(f"Processing: {video_path.name}")
        print(f"{'='*60}")
        
        extract_landmarks_from_video(str(video_path), word, show_preview=True)
        
        print(f"\n✅ Completed: {word}")
    
    print(f"\n{'='*60}")
    print(f"🎉 All videos processed!")
    print(f"{'='*60}")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🎬 REFERENCE VIDEO LANDMARK EXTRACTOR")
    print("="*60)
    print("\nThis script extracts hand and face landmarks from reference videos")
    print("and saves them as JSON files for comparison with user attempts.\n")
    
    # Choose one of these options:
    
    # OPTION 1: Extract from a single video
    extract_landmarks_from_video('reference_videos/hello.mp4', 'hello', show_preview=True)
    
    # OPTION 2: Extract from all videos in reference_videos folder
    # extract_multiple_videos('reference_videos')
    
    print("\n✅ Done! Your reference landmarks are ready.")
    print("   You can now use these JSON files to compare with user recordings.\n")