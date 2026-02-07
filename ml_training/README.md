# BananaClock ML Training

Google Colab notebooks for training the ML models.

## Notebooks

| Notebook | Description |
|----------|-------------|
| `BananaClock_Training.ipynb` | Train classification and YOLO models |
| `Model_Evaluation.ipynb` | Test and evaluate trained models |

## Datasets

Upload to Google Drive at `My Drive/BananaClock/datasets/`:

| Dataset | Size | Purpose |
|---------|------|---------|
| Kaggle Banana Ripeness | ~230MB | Classification training |
| Mendeley Banana Dataset | ~3.5GB | Additional training data |
| Roboflow YOLO Dataset | ~1GB | Object detection training |

## Training Steps

1. Open `BananaClock_Training.ipynb` in Google Colab
2. **Runtime → Change runtime type → T4 GPU**
3. Run all cells in order
4. Download trained models:
   - `banana_classifier.h5`
   - `banana_yolo.pt`
5. Place models in `backend/trained_models/`

## Expected Output

After training:
- Classification accuracy: ~85-95%
- YOLO mAP50: ~80-90%
