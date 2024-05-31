from model import Net

import argparse
import os
import random

import matplotlib.pyplot as plt
import numpy as np
import torch
from PIL import Image

class ConfigL:
    """
    Project's main config.
    """

    clip_model: str = "openai/clip-vit-large-patch14"
    text_model: str = "gpt2-medium"
    seed: int = 100
    num_workers: int = 2
    train_size: int = 0.84
    val_size: int = 0.13
    epochs: int = 120
    lr: int = 5e-3
    k: float = 0.3
    batch_size_exp: int = 5
    ep_len: int = 4
    num_layers: int = 5
    n_heads: int = 16
    forward_expansion: int = 4
    max_len: int = 40
    dropout: float = 0.08
    weights_dir: str = os.path.join("weights", "large")
config = ConfigL() 

random.seed(config.seed)
np.random.seed(config.seed)
torch.manual_seed(config.seed)
torch.cuda.manual_seed(config.seed)
torch.backends.cudnn.deterministic = True

is_cuda = torch.cuda.is_available()
device = "cuda" if is_cuda else "cpu"

ckp_path = "training\weights\large\model.pt"

caption_model = Net(
    clip_model=config.clip_model,
    text_model=config.text_model,
    ep_len=config.ep_len,
    num_layers=config.num_layers,
    n_heads=config.n_heads,
    forward_expansion=config.forward_expansion,
    dropout=config.dropout,
    max_len=config.max_len,
    device=device,
)

checkpoint = torch.load(ckp_path, map_location=device)
caption_model.load_state_dict(checkpoint)

caption_model.eval()
